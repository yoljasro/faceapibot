const mongoose = require('mongoose');

const CommandSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
  },
  jobTitle: {
    type: String,
  }
});

const Command = mongoose.model('Command', CommandSchema);

module.exports = { CommandSchema, Command };
