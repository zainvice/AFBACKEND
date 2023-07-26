const mongoose = require ('mongoose')

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true

    },
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "admin"
    },
    active: {
        type: Boolean,
        default: true
    },
    OTP: {
        type: String
    },
    proposals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Proposal"
        }
    ],
    drafts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Draft"
        }
    ]

}, 
{
    timestamps:true
}
)

module.exports = mongoose.model('Admin', adminSchema)