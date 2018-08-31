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
     age: String,
     pnr: String,
     ticketnumber:String,
     price:Number
 });
 
 var RMS_MASTER = mongoose.model("RMS_MASTER", userSchema);
 var pnrString = randomstring.generate(7);
 var ticketnumberString = randomstring.generate(12);
 
 var user1 = new RMS_MASTER({
     fname: firSTname,
     lname: laSTname,
     age: AGe,
     pnr:pnrString,
     ticketnumber:ticketnumberString,
     price:3000
 });


user1.save(function(error) {
     console.log("Your user has been saved!");
 if (error) {
     console.error(error);
  }
 });

res.send({firstname:firSTname,
    lastname:laSTname,
    age:AGe, 
    pnr:pnrString,
    ticketnumber:ticketnumberString,
    price:3000});
});

 

        });
    }



});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});
