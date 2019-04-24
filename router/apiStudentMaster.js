var express = require('express');
var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const PDFDocument = require('pdfkit')
const sendSms = require("./sendSms")

var jwt = require('jsonwebtoken');
var config = require('../config');

// Require Branch model in our routes module
const Student = require('../model/student/student.model');
const Parent = require('../model/parents/parent.model');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'client/wwwroot/Students/ProfilePhoto')
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

var getStudentCode = async (req, res, next) => {
  let code = 'RS0000001';
  const student = await Student.find({}, {}, { sort: { 'entryOn' : -1 } });

  if(student.length>0){
    var str = student[0].studentCode;
    var n = str.indexOf("0");
    var newDigit = Number(str.slice(n))+1;
    code = code.slice(0, Number(String(code).length)-Number(String(newDigit).length))+newDigit;
  }

  res.locals.studentCode = code; 
  next();
}


router.post('/api/SaveStudent', verifyToken, getStudentCode, upload.single('image'), async (req, res, next) => {
  
  if(res.locals.decoded.userType === 'Admin'){
    let data = req.body;

    if(req.file){
      data["photoPath"] = req.file.filename;
    }
    else{
      data["photoPath"] = "";
    }

    data["studentCode"] = res.locals.studentCode;

    let student = new Student(data);
    await student.save();

    // send sms to parents
    const parent = await Parent.findById(student.parentId);
    sendSms('Hello', parent.Phone);

    res.status(200).json({
      resType: 'success',
      message: 'Student saved',
      student: student
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

router.get('/api/getStudent', verifyToken, async (req,res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const student = await Student.find().populate("parentId classId").exec();

    res.status(200).json({
      resType: 'success',
      student: student
    });
      
  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
   }
});

// Defined edit route
router.get('/api/getStudentById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    let id = req.params.id;

    const student = await Student.findById(id);

    res.status(200).json({
      resType: 'success',
      message: '',
      student: student
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
  
});

//  Defined update route
router.post('/api/updateStudentById/:id', verifyToken, upload.single('image'), async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    const data = req.body;
    const student = await Student.findById(req.params.id);
    
    if(req.file){
      student["photoPath"] = req.file.filename;
    }

    student['parentId'] = data.parentId;
    student['studentName'] = data.studentName;
    student['Email'] = data.Email;
    student['Phone'] = data.Phone;
    student['Address'] = data.Address;
    student['dateOfBirth'] = data.dateOfBirth;
    student['Gender'] = data.Gender;
    student['branchId'] = data.branchId;
    student['religionId'] = data.religionId;
    student['classId'] = data.classId;
    student['rollNo'] = data.rollNo;
    student['Password'] = data.Password;

    await student.save();

    const studentCardDetail = await Student.findById(req.params.id).populate("classId parentId");

    const doc = new PDFDocument({size: [300,220]});

    doc.pipe(fs.createWriteStream('client/wwwroot/Students/Icard/output.pdf'));

    doc.fontSize(20).fillColor('blue').text('RSAS Public Schooll', 0,10, {align: 'center',width: 300 });

    doc.image(`client/wwwroot/Students/ProfilePhoto/${student["photoPath"]}`,10, 50, {
        fit: [100, 150],
        align: 'center',
        valign: 'top'
    });

    doc.fontSize(12).fillColor('black')
    .text(`Name : ${studentCardDetail.studentName}`, 120, 50, {align: 'left', width: 200,});
    doc.fontSize(12)
    .text(`ID : ${studentCardDetail.studentCode}`, 120, 70, {align: 'left', width: 200,});
    doc.fontSize(12)
    .text(`Father Name : ${studentCardDetail.parentId.fatherName}`, 120, 90, {align: 'left', width: 200,});
    doc.fontSize(12)
    .text(`Mother Name : ${studentCardDetail.parentId.motherName}`, 120, 110, {align: 'left', width: 200,});
    doc.fontSize(12)
    .text(`Class : ${studentCardDetail.classId.className}`, 120, 130, {align: 'left', width: 200,});

    doc.end();

    // send sms to parents
    
    //sendSms('Hello', parent.Phone);

    res.status(200).json({
      resType: 'success',
      message: 'student updated',
      student: student
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
 
});

router.delete('/api/deleteStudent/:id',verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    
    const student = await Student.findByIdAndRemove({_id: req.params.id});
    
    res.status(200).json({
      resType: 'success',
      message: 'teacher removed',
      student: student
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

// get Student list by Class Id
router.get('/api/getStudentByClassId/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    let id = req.params.id;

    const student = await Student.find({ classId: id});

    res.status(200).json({
      resType: 'success',
      message: '',
      student: student
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
  
});

module.exports = router;
