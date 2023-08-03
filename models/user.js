const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true

    },
    phone: {
        type: String,
        required: false
    },
    GST: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "user"
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
    ]

},
{
    timestamps:true
}
)

module.exports = mongoose.model('User', userSchema)