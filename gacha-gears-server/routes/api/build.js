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

// Combined Builds
router.post('/', asyncHandler(async (req, res) => {
  // Variables
  const filter = req.body.filter;
  const buildSort = req.body.buildSort;
  const view = req.body.view;
  const areaSort = req.body.areaSort;
  const localBuilds = req.body.localBuilds;
  var allBuilds = [];
  var areaObject = [];
  var resObject;

  // Build Sort Functions
  function BLBd(d1, d2) {
    const str1 = "" + d1._id;
    const str2 = "" + d2._id;
    return str2.localeCompare(str1);
  }
  function BLBu(d1, d2) {
    const str1 = "" + d1._id;
    const str2 = "" + d2._id;
    return str1.localeCompare(str2);
  }
  function BLCd(d1, d2) {
    const str1 = "" + d1.character._id;
    const str2 = "" + d2.character._id;
    return str2.localeCompare(str1);
  }
  function BLCu(d1, d2) {
    const str1 = "" + d1.character._id;
    const str2 = "" + d2.character._id;
    return str1.localeCompare(str2);
  }
  function BCNd(d1, d2) {
    const str1 = "" + d1.character.name;
    const str2 = "" + d2.character.name;
    return str1.localeCompare(str2);
  }
  function BCNu(d1, d2) {
    const str1 = "" + d1.character.name;
    const str2 = "" + d2.character.name;
    return str2.localeCompare(str1);
  }
  function BCRd(d1, d2) {
    const str1 = "" + d1.character.rarity;
    const str2 = "" + d2.character.rarity;
    return str2.localeCompare(str1);
  }
  function BCRu(d1, d2) {
    const str1 = "" + d1.character.rarity;
    const str2 = "" + d2.character.rarity;
    return str1.localeCompare(str2);
  }
  // Area Sort Functions
  function ALAd(d1, d2) {
    const str1 = "" + d1.zone._id;
    const str2 = "" + d2.zone._id;
    return str2.localeCompare(str1);
  }
  function ALAu(d1, d2) {
    const str1 = "" + d1.zone._id;
    const str2 = "" + d2.zone._id;
    return str1.localeCompare(str2);
  }
  function AANd(d1, d2) {
    const str1 = "" + d1.zone.name;
    const str2 = "" + d2.zone.name;
    return str1.localeCompare(str2);
  }
  function AANu(d1, d2) {
    const str1 = "" + d1.zone.name;
    const str2 = "" + d2.zone.name;
    return str2.localeCompare(str1);
  }

  // Main Logic
  // Build Gathering
  if (filter == "all" || filter == "admin") {
    allBuilds = await Builds.find({}, "-__v");
  }
  if (filter == "all" || filter == "local") {
    try {
      for (let build of localBuilds) allBuilds.push(new Builds(build));
    } catch (err) { }
  }
  // Build Population
  allBuilds = await Builds.populate(allBuilds, { path: "character", select: "name rarity" });
  allBuilds = await Builds.populate(allBuilds, { path: "relic", select: "name" });
  allBuilds = await Builds.populate(allBuilds, { path: "ornament", select: "name" });
  // Build Sorting
  allBuilds.sort(BLBd);
  switch (buildSort) {
    case "BLBd":
      allBuilds.sort(BLBd);
      break;
    case "BLBu":
      allBuilds.sort(BLBu);
      break;
    case "BLCd":
      allBuilds.sort(BLCd);
      break;
    case "BLCu":
      allBuilds.sort(BLCu);
      break;
    case "BCNd":
      allBuilds.sort(BCNd);
      break;
    case "BCNu":
      allBuilds.sort(BCNu);
      break;
    case "BCRd":
      allBuilds.sort(BCRd);
      break;
    case "BCRu":
      allBuilds.sort(BCRu);
      break;
  }
  // View
  switch (view) {
    case "Builds":
      resObject = allBuilds;
      break;
    case "Relics":
      var [zones, relics] = await Promise.all([
        Zones.find({ type: "Relic" }).exec(),
        Relics.find().exec(),
      ]);
      for (const zone in zones) {
        const relicArr = [];
        for (const relic in relics) {
          if (relics[relic].zone.toString() === zones[zone]._id.toString()) {
            const buildArr = [];
            for (const build in allBuilds) {
              if (allBuilds[build].relic[0]._id.toString() === relics[relic]._id.toString()) {
                buildArr.push(allBuilds[build]);
              } else if (allBuilds[build].relic[allBuilds[build].relic.length - 1]._id.toString() === relics[relic]._id.toString()) {
                buildArr.push(allBuilds[build]);
              }
            }
            if (buildArr.length > 0) relicArr.push({ relic: relics[relic], builds: buildArr });
          }
        }
        if (relicArr.length > 0) areaObject.push({ zone: zones[zone], relics: relicArr });
      }
      break;
    case "Ornaments":
      var [zones, ornaments] = await Promise.all([
        Zones.find({ type: "Ornament" }).exec(),
        Ornaments.find().exec(),
      ]);
      for (const zone in zones) {
        const ornamentArr = [];
        for (const ornament in ornaments) {
          if (ornaments[ornament].zone.toString() === zones[zone]._id.toString()) {
            const buildArr = [];
            for (const build in allBuilds) {
              if (allBuilds[build].ornament._id.toString() === ornaments[ornament]._id.toString()) {
                buildArr.push(allBuilds[build]);
              }
            }
            if (buildArr.length > 0) ornamentArr.push({ ornament: ornaments[ornament], builds: buildArr });
          }
        }
        if (ornamentArr.length > 0) areaObject.push({ zone: zones[zone], ornaments: ornamentArr });
      }
      break;
  }
  // Build Sorting
  if (view == "Relics" || view == "Ornaments") {
    switch (areaSort) {
      case "ALAd":
        areaObject.sort(ALAd);
        break;
      case "ALAu":
        areaObject.sort(ALAu);
        break;
      case "AANd":
        areaObject.sort(AANd);
        break;
      case "AANu":
        areaObject.sort(AANu);
        break;
    }
    resObject = areaObject;
  }
  // Response
  res.json(resObject);
}));

// Get Fields
router.get('/fields', asyncHandler(async (req, res, next) => {
  const [characters, relics, ornaments, zones] = await Promise.all([
    Characters.find().select("name rarity").sort({ _id: -1 }).exec(),
    Relics.find().select("name").sort({ _id: -1 }).exec(),
    Ornaments.find().select("name").sort({ _id: -1 }).exec(),
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

// POST new admin build
router.post('/admin', asyncHandler(async (req, res) => {
  const isAdmin = await verifyAdmin(req.cookies.token);
  if (!isAdmin) {
    res.sendStatus(401);
  }
  else {
    Builds.create(req.body)
      .then(build => res.json({ msg: 'Build added successfully' }))
      .catch(err => res.sendStatus(400));
  }
}));

// POST new local build
router.post('/local', asyncHandler(async (req, res) => {
  try {
    req.body.lb = true;
    const build = new Builds(req.body);
    res.json(build);
  } catch (e) {
    res.sendStatus(400);
  }
}));

// PUT in ID
router.put('/:id', asyncHandler(async (req, res) => {
  const isAdmin = await verifyAdmin(req.cookies.token);
  if (req.body.lb) {
    var build = new Builds(req.body);
    build._id = new mongoose.Types.ObjectId();
    res.json({ oid: req.params.id, build: build });
  } else {
    if (!isAdmin) { res.sendStatus(401); }
    else {
      var build = req.body;
      build._id = new mongoose.Types.ObjectId();
      await Builds.findByIdAndRemove(req.params.id)
        .then(a => {
          Builds.create(build)
            .then(build => res.json({ msg: 'Updated successfully' }))
            .catch(err =>
              res.status(400).json({ error: 'Unable to update the Database' })
            );
        })
        .catch(err =>
          res.status(400).json({ error: 'Unable to update the Database' })
        );
    }
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