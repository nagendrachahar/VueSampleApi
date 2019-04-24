var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

var jwt = require('jsonwebtoken');
var config = require('../config');

// Require Branch model in our routes module
const Teacher = require('../model/teacher/teacher.model');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'client/wwwroot/Teachers/ProfilePhoto')
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

var getTeacherCode = async (req, res, next) => {
  let code = 'RSSTF0001';
  const lastCode = await Teacher.find({}, {}, { sort: { 'entryOn' : -1 } });

  if(lastCode.length>0){
    var str = lastCode[0].teacherCode;
    var n = str.indexOf("0");
    var newDigit = Number(str.slice(n))+1;
    code = code.slice(0, Number(String(code).length)-Number(String(newDigit).length))+newDigit;
  }

  res.locals.teacherCode = code; 
  next();
}

router.post('/api/SaveTeacher', verifyToken, getTeacherCode, upload.single('image'), async (req,res, next) => {
  
  if(res.locals.decoded.userType === 'Admin'){
    let data = req.body;

    if(req.file){
      data["photoPath"] = req.file.filename;
    }
    else{
      data["photoPath"] = "";
    }
    data["teacherCode"] = res.locals.teacherCode;

    let teacher = new Teacher(data);

    await teacher.save();

    res.status(200).json({
      resType: 'success',
      message: 'teacher saved',
      teacher: teacher
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

router.get('/api/getTeacher', verifyToken, async (req,res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const teacher = await Teacher.find().populate('designationId').exec();

      res.status(200).json({
        resType: 'success',
        teacher: teacher
      });
      
  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
   }
});

// Defined edit route
router.get('/api/getTeacherById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    let id = req.params.id;

    const teacher = await Teacher.findById(id);

    res.status(200).json({
      resType: 'success',
      message: '',
      teacher: teacher
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
  
});

//  Defined update route
router.post('/api/updateTeacherById/:id', verifyToken, upload.single('image'), async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    const data = req.body;
    const getTeacher = await Teacher.findById(req.params.id);

    if(req.file){
      getTeacher["photoPath"] = req.file.filename;
    }

    getTeacher['teacherName'] = data.teacherName;
    getTeacher['teacherEmail'] = data.teacherEmail;
    getTeacher['teacherPhone'] = data.teacherPhone;
    getTeacher['nationalId'] = data.nationalId;
    getTeacher['branchId'] = data.branchId;
    getTeacher['designationId'] = data.designationId;
    getTeacher['dateOfBirth'] = data.dateOfBirth;
    getTeacher['Gender'] = data.Gender;
    getTeacher['religionId'] = data.religionId;
    getTeacher['joiningDate'] = data.joiningDate;
    getTeacher['stateId'] = data.stateId;
    getTeacher['cityId'] = data.cityId;
    getTeacher['Address'] = data.Address;
    getTeacher['Password'] = data.Password;

    await getTeacher.save();

    res.status(200).json({
      resType: 'success',
      message: 'teacher updated',
      teacher: getTeacher
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
 
});

router.delete('/api/deleteTeacher/:id',verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    
    const teacher = await Teacher.findByIdAndRemove({_id: req.params.id});
    
    res.status(200).json({
      resType: 'success',
      message: 'teacher removed',
      teacher: teacher
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

module.exports = router;
