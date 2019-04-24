var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const cors = require('cors');

var jwt = require('jsonwebtoken');
var config = require('../config');

// Require feetype model in our routes module

const FeeType = require('../model/account/feeType.model');

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

router.post('/api/SaveFeeType', verifyToken, async (req,res, next) => {
  
  if(res.locals.decoded.userType === 'Admin'){
    let data = req.body;

    let feeType = new FeeType(data);

    await feeType.save();

    res.status(200).json({
      resType: 'success',
      message: 'Fee Type saved',
      feeType: feeType
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

router.get('/api/getFeeType', verifyToken, async (req,res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const feeType = await FeeType.find();

      res.status(200).json({
        resType: 'success',
        feeType: feeType
      });
      
  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
   }
});

// Defined edit route
router.get('/api/getFeeTypeById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    let id = req.params.id;

    const feeType = await FeeType.findById(id);

    res.status(200).json({
      resType: 'success',
      message: '',
      feeType: feeType
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
  
});

//  Defined update route
router.post('/api/updateFeeTypeById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const feeType = await FeeType.findById(req.params.id);

    feeType.feeTypeName = req.body.feeTypeName;
    feeType.Remark = req.body.Remark;

    await feeType.save();

    res.status(200).json({
      resType: 'success',
      message: 'feeType updated',
      feeType: feeType
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
 
});

router.delete('/api/deleteFeeType/:id',verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    
    const feeType = await FeeType.findByIdAndRemove({_id: req.params.id});
    
    res.status(200).json({
      resType: 'success',
      message: 'feeType removed',
      feeType: feeType
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

module.exports = router;
