const mongoose = require ('mongoose')

const proposalSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    clients_email: {
        type: String,
        required: true

    },
    clients_name: {
        type: String,
        required: false
    },
    clients_GST: {
        type: String,
        required: true
    },
    clients_phone: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        default: "Admin"
    },
    reciever: {
        type: String,
        default: "User"
    },
    status:{
        type: String,
        default: "Pending"
    }


},
{
    timestamps:true
}
)

module.exports = mongoose.model('Proposal', proposalSchema)