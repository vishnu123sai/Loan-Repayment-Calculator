module.exports = function calculateEmi(p,r,t){
 
    var emi=0;
    if(r>0)
    emi = (p*(r/1200)*(1+(r/1200))**t)/(1-(1+(r/1200))**t);
    console.log(emi)
    if(emi<0)
    {
        emi = -emi;
    }
    return emi;
}