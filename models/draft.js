const mongoose = require ('mongoose')

const draftSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: false
    },
    clients_email: {
        type: String,
        required: false

    },
    clients_name: {
        type: String,
        required: false
    },
    clients_GST: {
        type: String,
        required: false
    },
    clients_phone: {
        type: String,
        required: false
    },
    sender: {
        type: String,
        required: false
    }

},
{
    timestamps:true
}
)

module.exports = mongoose.model('Draft', draftSchema)