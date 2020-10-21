const express = require("express");
const app = express();
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./bc");

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
app.use((req, res, next) => {
  console.log("middleware running!");
  console.log("-------------------");
  console.log("req.method: ", req.method);
  console.log("req.url:", req.url);
  console.log("-------------------");
  next(); // this ensures middleware code runs and then we exit this function so other code can also run (i.e. move along)
});

//routes
// app.get("/", (req, res) => {
//   console.log("req.session when first set: ", req.session);
//   // req.session.pimento = "bigSecret99";
//   req.session.permission = true;
//   console.log("req.session after value set: ", req.session);
//   res.redirect("/register");
// });

app.get("/register", (req, res) => {
  res.render("register", {});
});

app.post("/register", (req, res) => {
  const first = req.body.first;
  const last = req.body.last;
  const email = req.body.email;
  const password = req.body.password;
  console.log("req.body: ", req.body);
  console.log("passw", password);
  hash(password)
    .then((hashedPw) => {
      db.insertUsers(first, last, email, hashedPw)
        .then((result) => {
          console.log("result.rows", result.rows);
          req.session.userId = result.rows[0].id;
          res.redirect("/profile");
        })
        .catch((err) => {
          console.log("error in insert user", err);
          res.render("register", {
            err,
          });
        });
    })
    .catch((err) => {
      console.log("err in hash", err);
      res.render("register", { err });
    });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  db.getPass(req.body.email)
    .then((result) => {
      const hashedPw = result.rows[0].password;
      const password = req.body.pw;
      const id = result.rows[0].id;
      compare(password, hashedPw)
        .then((matchValue) => {
          if (matchValue == true) {
            req.session.userId = id;
            console.log("id", id);
            db.getSignature(req.session.userId)
              .then((signature) => {
                if (signature.rows[0]) {
                  req.session.sigid = result.rows[0].id;
                  res.redirect("/thankyou");
                } else {
                  res.redirect("/");
                }
              })
              .catch((error) => {
                res.render("login", { error });
              });
          } else {
            res.render("login", { error: true });
          }
        })
        .catch((error) => {
          res.render("login", {
            error,
          });
        });
    })
    .catch((error) => {
      res.render("login", { error });
    });
});

app.get("/petition", (req, res) => {
  res.render("petition");
});
app.post("/petition", (req, res) => {
  const { sig } = req.body;
  // console.log(req.body);
  // console.log("req-session: ", req.session);
  db.addSignature(sig)
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
