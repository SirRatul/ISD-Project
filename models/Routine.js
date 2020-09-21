const mongoose = require('mongoose')
const validator = require('validator')

// Schema of Routine Table
const routineSchema = new mongoose.Schema({
    routineItem: {
        type: String,
        required: true,
        trim: true
    },
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    unit: {
        type: Number,
        trim: true
    },
    startDate: {
        type: String,
        required: true,
        trim: true
    },
    endDate: {
        type: String,
        required: true,
        trim: true
    },
    timesPerDay: {
        type: Number,
        required: true,
        trim: true
    },
    beforeAfterMeal: {
        type: String,
        trim: true
    },
    times: [{
        time: {
            type: String,
            required: true 
        }
    }],
    statusDay: [{
        statusTime: [{
            done: {
                type: Boolean
            },
            visible: {
                type: Boolean
            }
        }]
    }],
    notification: {
        type: String ,
        required: true,
        trim: true
    },
    notificationFor: {
        type: String ,
        required: true,
        trim: true
    },
    owner: [{
        guardian: [{
            guardianId: {
                type: mongoose.Schema.Types.ObjectId ,
                required: true,
                ref: 'User'
            },
            guardianName: {
                type: String,
                required: true
            },
            guardianEmail: {
                type: String,
                required: true
            }
        }],
        patient: [{
            patientId: {
                type: mongoose.Schema.Types.ObjectId ,
                required: true,
                ref: 'User'
            },
            patientName: {
                type: String,
                required: true
            },
            patientEmail: {
                type: String,
                required: true
            }
        }]
    }], 
}, {
    timestamps: true
})

const Routine = mongoose.model('Routine', routineSchema)

module.exports = Routine