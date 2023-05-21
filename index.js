const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
require('dotenv').config();



app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/sendEmail", (req, res) => {
  res.render("index");
});

var serviceSendEmail = require('./service-smtp')  

app.post("/sendEmail", async (req, res) => {
  const { file,email , subject, text,replayto} = req.body;

  let filename = file;
  let to = email;
  let replayTo = replayto;
  console.log()
  let a = await serviceSendEmail.sendEmail({
    to,
    subject,
    text,
    replayTo,
    filename
  }
    )


    res.render("success");
  // }
});

app.post("/login", (req, res) => {
  const { name, password } = req.body;

  if (name === "admin" && password === "admin") {
    res.render("success", {
      username: name,
    });
  } else {
    res.render("failure");
  }
});

var pop3Services = require('./service-pop3') 
var imapServices = require('./service-imap')  
// var download = require('./downloadAttach')
app.get("/pop3", async (req, res) => {
  try {
    let results = await pop3Services.pop3()
    res.render("repos", {
      results 
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error while getting list of repositories");
  }
});

app.get("/imap", async (req, res) => {
  try {
    let results = await imapServices.getEmails()
    console.log(`impa : ${JSON.stringify(results)}`)
    results = results.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date);
    });
    // return results
    res.render("repos", {
      results 
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error while getting list of repositories");
  }
});

app.post("/download", async (req, res) => {
  try {
    const { seq } = req.body;
    console.log(`body : ${JSON.stringify(req.body)}`)
    let results = await imapServices.downloadAttachments(seq)
    console.log(`impa : ${JSON.stringify(results)}`)
    results = results.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date);
    });
    // return results
    res.render("repos", {
      results 
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error while getting list of repositories");
  }
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
