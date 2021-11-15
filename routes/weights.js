const router = require('express').Router();
let pet_weight = require('../models/pet_weight');
const auth = require('../middleware/auth');
const User = require('../models/user');

router.get('/', auth , async (req, res) => {
  try {
    const user = await User.findById(req.user.id); 

    pet_weight.find({user: user.email}).then(pet_weight=> {
      if (!pet_weight) throw Error(`pet's weight do not exist`);
      res.json(pet_weight);
    });

    
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.post('/add', auth,  async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let new_pet_weight= new pet_weight({
      user: user.email,
      weight_in_kg: req.body.weight_in_kg
    });


   // if(user.email != new_pet_weight.user) throw Error(`user does not exist`);
    
    await new_pet_weight.save();
    res.json(new_pet_weight);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


module.exports = router;