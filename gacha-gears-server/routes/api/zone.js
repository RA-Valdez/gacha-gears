const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const verifyAdmin = require('../../functions/verifyAdmin');
const Zones = require('../../models/Zones');
const Relics = require('../../models/Relics');
const Ornaments = require('../../models/Ornaments');

router.get('/test', (req, res) => res.send('zones route testing!'));

// GET ALL
router.get('/', (req, res) => {
  Zones.find().sort({_id: -1})
    .then(zones => res.json(zones))
    .catch(err => res.status(404).json({ nozonesfound: 'No Zones found' }));
});

// GET by type
router.get('/:type', (req, res) => {
  Zones.find({ type: req.params.type })
    .then(zone => res.json(zone))
    .catch(err => res.status(404).json({ nozonefound: 'No Zone found' }));
});

// POST new
router.post('/', asyncHandler(async (req, res) => {
  const isAdmin = await verifyAdmin(req.cookies.token);
  if (!isAdmin) res.sendStatus(401);
  else
    Zones.create(req.body)
      .then(zone => res.json({ msg: 'Zone added successfully' }))
      .catch(err => res.status(400).json({ error: 'Unable to add this zone' }));
}));

// PUT in ID
router.put('/:id', asyncHandler(async (req, res) => {
  const isAdmin = await verifyAdmin(req.cookies.token);
  if (!isAdmin) res.sendStatus(401);
  else
    Zones.findByIdAndUpdate(req.params.id, req.body)
      .then(zone => res.json({ msg: 'Updated successfully' }))
      .catch(err =>
        res.status(400).json({ error: 'Unable to update the Database' })
      );
}));

// Delete by ID
router.delete('/:id', asyncHandler(async (req, res, next) => {
  const isAdmin = await verifyAdmin(req.cookies.token);
  if (!isAdmin) res.sendStatus(401);
  else {
    var resObject = {};
    const [relicDep, ornamentDep] = await Promise.all([
      Relics.find({ zone: req.params.id }).exec(),
      Ornaments.find({ zone: req.params.id }).exec(),
    ]);
    if (relicDep.length > 0 || ornamentDep.length > 0) {
      resObject = { ...resObject, msg: "Deletion Failed: Dependencies" };
      var deps = [];

      if (relicDep.length > 0) {
        resObject = { ...resObject, type: "Relic" };
        for (const relic of relicDep) {
          deps.push(relic.name)
        }
      } else if (ornamentDep.length > 0) {
        resObject = { ...resObject, type: "Ornament" };
        for (const ornament of ornamentDep) {
          deps.push(ornament.name);
        }
      }
      resObject = { ...resObject, deps: deps.join(", ") };
      res.json(resObject);
    } else {
      Zones.findByIdAndRemove(req.params.id, req.body)
        .then((zone) => res.json({ msg: "Zone entry deleted successfully" }))
        .catch((err) => res.status(404).json({ error: err }));
    }
  }
}));

module.exports = router;