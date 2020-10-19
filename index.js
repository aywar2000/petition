const express = require("express");
const app = express();
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");
const db = require("./db");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

//set middleware
app.use(
  cookieSession({
    secret: "i'm tired",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  })
);
//routes

// console.log("req.session:", req.session);
//   //req.session.petition = 'za-gor';  - sets the cookie
//   //req.session.permission = true;
//   // console.log("req.session:", req.session);
//   // res.send("<h4>welcome to the home-page</h4>");
// });

app.get("/petition", (req, res) => {
  res.render("petition");
});
app.post("/petition", (req, res) => {
  const { first, last, sig } = req.body;
  // console.log(req.body);
  // console.log("req-session: ", req.session);
  db.addSignature(first, last, sig)
    .then(function (result) {
      console.log("Req.session: ", req.session);
      // console.log(result.rows);
      req.session.id = result.rows[0].id;
      console.log("to je req. ", req.session);
      res.redirect("/thankyou");
    })
    .catch(function (err) {
      res.render("petition", { err });
      console.log(err);
    }); //šaljemo db-u
});

app.get("/", (req, res) => {
  console.log("req. session: ", req.session);
  if (req.session.id) {
    res.redirect("thankyou");
  } else {
    res.redirect("petition");
  }
});
app.get("/thankyou", (req, res) => {
  res.render("thankyou");
});

app.listen(8080, () => console.log("szervusz server"));

//b to e - binary to encoding (?)

//console.log(atob(cookie));
