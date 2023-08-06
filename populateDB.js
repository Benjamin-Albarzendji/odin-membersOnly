// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const mongoose = require('mongoose');
const User = require('./models/user');
const Chat = require('./models/chat');

const users = [];
const chats = [];

mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createUsers();
  await createChats();

  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function userCreate(
  index,
  first_name,
  family_name,
  username,
  password,
  member_status
) {
  const user = new User({
    first_name,
    family_name,
    username,
    password,
    member_status,
  });

  await user.save();
  users[index] = user;
  console.log(`Added user: ${first_name}`);
}

async function chatCreate(index, user, message) {
  const chat = new Chat({
    user,
    message,
  });

  await chat.save();
  chats[index] = chat;
  console.log(`Added chat: ${message}`);
}

async function createUsers() {
  await userCreate(0, 'John', 'Doe', 'johndoe', 'password', true);
  await userCreate(1, 'Jane', 'Doe', 'janedoe', 'password', true);
  await userCreate(2, 'John', 'Smith', 'johnsmith', 'password', true);
}

async function createChats() {
  await chatCreate(0, users[0], 'Hello, World!');
  await chatCreate(1, users[1], 'Hello, not World!');
  await chatCreate(2, users[2], 'Hello, World3!');
}
