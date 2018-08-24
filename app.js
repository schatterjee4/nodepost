var express = require("express");
var app = express();
const path = require('path');
var qs = require('querystring');
var tunnel = require('tunnel-ssh');
var port = 3000;
var randomstring = require("randomstring");



var firSTname="";
var laSTname="";
var AGe="";

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
});
var User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post("/addname", (request, res) => {


if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) { 
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
            }
        });
        request.on('end', function () {

            var POST = qs.parse(body);
            firSTname=POST.fname;
            laSTname=POST.lname;
            AGe=POST.age;

console.log(POST);
            var config = {
    username:'bitnami',
    host:'mongoarsbrxalzt3eqvgs-vm0.westus.cloudapp.azure.com',
    agent : process.env.SSH_AUTH_SOCK,
    port:22,
    dstPort:27017,
    password:'TintinHaddock21'
};


var server = tunnel(config, function (error, server) {
    if(error){
        console.log("SSH connection error: " + error);
    }
    mongoose.connect('mongodb://arsAdmin:'+encodeURIComponent('Password15$')+'@localhost:27017/ARS_DB')

    var db = mongoose.connection;
var Schema = mongoose.Schema;
 var userSchema = new Schema({
     fname: String,
     lname: String,
     contact: String,
     email: String,
     dob:String
 });
 
 var RMS_USER = mongoose.model("RMS_USER", userSchema);
 var pnrString = randomstring.generate(7);
 var ticketnumberString = randomstring.generate(12);
 
 var user1 = new RMS_USER({
     fname: firSTname,
     lname: laSTname,
     contact: "12345678",
     email:"abc@cognizant.com",
     dob:"01/01/01"
 });


user1.save(function(error,user) {
     console.log(user.id);
     var Schema = mongoose.Schema;
 var travelSchema = new Schema({
     userid: String,
     source: String,
     destination: String,
     carrier: String,
     traveldate:String,
     pnr:String,
     ticketNumber:String,
     price:Number,
     tax:Number,
     bookingDate:String
 });
var RMS_TRAVEL = mongoose.model("RMS_TRAVEL", travelSchema);
 var pnrString = randomstring.generate(7);
 var ticketnumberString = randomstring.generate(12);
 var dateTime = require('node-datetime');
var dt = dateTime.create();
var formatted = dt.format('m/d/Y');
console.log(formatted);
 
 var travel = new RMS_TRAVEL({
     userid: user.id,
     source: "CCU",
     destination:"DEL",
     carrier:"EY",
     traveldate:"11/11/2018",
     pnr:pnrString,
     ticketNumber:ticketnumberString,
     price:3000,
     tax:500,
     bookingDate:formatted
 });

 travel.save(function(error,user) {
     res.send({firstname:firSTname,
    lastname:laSTname, 
    pnr:pnrString,
    ticketnumber:ticketnumberString,
    price:3000});
 mongoose.connection.close()
 });




});
 if (error) {
     console.error(error);
  }
 });



 

        });
    }



});

app.get("/fetchDetails", (request, res) => {

    var config = {
    username:'bitnami',
    host:'mongoarsbrxalzt3eqvgs-vm0.westus.cloudapp.azure.com',
    agent : process.env.SSH_AUTH_SOCK,
    port:22,
    dstPort:27017,
    password:'TintinHaddock21'
};


var server = tunnel(config, function (error, server) {

    mongoose.connect('mongodb://arsAdmin:'+encodeURIComponent('Password15$')+'@localhost:27017/ARS_DB')

    var db = mongoose.connection;
var Schema = mongoose.Schema;
var pnrString = request.query.pnr;
var lname = request.query.lname;

 var travelSchema = new Schema({
     userid: String,
     source: String,
     destination: String,
     carrier: String,
     traveldate:String,
     pnr:String,
     ticketNumber:String,
     price:Number,
     tax:Number,
     bookingDate:String
 });

var travel = mongoose.model('rms_travels', travelSchema);

travel.findOne({ 'pnr': pnrString },  function (err, travel) {
  if (err) return handleError(err);
  console.log(travel);
  var userid = travel.userid;
   var userSchema = new Schema({
     fname: String,
     lname: String,
     contact: String,
     email: String,
     dob:String
 });

 var user = mongoose.model('rms_users', userSchema);
 user.findOne({ '_id': userid,'lname': lname},  function (err, user) {
  if (err) return handleError(err);
  console.log(travel.source+"::::"+user.fname)
  var source=travel.source;
  var dest=travel.destination;
  var fname=user.fname;
  var lname=user.lname;
  var pnr=travel.pnr;
  var ticketNumber=travel.ticketNumber;
 res.send({firstname:fname,
    lastname:lname, 
    pnr:pnr,
    ticketnumber:ticketNumber,
    price:3000});
mongoose.connection.close();
});
});
});
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});
