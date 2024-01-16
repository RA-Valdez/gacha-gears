const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const verifyAdmin = require('../../functions/verifyAdmin');
const Builds = require('../../models/Builds');
const Relics = require('../../models/Relics');

router.get('/test', (req, res) => res.send('relics route testing!'));

// GET ALL
router.get('/', (req, res) => {
  Relics.find().sort({_id: -1}).populate("zone", "name")
    .then(relics => res.json(relics))
    .catch(err => res.status(404).json({ norelicsfound: 'No Relics found' }));
});

// GET by ID
router.get('/:id', (req, res) => {
  Relics.findById(req.params.id)
    .then(relic => res.json(relic))
    .catch(err => res.status(404).json({ norelicfound: 'No Relic found' }));
});

// POST new
router.post('/', asyncHandler(async (req, res) => {
  const isAdmin = await verifyAdmin(req.cookies.token);
  if (!isAdmin) res.sendStatus(401);
  else
    Relics.create(req.body)
      .then(relic => res.json({ msg: 'Relic added successfully' }))
      .catch(err => res.status(400).json({ error: 'Unable to add this relic' }));
}));

// PUT in ID
router.put('/:id', asyncHandler(async (req, res) => {
  const isAdmin = await verifyAdmin(req.cookies.token);
  if (!isAdmin) res.sendStatus(401);
  else
    Relics.findByIdAndUpdate(req.params.id, req.body)
      .then(relic => res.json({ msg: 'Updated successfully' }))
      .catch(err =>
        res.status(400).json({ error: 'Unable to update the Database' })
      );
}));

// Delete by ID
router.delete('/:id', asyncHandler(async (req, res, next) => {
  const isAdmin = await verifyAdmin(req.cookies.token);
  if (!isAdmin) res.sendStatus(401);
  else {
    const depCount = await Builds.countDocuments({ relic: req.params.id }).exec();
    if (depCount > 0) {
      res.json({ depCount: depCount });
    } else {
      Relics.findByIdAndRemove(req.params.id, req.body)
        .then(relic => res.json({ mgs: 'Relic entry deleted successfully' }))
        .catch(err => res.status(404).json({ error: 'No such a relic' }));
    }
  }
}));

module.exports = router;