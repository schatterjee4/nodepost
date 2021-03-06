var express = require("express");
var app = express();
const path = require('path');
var requestObj = require('request');
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
    ticketNumber: String

});

var RMS_USER = mongoose.model("RMS_USER", userSchema);

var config = {
    username: 'bitnami',
    host: 'mongoarsbrxalzt3eqvgs-vm0.westus.cloudapp.azure.com',
    agent: process.env.SSH_AUTH_SOCK,
    port: 22,
    dstPort: 27017,
    password: 'TintinHaddock21'
};
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
    bookingDate: String,
    type: String,
    associatedFlights: [{ type: Schema.ObjectId, auto: true }],
    duration: String,
    taxAirport: Number,
    taxFuel: Number,
    chargeService: Number,
    feesDevelopment: Number,
    fop: String,
    serviceClass: String,
    baseFare: Number, //
    refundamount: Number,
    status: String,
    fop: String,
    aircraftType: String,
    ccLastFour: String,
    ccLength: Number,
    ccType: String
});
var RMS_TRAVEL = mongoose.model("RMS_TRAVEL", travelSchema);
global.db = null;
var configSchema = new Schema({
    configName: String,
    value: [String]
});
var RMS_CONFIG = mongoose.model("RMS_CONFIG", configSchema, "RMS_CONFIG");

//function createConnect() {
var server = tunnel(config, function(error, server) {
    if (error) {
        console.log("SSH connection error: " + error);
    }
    mongoose.connect('mongodb://arsAdmin:' + encodeURIComponent('Password15$') + '@localhost:27017/ARS_DB', { useNewUrlParser: true });
    db = mongoose.connection;
    //console.log(db);
});
const ticketNumber = [{ "key": "LX", "value": "724" }, { "key": "KL", "value": "074" }, { "key": "EY", "value": "607" }, { "key": "AF", "value": "057" }];
//}
app.post("/storeData", (request, res) => {


    if (request.method == 'POST') {
        var body = '';
        /*request.on('data', function(data) {
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) {
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
            }
        });*/
        // console.log(request.body) // populated!
        if (request.body != null) {
            var pnrString = randomstring.generate(6);
            var dt = dateTime.create();
            var formatted = dt.format('m/d/Y');
            //console.log(formatted);
            let paxArray = request.body.paxArray;
            let user1 = "";
            let ticketPre = ticketNumber.filter(v => v.key.toLowerCase().indexOf(request.body.carrier.toLowerCase()) > -1).map((ticket) => ticket.value);
            paxArray.forEach(function(pax) {
                pax['ticketNumber'] = ticketPre + randomstring.generate(10);
            });

            RMS_USER.insertMany(paxArray, function(err, docs) {
                if (err) {
                    return console.error(err);
                } else {
                    console.log("Multiple documents inserted to Collection");
                    console.log(docs);
                    user1 = docs[0];
                    let idArr = [];
                    let fop = request.body.fop != null ? request.body.fop : 'cc';
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
                        chargeService: request.body.chargeService,
                        feesDevelopment: request.body.feesDevelopment,
                        bookingDate: formatted,
                        type: 'one',
                        duration: request.body.duration,
                        serviceClass: "E",
                        baseFare: request.body.baseFare,
                        status: 'OK',
                        refundamount: 0,
                        fop: fop,
                        aircraftType: request.body.aircraftType,
                        ccLastFour: request.body.ccLastFour,
                        ccLength: request.body.ccLength,
                        ccType: request.body.ccType


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
                                "tax": doctravel.ops[0].tax,
                                "bookingDate": doctravel.ops[0].bookingDate,
                                "type": doctravel.ops[0].type
                            });
                        }
                    });

                }
            });
        }
        /*var user1 = new RMS_USER({
            fname: firSTname,
            lname: laSTname,
            contact: "12345678",
            email: "abc@cognizant.com",
            dob: "01/01/01"
        });*/
        request.on('end', function() {

            //console.log(request.body) // populated!
        });
    }
    //  mongoose.connection.close();

});
app.get("/fetchDetails", (request, res) => {
    // createConnect();
    // console.log(db);
    // console.log("llll");
    var lname = request.query.lastName;
    var pnrString = request.query.pnr;


    db.collection('RMS_TRAVEL').findOne({ 'pnr': { $regex: new RegExp("^" + pnrString, "i") } }, function(err, travel) {
        if (err) return handleError(err);
        else {
            var useridArr = travel.userids;
            console.log(useridArr);
            let foundMatch = false;
            // useridArr.forEach(function(id) {
            RMS_USER.findOne({ 'lastName': { $regex: new RegExp("^" + lname, "i") }, '_id': { "$in": useridArr } }, function(err, user) {
                if (err) { console.log(err) } else {
                    if (user != null) {
                        console.log('loop1');
                        const userArr = RMS_USER.find()
                            .where('_id')
                            .in(useridArr)
                            .exec(function(err, docs) {
                                console.log('travel');
                                console.log(travel);
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
                                    chargeService: travel.chargeService,
                                    feesDevelopment: travel.feesDevelopment,
                                    bookingDate: travel.bookingDate,
                                    type: travel.type,
                                    duration: travel.duration,
                                    fop: travel.fop,
                                    serviceClass: travel.serviceClass,
                                    baseFare: travel.baseFare,
                                    status: travel.status,
                                    refundamount: travel.refundamount,
                                    fop: travel.fop,
                                    aircraftType: travel.aircraftType,
                                    ccLastFour: travel.ccLastFour,
                                    ccLength: travel.ccLength,
                                    ccType: travel.ccType
                                });

                                //make magic happen
                            });
                        /*db.collection('RMS_USER').find({ '_id': { '$in': ['5b82f90a2b75db011cffc5b7, 5b82f90a2b75db011cffc5b8'] } }).toArray(function(err, docs) {
                            // docs array here contains all queried docs
                            if (err) throw err;
                            console.log(docs);
                        });*/



                    } else {
                        console.log('herehhh');
                        // res.send ({ success: true});


                    }
                }
            });

            // });

        }
    });
    // mongoose.connection.close();

});




app.get("/fetchRefundAmount", (request, res) => {


    var body = '';
    request.on('data', function(data) {
        if (body.length > 1e6) {
            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
            request.connection.destroy();
        }
    });
    request.on('end', function() {


        fetchRefundAmount(request, res);


    });

});


const fetchRefundAmount = (request, res) => {

    var lname = request.query.lastName;
    var pnrString = request.query.pnr;
    db.collection('RMS_TRAVEL').findOne({ 'pnr': { $regex: new RegExp("^" + pnrString, "i") } }, function(err, travel) {
        if (err) return handleError(err);
        else {
            var useridArr = travel.userids;
            console.log(useridArr);
            let foundMatch = false;
            useridArr.forEach(function(id) {
                RMS_USER.findOne({ 'lastName': lname, '_id': id }, function(err, user) {
                    if (err) return handleError(err);
                    if (user != null) {
                        const userArr = RMS_USER.find()
                            .where('_id')
                            .in(useridArr)
                            .exec(function(err, docs) {
                                let frequentFlyerNumber = '1';
                                let tamountPaid = travel.price + travel.taxAirport + travel.taxFuel + travel.chargeService + travel.feesDevelopment;
                                var tvDate = new Date(travel.traveldate);
                                var bookingDate = new Date(travel.bookingDate);

                                var currntDate = new Date();
                                var oneDay = 24 * 60 * 60 * 1000;
                                var diffDays = Math.round(Math.abs((tvDate.getTime() - currntDate.getTime()) / (oneDay))) * 1;


                                var diffDaysbooking = Math.round(Math.abs((currntDate.getTime() - bookingDate.getTime()) / (oneDay))) * 1;


                                //let serviceClass = travel.serviceClass;
                                let serviceClass = 'E';

                                var requestData = {
                                    "FrequentFlyerType": frequentFlyerNumber,
                                    "TotalAmountPaid": travel.price,
                                    "TimeRemainingInJourney": diffDays,
                                    "ServiceClass": serviceClass
                                };

                                requestObj({
                                    url: "https://myruleenginewebapi20180912041304.azurewebsites.net/api/rules",
                                    method: "POST",
                                    headers: {
                                        "content-type": "application/json",
                                    },
                                    json: requestData
                                        //  body: JSON.stringify(requestData)
                                }, function(err, response, body) {
                                    console.log(diffDays <= 15);
                                    let refndAmount = body.RefundAmount;
                                    let fullFlag = false;
                                    if (diffDaysbooking == '0') {
                                        refndAmount = travel.price;
                                        fullFlag = true;

                                    } else if (diffDays <= 15) {
                                        refndAmount = 0;
                                    }
                                    res.send({
                                        cancellationCharge: body.ConvenienceFee,
                                        refundAmount: refndAmount,
                                        fullrefund: fullFlag
                                    });
                                });
                                //make magic happen
                            });
                        /*db.collection('RMS_USER').find({ '_id': { '$in': ['5b82f90a2b75db011cffc5b7, 5b82f90a2b75db011cffc5b8'] } }).toArray(function(err, docs) {
                            // docs array here contains all queried docs
                            if (err) throw err;
                            console.log(docs);
                        });*/

                    }
                });

            });

        }
    });


}

app.get("/fetchRefundAmount", (request, res) => {


    var body = '';
    request.on('data', function(data) {
        if (body.length > 1e6) {
            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
            request.connection.destroy();
        }
    });
    request.on('end', function() {


        fetchRefundAmount(request, res);


    });

});

app.post("/updateCancelStatus", (request, res) => {

    var body = '';
    console.log(request.body) // populated!

    request.on('data', function(data) {
        if (body.length > 1e6) {
            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
            request.connection.destroy();
        }
    });
    updateCancelStatus(request, res);

    request.on('end', function() {




    });

});
const updateCancelStatus = (request, res) => {
    var pnrString = request.body.pnr;

    var refundAmount = request.body.refundAmount;
    console.log(pnrString);
    db.collection('RMS_TRAVEL').update({ 'pnr': { $regex: new RegExp('^' + pnrString, 'i') } }, { $set: { status: "C", refundamount: refundAmount } });

    res.send({

        "status": "Success"

    });

}
app.get("/fetchConfig", (request, res) => {


    var body = '';
    request.on('data', function(data) {
        if (body.length > 1e6) {
            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
            request.connection.destroy();
        }
    });
    request.on('end', function() {


        fetchConfig(request, res);


    });

});
const fetchConfig = (request, res) => {

    /*RMS_CONFIG.find({'configName':"fop"},function(err, models) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.send({models:models});
        }
    });*/
    RMS_CONFIG.find({}, function(err, rmsConfig) {
        res.send({
            rmsConfig
        });

    });
}
app.post("/updateReisueAmount", (request, res) => {

    var body = '';
    console.log(request.body) // populated!

    request.on('data', function(data) {
        if (body.length > 1e6) {
            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
            request.connection.destroy();
        }
    });
    updateReisueAmount(request, res);

    request.on('end', function() {




    });

});
const updateReisueAmount = (request, res) => {
    var pnrString = request.body.pnr;
    console.log("kkkkkkkkk");
    var reissueAmount = request.body.reissueAmount;
    var amount = 0;
    db.collection('RMS_TRAVEL').findOne({ 'pnr': { $regex: new RegExp("^" + pnrString, "i") } }, function(err, travel) {
        if (err) return handleError(err);
        else {
            amount = travel.price * 1 + reissueAmount * 1;
            console.log("kk" + travel.price);
            console.log(amount);
            db.collection('RMS_TRAVEL').update({ 'pnr': { $regex: new RegExp('^' + pnrString, 'i') } }, { $set: { price: amount } });
            res.send({

                "status": "Success",
                "price": amount
            });
        }
    });


}
const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}


var gracefulExit = function() {
    mongoose.connection.close(function() {
        console.log('Mongoose default connection with DB :' + db + ' is disconnected through app termination');
        process.exit(0);
    });
}
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

app.listen(port, () => {
    console.log("Server listening on port " + port);
});