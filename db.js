// sudo service postgresql start - ovom komandom pokreni psql
var spicedPg = require("spiced-pg");
// var db = spicedPg("postgres:root:postgres@localhost:5432/signatures");
var db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");
module.exports.addSignature = (signature) => {
  const q = `INSERT INTO signatures (sig)
            VALUES ($1)
            RETURNING *`;
  const params = [sig];
  return db.query(q, params);
};

module.exports.insertUsers = (first, last, email, pw) => {
  const q = `INSERT INTO users(first, last, email, password)
              VALUES ($1, $2, $3, $4)
              RETURNING *`;
  const params = [first, last, email, pw];
  return db.query(q, params);
};

module.exports.getPass = (email) => {
  const q = `SELECT id, password FROM users WHERE email=$1`;
  const params = [email];
  return db.query(q, params);
};

// onda s time mailom u db.js napises query koji ti vraca id i password
// od user where email je jednak onome sto si mu dao kao argument

// sequel injection
// INSERT INTO signatures (first, last, sig) VALUES ($1, $2, $3);
// RETURNING first, last, id; (id generated when something inserted)
