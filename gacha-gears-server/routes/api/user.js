const argon2 = require('argon2');
const express = require('express');
const asyncHandler = require('express-async-handler');
const jose = require('jose');

const router = express.Router();
const Users = require('../../models/Users');

router.get('/test', (req, res) => res.send('users route testing!'));

// GET ALL
/*
router.get('/', (req, res) => {
  Users.find()
    .then(users => res.json(users))
    .catch(err => res.status(404).json({ nousersfound: 'No Users found' }));
});
*/

// GET by ID
/*
router.get('/:id', (req, res) => {
  Users.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(404).json({ nouserfound: 'No User found' }));
});
*/

// POST register
/*
router.post('/register', asyncHandler(async (req, res, next) => {
  var user = req.body;
  try {
    const [emailHash, passHash] = await Promise.all([
      argon2.hash(user.email),
      argon2.hash(user.password),
    ]);
    user.email = emailHash;
    user.password = passHash;
    user.role = "admin";
    Users.create(user)
      .then(user => res.json({ msg: 'Build added successfully' }))
      .catch(err => res.status(400).json({ error: 'Unable to add this build' }));
  } catch (err) {
    //console.log(err);
  }
}));
*/

// POST log in
router.post('/login', asyncHandler(async (req, res, next) => {
  const user = await Users.find({ username: req.body.username }).exec();
  if (user.length > 0) {
    try {
      if (await argon2.verify(user[0].password, req.body.password)) {
        const jwt = await new jose.SignJWT({ role: user[0].role })
          .setProtectedHeader({ alg: process.env.API_ALG })
          .setIssuedAt()
          .setIssuer(process.env.API_ISSUER)
          .setAudience(process.env.API_AUDIENCE)
          .setExpirationTime(process.env.API_EXPIRE_TIME)
          .sign(new TextEncoder().encode(process.env.API_KEY));
        res.cookie('token', jwt, { httpOnly: true, maxAge: 7200000 });
        res.cookie('public-token', user[0].username, { maxAge: 7200000 });
        res.send("token sent");
      }
      else {
        res.status(401).send();
      }
    } catch (err) {
      //console.log(err);
    }
  } else {
    res.status(401).send();
  }
}))

// POST log out
router.post('/logout', (req, res) => {
  res.clearCookie('token', {httpOnly: true});
  res.clearCookie('public-token');
  res.send();
});

// PUT in ID
/*
router.put('/:id', (req, res) => {
  Users.findByIdAndUpdate(req.params.id, req.body)
    .then(user => res.json({ msg: 'Updated successfully' }))
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});
*/

// Delete by ID
/*
router.delete('/:id', (req, res) => {
  Users.findByIdAndRemove(req.params.id, req.body)
    .then(user => res.json({ mgs: 'User entry deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such a user' }));
});
*/

module.exports = router;