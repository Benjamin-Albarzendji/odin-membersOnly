const mongoose = require('mongoose');

const { Schema } = mongoose;

const ChatSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true, maxLength: 100 },
  timestamp: { type: Date, required: false, default: Date.now },
});



// Export model
module.exports = mongoose.model('Chat', ChatSchema);
