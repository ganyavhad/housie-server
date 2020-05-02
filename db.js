const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
  console.log("Process", process.env.NODE_ENV)
  const dbName = config.get('dbName');
  let db = `mongodb://localhost:27017/${dbName}`
  if (process.env.NODE_ENV == 'production') {
    const dbPassword = config.get('dbPassword');
    const dbUserName = config.get('dbUserName');
    let db = `mongodb+srv://${dbUserName}:${dbPassword}@cluster0-mieym.mongodb.net/${dbName}?retryWrites=true&w=majority`
  }
  mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log(`Connected to ${dbName}...`));
}