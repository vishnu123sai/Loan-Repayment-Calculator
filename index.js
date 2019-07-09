var express = require("express")
var fs = require("fs")
var open = require('open')
var body_parser = require("body-parser")
const mongoose = require("mongoose");
var nodemailer = require('nodemailer');
var ObjectID = require('mongodb').ObjectID;
var fun = require("./calculate_emi")
var p=0,r=0,t=0;

var urlencodedParser = body_parser.urlencoded({ extended: false })
var app  = express();

// mongodb connection
var mangodb = "mongodb+srv://dbuser:dbuser@cluster0-gouvv.gcp.mongodb.net/bank?retryWrites=true&w=majority";
mongoose.connect(mangodb,{ useNewUrlParser: true });

// to aviod deprecation warning while creating index 
mongoose.set('useCreateIndex', true)
// create schema
var Schema = mongoose.Schema;

// bank intrest rates schema
var DetailsSchema = new Schema({
    bank_name: String,
    bank_intrest_rate:Number,
    class:String

});

// candidates schema
var CandidateSchema = new Schema({
    first_name : String,
    last_name : String,
    email : String,
    mobile_no : Number,
    country_intrested : String,
    bank_intrested : String

})
// making index to avoid duplicates 
CandidateSchema.index({email : 1},{unique: true})

// creating model with banking intrest  schema
var Details = mongoose.model('banking_intrest_rates', DetailsSchema); // details is the name of the collection in the model
// creating model for candidate details
var Candidates = mongoose.model('contact_details', CandidateSchema);

// setting email 

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'foreignadmits1@gmail.com',
      pass: 'Foreignadmits1@' // need to pass from env variables in real time 
    }
  });
  

app.use("/static", express.static("static"));
app.set("view engine", "ejs");

let loan_data;
Details.find({}, function(err, data){
    loan_data = data;
    if(err) throw err;
    for(i=0;i<data.length;i++)
    console.log(data[i].bank_name,data[i])

    //routes

    app.get("/", function(req,res){
        res.render("index")
    });
    app.get("/emi", function(req, res){
        res.render("index");
    })

    app.post("/emi", urlencodedParser, function(req, res){
        p = req.body.loan_amount;
        t = req.body.period;
        r = req.body.intrest_rate;
        var emi=0;
        emi = fun(p,r,t);

        var total_amount = emi *t;
        var intrest = total_amount-p;
        // Number(Math.round(emi+'e2')+'e-2'  -> this line to get the 2 decimals 
        var min =0
        if(r>0 && (Number(r)-5)>0)
        min = Number(r)-5;
        var max = Number(r)+5;
        let loan_data;
        Details.find({}, function(err, data){
            loan_data = data;
            if(err) throw err;
            res.render("result",{emi : Number(Math.round(emi+'e2')+'e-2'),
            intrest : Number(Math.round(intrest+'e2')+'e-2'),
            total_amount : Number(Math.round(total_amount+'e2')+'e-2'),
            intrest_rate : r,
            principle_amount:p,
            period : t,
            min : min,
            max : max,
            data: loan_data
            })
        });
    });
    app.get("/student_tips", function(req, res){
        res.render("student_tips")
    });
    app.get("/compare_indian_loans", function(req,res){
        res.render("compare_bank_rates_i", {data : loan_data})
    });

    app.get("/emi/apply-loan", function(req, res){
        res.render("apply_bank_loan", {bol:false, data: loan_data}); 
    });

    app.post("/emi/apply-loan",urlencodedParser, function(req, res){
        var email_id = req.body.email;
        var fname = req.body.fname;
        var lname = req.body.lname;
        var candidate = fname+" "+lname;
        var mobile_number = req.body.pno;
        var country = req.body.countries;
        var bank = req.body.banks;
        var candidate_pushtodb = new Candidates({
            first_name : fname,
            last_name : lname,
            email : email_id,
            mobile_no : mobile_number,
            country_intrested : country,
            bank_intrested : bank   
        });
        
        candidate_pushtodb.save(function (err, result_candi) {
            if (err) return console.error(err);
                console.log(result_candi.first_name+" "+result_candi.last_name + " is pushed to contact_details collection.");
        });
        var mailOptions = {
            from: 'foreignadmits1@gmail.com',
            to: email_id,
            subject: 'Thanks for contacting foreignadmits',
            html: '<h4>Dear '+ candidate +'</h4><p>Thanks for consulting \
            Foreign admits.</p>\n\n<p>Foreign admits '+ country +' counslting officer will\
            contact you shortly.</p>\n\n<p>Regards,<br><b>Foreign Admits</b><br>\
            foreignadmits1@gmail.com</p>'
        }
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
        res.render("apply_bank_loan", {bol:true, data:loan_data});
    });

}).sort({bank_intrest_rate:1 });




var port  = process.env.PORT || 8080;
console.log(port);


var server  = app.listen(port);
