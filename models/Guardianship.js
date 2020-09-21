const mongoose = require('mongoose');

// Schema of Guardianship Table
var GuardianshipSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    requesterName: {
        type: String,
        required: true
    },
    recipients: [{
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        status: {
          type: Boolean,
          default: false
        }
    }]
});

  
  const Guardianship = mongoose.model('Guardianship', GuardianshipSchema);

  module.exports = Guardianship