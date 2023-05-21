const Pop3Command = require('node-pop3');
const {simpleParser} = require('mailparser');

console.log(process.env.HOST)
const pop3 = new Pop3Command({
    user: process.env.USER_POP,
    password: process.env.PASSWORD_POP,
    host: process.env.HOST,
    port: process.env.PORT,
    tls: process.env.TLS
  });
  

exports.pop3 = async function () {
  
    try {

        let emailsList = await pop3.UIDL();  // fetch list of all emails
    // console.log(emailsList)
    let results = []
    for (let i=0; i<= emailsList.length-1; i++){
      let message = {}
        let msg = await pop3.RETR(Number(emailsList[i][0]));  // fetch the email content
        let parsedEmail = await simpleParser(msg);

        // console.log(`email : ${JSON.stringify(parsedEmail)}\n\n\n\n\n`)
        message["from"] =parsedEmail.headers.get("from").value[0].address
        message["subject"] =parsedEmail.headers.get("subject")
        message["date"] =parsedEmail.headers.get("date")
      results.push(message)
      }
    
    results = results.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date);
    });

    return results
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Users')
    }
}