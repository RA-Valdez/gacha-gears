const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const verifyAdmin = require('../../functions/verifyAdmin');
const Builds = require('../../models/Builds');
const Characters = require('../../models/Characters');
const Relics = require('../../models/Relics');
const Ornaments = require('../../models/Ornaments');
const Zones = require('../../models/Zones');
const { default: mongoose, Document } = require('mongoose');

router.get('/test', (req, res) => res.send('builds route testing!'));

// GET ALL
router.post('/builds/:local', asyncHandler(async (req, res) => {
  var buildsArr = [];
  if (req.params.local == "false") buildsArr = await Builds.find({}, "-__v");
  try {
    for (let c of req.body) {
      buildsArr.push(new Builds(c));
    }
  } catch (err) { /*console.log("no req array");*/ }
  buildsArr = await Builds.populate(buildsArr, { path: "character", select: "name rarity" });
  buildsArr = await Builds.populate(buildsArr, { path: "relic", select: "name" });
  buildsArr = await Builds.populate(buildsArr, { path: "ornament", select: "name" });
  res.json(buildsArr);
}));

// Grouped by Relics
router.post('/relics/:local', asyncHandler(async (req, res, next) => {
  var resObject = [];

  const [zones, relics] = await Promise.all([
    Zones.find({ type: "Relic" }).exec(),
    Relics.find().exec(),
  ]);

  var builds = [];
  if (req.params.local == "false") builds = await Builds.find({}, "-__v");

  try {
    for (let c of req.body) {
      builds.push(new Builds(c));
    }
  } catch (err) { /*console.log("no req array");*/ }
  builds = await Builds.populate(builds, { path: "character", select: "name rarity" });
  builds = await Builds.populate(builds, { path: "relic", select: "name" });
  builds = await Builds.populate(builds, { path: "ornament", select: "name" });

  for (const zone in zones) {
    const relicArr = [];
    for (const relic in relics) {
      if (relics[relic].zone.toString() === zones[zone]._id.toString()) {
        const buildArr = [];
        for (const build in builds) {
          //console.log(builds[build]);
          if (builds[build].relic[0]._id.toString() === relics[relic]._id.toString()) {
            buildArr.push(builds[build]);
          } else if (builds[build].relic[builds[build].relic.length - 1]._id.toString() === relics[relic]._id.toString()) {
            buildArr.push(builds[build]);
          }
        }
        if (buildArr.length > 0) relicArr.push({ relic: relics[relic], builds: buildArr });
      }
    }
    if (relicArr.length > 0) resObject.push({ zone: zones[zone], relics: relicArr });
  }
  res.json(resObject);
}));

// Grouped by Ornaments
router.post('/ornaments/:local', asyncHandler(async (req, res, next) => {
  var resObject = [];
  const [zones, ornaments] = await Promise.all([
    Zones.find({ type: "Ornament" }).exec(),
    Ornaments.find().exec(),
  ]);

  var builds = [];
  if (req.params.local == "false") builds = await Builds.find({}, "-__v");

  try {
    for (let c of req.body) {
      builds.push(new Builds(c));
    }
  } catch (err) { /*console.log("no req array");*/ }
  builds = await Builds.populate(builds, { path: "character", select: "name rarity" });
  builds = await Builds.populate(builds, { path: "relic", select: "name" });
  builds = await Builds.populate(builds, { path: "ornament", select: "name" });

  for (const zone in zones) {
    const ornamentArr = [];
    for (const ornament in ornaments) {
      if (ornaments[ornament].zone.toString() === zones[zone]._id.toString()) {
        const buildArr = [];
        for (const build in builds) {
          if (builds[build].ornament._id.toString() === ornaments[ornament]._id.toString()) {
            buildArr.push(builds[build]);
          }
        }
        if (buildArr.length > 0) ornamentArr.push({ ornament: ornaments[ornament], builds: buildArr });
      }
    }
    if (ornamentArr.length > 0) resObject.push({ zone: zones[zone], ornaments: ornamentArr });
  }
  res.json(resObject);
}));

// Get Fields
router.get('/fields', asyncHandler(async (req, res, next) => {
  const [characters, relics, ornaments, zones] = await Promise.all([
    Characters.find().select("name rarity").exec(),
    Relics.find().select("name").exec(),
    Ornaments.find().select("name").exec(),
    Zones.find().exec(),
  ]);
  res.json({ characters: characters, relics: relics, ornaments: ornaments, zones: zones });
}))

// GET by ID
router.get('/:id', (req, res) => {
  Builds.findById(req.params.id)
    .then(build => res.json(build))
    .catch(err => res.status(404).json({ nobuildfound: 'No Build found' }));
});

// POST new
router.post('/', asyncHandler(async (req, res) => {
  const isAdmin = await verifyAdmin(req.cookies.token);
  if (!isAdmin) {
    req.body.lb = true;
    const build = new Builds(req.body);
    res.json(build);
  }
  else
    Builds.create(req.body)
      .then(build => res.json({ msg: 'Build added successfully' }))
      .catch(err => res.status(400).json({ error: 'Unable to add this build' }));
}));

// PUT in ID
router.put('/:id', asyncHandler(async (req, res) => {
  const isAdmin = await verifyAdmin(req.cookies.token);
  if (req.body.lb) {
    const build = new Builds(req.body);
    res.json(build);
  } else {
    if (!isAdmin) { res.sendStatus(401); }
    else
      Builds.findByIdAndUpdate(req.params.id, req.body)
        .then(build => res.json({ msg: 'Updated successfully' }))
        .catch(err =>
          res.status(400).json({ error: 'Unable to update the Database' })
        );
  }
}));

// Delete by ID
router.delete('/:id', asyncHandler(async (req, res) => {
  const isAdmin = await verifyAdmin(req.cookies.token);
  if (!isAdmin) res.sendStatus(401);
  else
    Builds.findByIdAndRemove(req.params.id, req.body)
      .then(build => res.json({ mgs: 'Build entry deleted successfully' }))
      .catch(err => res.status(404).json({ error: 'No such a build' }));
}));

module.exports = router;