var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const cors = require('cors');

var jwt = require('jsonwebtoken');
var config = require('../config');

// Require Branch model in our routes module
let State = require('../model/masters/state.model');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

router.use(cors());


var verifyToken = function(req, res, next){
  
  var token = req.headers['x-token'];
  if (!token) {
    res.status(200).json({ resType: 'failed', message: 'No token provided.' });
  }
  else{
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        res.status(200).json({ resType: 'failed', message: 'Failed to authenticate token.' });
      }
      else{
        res.locals.decoded = decoded; 
        next();
      } 
    });
  }
}

router.post('/api/SaveState', verifyToken, function(req,res){
  
  if(res.locals.decoded.userType === 'Admin'){
    let data = req.body;
    
    let state = new State(data);

    state.save().then(state => {

      res.status(200).json({
        resType: 'success',
        message: 'state successfully saved',
        state: state
      });
    })
    .catch(err => {
      res.status(200).json({
        resType: 'failed',
        message: 'Error in save'
      });
    });

  }
  else{
    res.status(200).json({
      resType: 'failed',
      message: 'you have no permission'
    });
  }
});


router.get('/api/getState', verifyToken, function(req,res){
  if(res.locals.decoded.userType === 'Admin'){
    State.find(function(err, state){
      if(err){
        res.status(200).json({
          resType: 'failed',
          message: 'Error'
        });
      }
      else {
        res.status(200).json({
          resType: 'success',
          state: state
        });
      }
    });
  }
  else{
    res.status(200).json({
      resType: 'failed',
      message: 'you have no permission'
    });
  }

});

// Defined edit route
router.get('/api/getStateById/:id', verifyToken, function (req, res) {
  if(res.locals.decoded.userType === 'Admin'){
    let id = req.params.id;
    State.findById(id, function (err, state){
      if(err){
        res.status(200).json({
          resType: 'failed',
          message: 'no data found'
        });
      }
      else {
        res.status(200).json({
          resType: 'success',
          message: '',
          state: state
        });
      }
    });
  }
  else{
    res.status(200).json({
      resType: 'failed',
      message: 'you have no permission'
    });
  }
  
});

//  Defined update route
router.post('/api/updateStateById/:id', verifyToken, function (req, res) {
  if(res.locals.decoded.userType === 'Admin'){
    State.findById(req.params.id, function(err, state) {
      if (!state){
        res.status(200).json({
          resType: 'failed',
          message: 'No data found'
        });
      }
      else {
        state.stateName = req.body.stateName;
  
        state.save().then(state => {
          res.status(200).json({
            resType: 'success',
            message: 'state updated',
            state: state
          });
        })
        .catch(err => {
          res.status(200).json({
            resType: 'failed',
            message: 'unable to update the database'
          });
        });
      }
    });
  }
  else{
    res.status(200).json({
      resType: 'failed',
      message: 'you have no permission'
    });
  }
 
});

router.delete('/api/deleteState/:id',verifyToken, function(req,res){
  if(res.locals.decoded.userType === 'Admin'){
    State.findByIdAndRemove({_id: req.params.id}, function(err, state){
      if(err) res.status(200).json({
        resType: 'failed',
        message: 'unable to delete the state'
      });
      else res.json({
        resType: 'success',
        message: 'state removed',
        state: state
      });
    });
  }
  else{
    res.status(200).json({
      resType: 'failed',
      message: 'you have no permission'
    });
  }
  
});

module.exports = router;
