var emailChecker = require("verifier-node");
module.exports = async function emailCheck(email_id, api){
    emailChecker.verify(email_id, api)
        .then(response => {
           // console.log(response.valid()); // Boolean
            response_mail = response.valid();
            console.log(response_mail);
            //console.log(response.field("status")); // Access any field in response
        })
        .catch(err => {
            console.log('error', err)
        });
}