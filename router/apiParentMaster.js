var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

var jwt = require('jsonwebtoken');
var config = require('../config');

// Require Branch model in our routes module
const Parent = require('../model/parents/parent.model');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'client/wwwroot/Parent/ProfilePhoto')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage });
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

router.post('/api/SaveParent', verifyToken, upload.single('image'), async (req,res, next) => {
  
  if(res.locals.decoded.userType === 'Admin'){
    let data = req.body;

    if(req.file){
      data["photoPath"] = req.file.filename;
    }
    else{
      data["photoPath"] = "";
    }

    let parent = new Parent(data);

    await parent.save();

    res.status(200).json({
      resType: 'success',
      message: 'parent saved',
      parent: parent
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

router.get('/api/getParent', verifyToken, async (req,res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const parent = await Parent.find();

      res.status(200).json({
        resType: 'success',
        parent: parent
      });
      
  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
   }
});

// Defined edit route
router.get('/api/getParentById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    let id = req.params.id;

    const parent = await Parent.findById(id);

    res.status(200).json({
      resType: 'success',
      message: '',
      parent: parent
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
  
});

//  Defined update route
router.post('/api/updateParentById/:id', verifyToken, upload.single('image'), async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    const data = req.body;
    const parent = await Parent.findById(req.params.id);

    if(req.file){
      parent["photoPath"] = req.file.filename;
    }

    parent['gardiunName'] = data.gardiunName;
    parent['fatherName'] = data.fatherName;
    parent['Profession'] = data.Profession;
    parent['motherName'] = data.motherName;
    parent['Email'] = data.Email;
    parent['Phone'] = data.Phone;
    parent['nationalId'] = data.nationalId;
    parent['religionId'] = data.religionId;
    parent['stateId'] = data.stateId;
    parent['cityId'] = data.cityId;
    parent['Address'] = data.Address;
    parent['Password'] = data.Password;

    await parent.save();

    res.status(200).json({
      resType: 'success',
      message: 'parent updated',
      parent: parent
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
 
});

router.delete('/api/deleteParent/:id',verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    
    const parent = await Parent.findByIdAndRemove({_id: req.params.id});
    
    res.status(200).json({
      resType: 'success',
      message: 'parent removed',
      parent: parent
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

module.exports = router;
