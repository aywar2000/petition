// sudo service postgresql start - ovom komandom pokreni psql
var spicedPg = require("spiced-pg");
// var db = spicedPg("postgres:root:postgres@localhost:5432/signatures");
const db = spicedPg(
  process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/petition"
);
module.exports.addSignature = (sig, user_id) => {
  const q = `INSERT INTO signatures (sig, user_id)
            VALUES ($1, $2)
            RETURNING *`;
  const params = [sig, user_id];
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

module.exports.userInfo = (age, city, url, userId) => {
  const q = `INSERT INTO user_profiles(age, city, url, user_id)
              VALUES($1, $2, $3, $4)
              RETURNING *`;
  const params = [age, city, url, userId];
  return db.query(q, params);
};

module.exports.getSignature = (userId) => {
  const q = `SELECT * FROM users
              JOIN signatures
              ON signatures.user_id = users.id
              WHERE $1 = users.id`;
  const params = [userId];
  return db.query(q, params);
};

module.exports.listTable = () => {
  return db.query(
    `SELECT * FROM users
    JOIN signatures
    ON signatures.user_id = users.id
    JOIN user_profiles
    ON user_profiles.user_id = users.id`
  );
};

module.exports.listTableCities = (city) => {
  const q = `SELECT * FROM users
    JOIN signatures
    ON signatures.user_id = users.id
    JOIN user_profiles
    ON user_profiles.user_id = users.id
    WHERE $1 = user_profiles.city`;
  const params = [city];
  return db.query(q, params);
};

// onda s time mailom u db.js napises query koji ti vraca id i password
// od user where email je jednak onome sto si mu dao kao argument

// sequel injection
// INSERT INTO signatures (first, last, sig) VALUES ($1, $2, $3);
// RETURNING first, last, id; (id generated when something inserted)

//
