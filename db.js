// sudo service postgresql start - ovom komandom pokreni psql
var spicedPg = require("spiced-pg");
// var db = spicedPg("postgres:root:postgres@localhost:5432/signatures");
var db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");
module.exports.addSignature = (first, last, signature) => {
  const q = `INSERT INTO signatures (first, last, sig)
            VALUES ($1, $2, $3)
            RETURNING *`;
  const params = [first, last, signature];
  return db.query(q, params);
};

// sequel injection
// INSERT INTO signatures (first, last, sig) VALUES ($1, $2, $3);
// RETURNING first, last, id; (id generated when something inserted)
