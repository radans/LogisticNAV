const uuid = require('uuid');
const crypto = require('crypto');

const email = "sapkotaanish000@gmail.com";
const password = "$gww9B^XajAR";


const salt = uuid.v4();
const hash = crypto.createHmac('sha512', salt);
hash.update(password);
const digest = hash.digest('hex');
const query = "INSERT INTO users (email, salt, hash) VALUES ('"+email+"','"+salt+"','"+digest+"');";

console.log(query);
