var express = require("express")
var fs = require("fs")
var open = require('open')
var body_parser = require("body-parser")
const mongoose = require("mongoose");
var fun = require("./calculate_emi")
var p=0,r=0,t=0;

var urlencodedParser = body_parser.urlencoded({ extended: false })
var app  = express();

// mongodb connection
var mangodb = "mongodb+srv://dbuser:dbuser@cluster0-gouvv.gcp.mongodb.net/bank?retryWrites=true&w=majority";
mongoose.connect(mangodb);

// create schema
var Schema = mongoose.Schema;

var DetailsSchema = new Schema({
    bank_name: String,
    bank_intrest_rate:Number,
    class:String

});

// creating model with above schema
var Details = mongoose.model('banking_intrest_rates', DetailsSchema); // details is the name of the collection in the model


app.use("/static", express.static("static"));
app.set("view engine", "ejs");

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
    let loan_data;
    Details.find({}, function(err, data){
        loan_data = data;
        if(err) throw err;
        for(i=0;i<data.length;i++)
        console.log(data[i].bank_name,data[i])

        res.render("compare_bank_rates_i", {data : loan_data})
    }).sort({bank_intrest_rate:1 })
});

app.get("/bank_rates", function(req, res){
    res.render("views/bank_rates");
});





var port  = process.env.PORT || 8080;
console.log(port);

var server  = app.listen(port);
