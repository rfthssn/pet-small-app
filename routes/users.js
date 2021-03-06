const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/registration', async (req, res) => {
  const {name, email, password} = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({msg: 'Please enter all fields'});
  }

  User.findOne({ email })
    .then(user => {
      if (user) return res.status(400).json({msg: 'User already exists'});

      const newUser = new User({
        name,
        email,
        password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
              throw err};
          newUser.password = hash;
          newUser.save()
            .then(user => {
              jwt.sign(
                {id: user.id},
                process.env.JWT_KEY,
                (err, token) => {
                  if (err) {
                  throw err};

                  res.json({
                    token,
                    user: {
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      isAdmin: user.isAdmin
                    }
                  });
                }
                )

              
            });
        })
      })
    })
});


router.post('/login', async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({msg: 'Please enter all fields'});
  }

  User.findOne({ email })
    .then(user => {
      if (!user) return res.status(400).json({msg: 'User does not exist'});

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) return res.status(400).json({msg: 'Invalid credentials'});

          jwt.sign(
                {id: user.id},
                process.env.JWT_KEY,
                (err, token) => {
                  if (err) throw err;

                  res.json({
                    token,
                    user: {
                      id: user.id,
                      name: user.name,
                      email: user.email
                    }
                  });
                }
                )
        })


    })
    .catch((error) => {
        
      res.status(400).json({msg: 'User does not exist'});
    })
});

module.exports = router;