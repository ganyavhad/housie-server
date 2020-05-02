const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
  const dbName = config.get('dbName');
  const env = config.get('env');
  let db = `mongodb://localhost:27017/${dbName}`
  if (env == 'production') {
    const dbPassword = config.get('dbPassword');
    const dbUserName = config.get('dbUserName');
    db = `mongodb+srv://${dbUserName}:${dbPassword}@cluster0-mieym.mongodb.net/${dbName}?retryWrites=true&w=majority`
  }
  console.log("database url", db, env)
  mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log(`Connected to ${dbName}...`));
}