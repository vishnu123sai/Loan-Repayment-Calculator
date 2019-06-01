var express = require("express")
var fs = require("fs")
var body_parser = require("body-parser")


var urlencodedParser = body_parser.urlencoded({ extended: false })
var app  = express();

app.use("/static", express.static("static"));
app.set("view engine", "ejs");

app.get("/", function(req,res){
    res.render("index")
});
app.post("/", urlencodedParser, function(req, res){
    console.log(req.body)
    var p = req.body.loan_amount;
    var t = req.body.period;
    var r = req.body.intrest_rate;
    var emi=0;
    emi = (p*(r/1200)*(1+(r/1200))**t)/(1-(1+(r/1200))**t);
    if(emi<0)
    {
        emi = -emi;
    }
    var total_amount = emi *t;
    var intrest = total_amount-p;
    // Number(Math.round(emi+'e2')+'e-2'  -> this line to get the 2 decimals 
    
    res.render("result",{emi : Number(Math.round(emi+'e2')+'e-2'),
    intrest : Number(Math.round(intrest+'e2')+'e-2'),
    total_amount : Number(Math.round(total_amount+'e2')+'e-2')
})
})

var server  = app.listen(3000);

var host  = server.address().address;
var port  = server.address().port;
console.log("Server is up and running on http://%s:%s", host,port);
