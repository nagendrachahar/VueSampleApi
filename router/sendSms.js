
var Request = require("request");

var getStudentCode = (msz, phone) => {
    const smsApi = `http://mysmsshop.in//http-api.php?username=test&password=test&senderid=RSASPS&route=1&unicode=2&number=${phone}&message=${msz}`;

     Request.get(smsApi, (error, response, body) => {
         if(error) {
             return console.log('shivam',error);
         }
         console.log(JSON.stringify(body));
     });
}

module.exports = getStudentCode;
