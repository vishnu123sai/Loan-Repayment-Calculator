var express = require("express")
var fs = require("fs")
var open = require('open')
var body_parser = require("body-parser")
var fun = require("./calculate_emi")
var p=0,r=0,t=0;

var urlencodedParser = body_parser.urlencoded({ extended: false })
var app  = express();

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
    
    res.render("result",{emi : Number(Math.round(emi+'e2')+'e-2'),
    intrest : Number(Math.round(intrest+'e2')+'e-2'),
    total_amount : Number(Math.round(total_amount+'e2')+'e-2'),
    intrest_rate : r,
    principle_amount:p,
    period : t,
    min : min,
    max : max
    })
});
app.get("/emi/student_tips", function(req, res){
    res.render("student_tips")
});





var server  = app.listen(3000);

var host  = server.address().address;
var port  = server.address().port;
console.log("Server is up and running on http://%s:%s", host,port);
