const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const verifyAdmin = require('../../functions/verifyAdmin');
const Builds = require('../../models/Builds');
const Ornaments = require('../../models/Ornaments');

router.get('/test', (req, res) => res.send('ornaments route testing!'));

// GET ALL
router.get('/', (req, res) => {
  Ornaments.find().sort({_id: -1}).populate("zone", "name")
    .then(ornaments => res.json(ornaments))
    .catch(err => res.status(404).json({ noornamentsfound: 'No Ornaments found' }));
});

// GET by ID
router.get('/:id', (req, res) => {
  Ornaments.findById(req.params.id)
    .then(ornament => res.json(ornament))
    .catch(err => res.status(404).json({ noornamentfound: 'No Ornament found' }));
});

// POST new
router.post('/', asyncHandler(async (req, res) => {
  const isAdmin = await verifyAdmin(req.cookies.token);
  if (!isAdmin) res.sendStatus(401);
  else
    Ornaments.create(req.body)
      .then(ornament => res.json({ msg: 'Ornament added successfully' }))
      .catch(err => res.status(400).json({ error: 'Unable to add this ornament' }));
}));

// PUT in ID
router.put('/:id', asyncHandler(async (req, res) => {
  const isAdmin = await verifyAdmin(req.cookies.token);
  if (!isAdmin) res.sendStatus(401);
  else
    Ornaments.findByIdAndUpdate(req.params.id, req.body)
      .then(ornament => res.json({ msg: 'Updated successfully' }))
      .catch(err =>
        res.status(400).json({ error: 'Unable to update the Database' })
      );
}));

// Delete by ID
router.delete('/:id', asyncHandler(async (req, res, next) => {
  const isAdmin = await verifyAdmin(req.cookies.token);
  if (!isAdmin) res.sendStatus(401);
  else {
    const depCount = await Builds.countDocuments({ ornament: req.params.id }).exec();
    if (depCount > 0) {
      res.json({ depCount: depCount });
    } else {
      Ornaments.findByIdAndRemove(req.params.id, req.body)
        .then(ornament => res.json({ mgs: 'Ornament entry deleted successfully' }))
        .catch(err => res.status(404).json({ error: 'No such a ornament' }));
    }
  }
}));

module.exports = router;