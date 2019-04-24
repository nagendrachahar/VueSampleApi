const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const config = require('./DB.js');

mongoose.Promise = global.Promise;

//handle mongo db errpr
var mongodbErrorHandler = require('mongoose-mongodb-errors');
mongoose.plugin(mongodbErrorHandler);

mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-token");
   
  next();
});


app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));


app.use(require('./router/apiLogin'));
app.use(require('./router/apiMenuMaster'));
app.use(require('./router/apiSchoolMaster'));
app.use(require('./router/apiBranchMaster'));
app.use(require('./router/apiStateMaster.js'));
app.use(require('./router/apiCityMaster.js'));
app.use(require('./router/apiDesignationMaster'));
app.use(require('./router/apiReligionMaster'));
app.use(require('./router/apiTeacherMaster'));
app.use(require('./router/apiParentMaster'));
app.use(require('./router/apiClassMaster'));
app.use(require('./router/apiStudentMaster'));
app.use(require('./router/apiFeeTypeMaster'));
app.use(require('./router/apiFeeSetupMaster'));
app.use(require('./router/apiStudentChargeMaster'));
app.use(require('./router/apiSendSMSMaster'));

app.use(express.static(path.join(__dirname, 'client/wwwroot')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'Website')));
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.use((req, res, next)=>{
  req.status = 404;
  const error = new Error("route not found");
  next(error);
})

app.use((error, req, res, next)=>{
  console.log(error.stack);
  res.status(req.status || 200).json({
      resType: 'failed',
      message: error.message,
      stack: error.stack
  })
})

app.listen(port, () => console.log(`Listening on port ${port}`));