// Set up mongoose connection
const mongoose = require('mongoose');

require('dotenv').config();

mongoose.set('strictQuery', false);

const conn = process.env.DB_STRING;

// Wait for database to connect, logging an error if there is a problem
async function connectToDB(connection) {
  await mongoose.connect(conn);
  
}
connectToDB().catch((err) => console.log(err));

// Mongoose connection for use in other files
const { connection } = mongoose;
module.exports = connection;
