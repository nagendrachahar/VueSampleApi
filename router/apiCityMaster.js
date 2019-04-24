var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const cors = require('cors');

var jwt = require('jsonwebtoken');
var config = require('../config');

// Require Branch model in our routes module

const City = require('../model/masters/city.model');

let State = require('../model/masters/state.model');



router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

router.use(cors());


var verifyToken = function(req, res, next){
  
  var token = req.headers['x-token'];
  if (!token) {
    req.status = 200;
    const error = new Error("No token provided.");
    next(error);
  }
  else{
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        req.status = 200;
        const error = new Error("Failed to authenticate token.");
        next(error);
      }
      else{
        res.locals.decoded = decoded; 
        next();
      } 
    });
  }
}

router.post('/api/SaveCity', verifyToken, async (req,res, next) => {
  
  if(res.locals.decoded.userType === 'Admin'){
    let data = req.body;

    const state = await State.findOne({_id:data.stateId});

    data.stateId=state._id;
    
    let city = new City(data);

    await city.save();

    res.status(200).json({
      resType: 'success',
      message: 'city saved',
      city:city
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

router.get('/api/getCity', verifyToken, async (req,res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const city = await City.find().populate('stateId').exec();

      res.status(200).json({
        resType: 'success',
        city: city
      });
      
  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
   }
});

// Defined edit route
router.get('/api/getCityById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    let id = req.params.id;

    const city = await City.findById(id);

    res.status(200).json({
      resType: 'success',
      message: '',
      city: city
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
  
});

//  Defined update route
router.post('/api/updateCityById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const city = await City.findById(req.params.id);

    city.stateId = req.body.stateId;
    city.cityName = req.body.cityName;

    await city.save();

    res.status(200).json({
      resType: 'success',
      message: 'city updated',
      city: city
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
 
});

router.delete('/api/deleteCity/:id',verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    
    const city = await City.findByIdAndRemove({_id: req.params.id});
    
    res.status(200).json({
      resType: 'success',
      message: 'city removed',
      city: city
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

// get city list by stateid
router.get('/api/getCityByStateId/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    let id = req.params.id;

    const city = await City.find({ stateId: id});

    res.status(200).json({
      resType: 'success',
      message: '',
      city: city
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
  
});

module.exports = router;
