var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const cors = require('cors');

var jwt = require('jsonwebtoken');
var config = require('../config');

// Require Branch model in our routes module
let Branch = require('../model/branch.model');

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

router.post('/api/SaveBranch', verifyToken, function(req,res){
  
  if(res.locals.decoded.userType === 'Admin'){
    let data = req.body;
    
    let branch = new Branch(data);

    branch.save().then(branch => {
      res.status(200).json({
        resType: 'success',
        message: 'branch successfully saved'
      });
    })
    .catch(err => {
      res.status(200).json({
        resType: 'failed',
        message: err
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


router.get('/api/getBranch', verifyToken, function(req,res){
  if(res.locals.decoded.userType === 'Admin'){
    Branch.find(function(err, branch){
      if(err){
        res.status(200).json({
          resType: 'failed',
          message: 'Error'
        });
      }
      else {
        res.status(200).json({
          resType: 'success',
          branch: branch
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
router.get('/api/getBranchById/:id', verifyToken, function (req, res) {
  if(res.locals.decoded.userType === 'Admin'){
    let id = req.params.id;
    Branch.findById(id, function (err, branch){
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
          branch: branch
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
router.post('/api/updateBranchById/:id', verifyToken, function (req, res) {
  if(res.locals.decoded.userType === 'Admin'){
    Branch.findById(req.params.id, function(err, branch) {
      if (!branch){
        res.status(200).json({
          resType: 'failed',
          message: 'No data found'
        });
      }
      else {
        branch.branchCode = req.body.branchCode;
        branch.branchName = req.body.branchName;
        branch.branchEmail = req.body.branchEmail;
        branch.branchContactNo = req.body.branchContactNo;
        branch.branchAddress = req.body.branchAddress;
        branch.inchargePerson = req.body.inchargePerson;
        branch.inchargePersonContact = req.body.inchargePersonContact;
  
        branch.save().then(branch => {
          res.status(200).json({
            resType: 'success',
            message: 'branch updated'
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

router.delete('/api/deleteBranch/:id',verifyToken, function(req,res){
  if(res.locals.decoded.userType === 'Admin'){
    Branch.findByIdAndRemove({_id: req.params.id}, function(err, business){
      if(err) res.status(200).json({
        resType: 'failed',
        message: 'unable to delete the branch'
      });
      else res.json({
        resType: 'success',
        message: 'branch removed'
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
