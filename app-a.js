var express = require("express");
var app = express();
const path = require('path');
//var qs = require('querystring');
var tunnel = require('tunnel-ssh');
var bodyParser = require('body-parser');
var port = 3000;
var randomstring = require("randomstring");
var dateTime = require('node-datetime');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

app.use(bodyParser.json())

var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    firstName: String,
    lastName: String,
    contact: String,
    email: String,
    dob: String,
    ticketNumber: String,
    FFType:String

});

var RMS_USER = mongoose.model("RMS_USER", userSchema);

var travelSchema = new Schema({
     _id: { type: Schema.ObjectId, auto: true },
    userids: [{ type: Schema.Types.ObjectId, ref: 'RMS_USER' }],
    source: String,
    destination: String,
    carrier: String,
    traveldate: String,
    startTime: String,
    endTime: String,
    carrierName: String,
    pnr: String,
    price: Number,
    taxAirport: Number,
    taxFuel: Number,
    chargeService:Number,
    feesDevelopment:Number,
    bookingDate: String,
    type:String,
    associatedFlights:[{ type: Schema.ObjectId, auto: true }],
    duration:String
});
var RMS_TRAVEL = mongoose.model("RMS_TRAVEL", travelSchema);
global.db = null;




app.post("/storeData", (request, res) => {

        var body = '';
        request.on('data', function (data) {
            if (body.length > 1e6) { 
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
            }
        });
        request.on('end', function () {

var hostInfo = request.headers.host;
var config = require('./config.js');

if(hostInfo.indexOf("localhost") != -1)
{
var server = tunnel(config, function (error, server) {


    storeData(request,res);

 });
}
else
{
 storeData(request,res);   
}



 

        });
    



});

app.get("/fetchDetails", (request, res) => {
   

           var body = '';
        request.on('data', function (data) {
            if (body.length > 1e6) { 
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
            }
        });
        request.on('end', function () {

var hostInfo = request.headers.host;
var config = require('./config.js');

if(hostInfo.indexOf("localhost") != -1)
{
var server = tunnel(config, function (error, server) {


    fetchDetails(request,res);

 });
}
else
{
 fetchDetails(request,res);   
}

        });

});


app.get("/fetchRefundAmount", (request, res) => {
   

           var body = '';
        request.on('data', function (data) {
            if (body.length > 1e6) { 
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
            }
        });
        request.on('end', function () {

var hostInfo = request.headers.host;
var config = require('./config.js');

if(hostInfo.indexOf("localhost") != -1)
{
var server = tunnel(config, function (error, server) {


    fetchRefundAmount(request,res);

 });
}
else
{
 fetchRefundAmount(request,res);   
}

        });

});


app.listen(port, () => {
    console.log("Server listening on port " + port);
});



 const storeData = (request,res) => {

    mongoose.connect('mongodb://arsAdmin:' + encodeURIComponent('Password15$') + '@localhost:27017/ARS_DB', { useNewUrlParser: true });
    db = mongoose.connection;
  if (request.method == 'POST') {
        var body = '';
        console.log(request.body) // populated!
        if (request.body != null) {
            var pnrString = randomstring.generate(7);
            var dt = dateTime.create();
            var formatted = dt.format('m/d/Y');
            console.log(formatted);
            let paxArray = request.body.paxArray;
            let user1 = "";
            paxArray.forEach(function(pax) {
                pax['ticketNumber'] = randomstring.generate(12);
                pax['FFType']='1';
            });

            RMS_USER.insertMany(paxArray, function(err, docs) {
                if (err) {
                    return console.error(err);
                } else {
                    console.log("Multiple documents inserted to Collection");
                    console.log(docs);
                    user1 = docs[0];
                    let idArr = [];
                    docs.forEach(function(pax) {
                        idArr.push(pax._id);
                    });
                    var travel = new RMS_TRAVEL({
                        userids: idArr,
                        source: request.body.source,
                        destination: request.body.destination,
                        carrier: request.body.carrier,
                        traveldate: request.body.traveldate,
                        startTime: request.body.startTime,
                        endTime: request.body.endTime,
                        carrierName: request.body.carrierName,
                        pnr: pnrString,
                        price: request.body.price,
                        taxAirport: request.body.taxAirport,
                        taxFuel: request.body.taxFuel,
                        chargeService:request.body.chargeService,
                        feesDevelopment:request.body.feesDevelopment,
                        bookingDate: formatted,
                        type:'one',
                        duration:request.body.duration
                    });
                    db.collection('RMS_TRAVEL').insertOne(travel, function(err, doctravel) {
                        if (err) {
                            return console.error(err);
                        } else {
                            console.log("travel documents inserted to Collection");
                            console.log(doctravel.ops[0]);
                            res.json({
                                "success": true,
                                "firstname": user1.fname,
                                "lastname": user1.lname,
                                "pnr": doctravel.ops[0].pnr,
                                "price": doctravel.ops[0].price,
                                "source": doctravel.ops[0].source,
                                "destination": doctravel.ops[0].destination,
                                "carrier": doctravel.ops[0].carrier,
                                "traveldate": doctravel.ops[0].traveldate,
                                "startTime": doctravel.ops[0].startTime,
                                "endTime": doctravel.ops[0].endTime,
                                "carrierName": doctravel.ops[0].carrierName,
                                "price": doctravel.ops[0].price,
                                "taxAirport": doctravel.ops[0].taxAirport,
                                "taxFuel": doctravel.ops[0].taxFuel,
                                "chargeService":doctravel.ops[0].chargeService,
                                "feesDevelopment":doctravel.ops[0].feesDevelopment,
                                "bookingDate": doctravel.ops[0].bookingDate,
                                "type":doctravel.ops[0].type
                            });
                        }
                    });

                }
            });
        }

        request.on('end', function() {
   db.close();
            //console.log(request.body) // populated!
        });
    }



}


const fetchDetails = (request,res) => {

    mongoose.connect('mongodb://arsAdmin:'+encodeURIComponent('Password15$')+'@localhost:27017/ARS_DB',);


    var db = mongoose.connection;
    var lname = request.query.lastName;
    var pnrString = request.query.pnr;
    db.collection('RMS_TRAVEL').findOne({ 'pnr': pnrString}, function(error,travel) {
        if (error) return handleError(error);
        //console.log(travel);
            var useridArr = travel.userids;
            //console.log(useridArr);
            let foundMatch = false;
            useridArr.forEach(function(id) {
                RMS_USER.findOne({ 'lname': lname, '_id': id }, function(err, user) {
                    if (err) return handleError(err);
                    console.log(useridArr);
                    if (user != null) {
                        const userArr = RMS_USER.find()
                            .where('_id')
                            .in(useridArr)
                            .exec(function(err, docs) {
                                console.log("::::::::::::::::::::"+docs);
                                res.send({
                                    users: docs,
                                    pnr: travel.pnr,
                                    price: travel.price,
                                    source: travel.source,
                                    destination: travel.destination,
                                    carrier: travel.carrier,
                                    traveldate: travel.traveldate,
                                    startTime: travel.startTime,
                                    endTime: travel.endTime,
                                    carrierName: travel.carrierName,
                                    price: travel.price,
                                    taxAirport: travel.taxAirport,
                                    taxFuel: travel.taxFuel,
                                    chargeService:travel.chargeService,
                                    feesDevelopment:travel.feesDevelopment,
                                    bookingDate: travel.bookingDate,
                                    type:travel.type,
                                    duration:travel.duration
                                  
                                });
                                
                            });




                    }
                     db.close();
                });

            });

        
    });
   

}




///Refund amount fetch method


const fetchRefundAmount = (request,res) => {

    mongoose.connect('mongodb://arsAdmin:'+encodeURIComponent('Password15$')+'@localhost:27017/ARS_DB',);


    var db = mongoose.connection;
    var lname = request.query.lname;
    var pnrString = request.query.pnr;
    db.collection('RMS_TRAVEL').findOne({ 'pnr': pnrString }, function(error,travel) {
        if (error) return handleError(error);
        console.log(travel);
            var useridArr = travel.userids;
            console.log(useridArr);
            let foundMatch = false;
            useridArr.forEach(function(id) {
                RMS_USER.findOne({ 'lname': lname, '_id': id }, function(err, user) {
                    if (err) return handleError(err);
                    if (user != null) {
                        const userArr = RMS_USER.find()
                            .where('_id')
                            .in(useridArr)
                            .exec(function(err, docs) {
                                console.log(travel);

                                let frequentFlyerNumber = docs.FFType;
                                let tamountPaid = travel.price + travel.taxAirport + travel.taxFuel + travel.chargeService + travel.feesDevelopment;
                                var tvDate = new Date(travel.traveldate);
                                var currntDate = new Date();
                                var oneDay = 24*60*60*1000;
                                var diffDays = Math.round(Math.abs((tvDate.getTime() - currntDate.getTime())/(oneDay)));


                                // res.send({
                                //     users: docs,
                                //     pnr: travel.pnr,
                                //     price: travel.price,
                                //     source: travel.source,
                                //     destination: travel.destination,
                                //     carrier: travel.carrier,
                                //     traveldate: travel.traveldate,
                                //     startTime: travel.startTime,
                                //     endTime: travel.endTime,
                                //     carrierName: travel.carrierName,
                                //     price: travel.price,
                                //     taxAirport: travel.taxAirport,
                                //     taxFuel: travel.taxFuel,
                                //     chargeService:travel.chargeService,
                                //     feesDevelopment:travel.feesDevelopment,
                                //     bookingDate: travel.bookingDate,
                                //     type:travel.type,
                                //     duration:travel.duration
                                  
                                // });
                                
                            });




                    }
                     db.close();
                });

            });

        
    });
   

}