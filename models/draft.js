const mongoose = require ('mongoose')

const draftSchema = new mongoose.Schema({
    proposalId: {
        type: String,
        required: true,
    },
    proposalData: {
        type: Object,
        required: false
    },
    introductionData: {
        type: Object,
        required: false
    },
    coverData: {
        type: Object,
        required: false
    },
    planofactionData: {
        type: Object,
        required: false
    },
    investmentData: {
        type: Object,
        required: false
    },
    aboutusData: {
        type: Object,
        required: false
    },
    closingData: {
        type: Object,
        required: false
    },
    contactsData: {
        type: Object,
        required: false
    },
    reviewsData: {
        type: Object,
        required: false
    },
    corporateVideoData: {
        type: Object,
        required: false
    },
    impressionData: {
        type: Object,
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