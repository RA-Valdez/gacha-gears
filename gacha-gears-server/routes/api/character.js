const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const verifyAdmin = require('../../functions/verifyAdmin');
const Builds = require('../../models/Builds');
const Characters = require('../../models/Characters');

router.get('/test', (req, res) => res.send('characters route testing!'));

// GET ALL
router.get('/', (req, res) => {
  Characters.find().sort({_id: -1})
    .then(characters => res.json(characters))
    .catch(err => res.status(404).json({ nocharactersfound: 'No Characters found' }));
});

// GET by ID
router.get('/:id', (req, res) => {
  Characters.findById(req.params.id)
    .then(character => res.json(character))
    .catch(err => res.status(404).json({ nocharacterfound: 'No Character found' }));
});

// POST new
router.post('/', asyncHandler(async (req, res) => {
  const isAdmin = await verifyAdmin(req.cookies.token);
  if (!isAdmin) res.sendStatus(401);
  else
    Characters.create(req.body)
      .then(character => res.json({ msg: 'Character added successfully' }))
      .catch(err => res.status(400).json({ error: 'Unable to add this character' }));
}));

// PUT in ID
router.put('/:id', asyncHandler(async (req, res) => {
  const isAdmin = await verifyAdmin(req.cookies.token);
  if (!isAdmin) res.sendStatus(401);
  else
    Characters.findByIdAndUpdate(req.params.id, req.body)
      .then(character => res.json({ msg: 'Updated successfully' }))
      .catch(err =>
        res.status(400).json({ error: 'Unable to update the Database' })
      );
}));

// Delete by ID
router.delete('/:id', asyncHandler(async (req, res, next) => {
  const isAdmin = await verifyAdmin(req.cookies.token);
  if (!isAdmin) res.sendStatus(401);
  else {
    const depCount = await Builds.countDocuments({ character: req.params.id }).exec();
    if (depCount > 0) {
      res.json({ depCount: depCount });
    } else {
      Characters.findByIdAndRemove(req.params.id, req.body)
        .then(character => res.json({ mgs: 'Character entry deleted successfully' }))
        .catch(err => res.status(404).json({ error: 'No such a character' }));
    }
  }
}));

module.exports = router;