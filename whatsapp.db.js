const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    campId: { type: mongoose.SchemaTypes.ObjectId },
    msgId: { type: mongoose.SchemaTypes.ObjectId },
    whatsappId: String,
    leadId: { type: mongoose.SchemaTypes.ObjectId }
})
const whatsappModel = mongoose.model("whatsapp", schema)


// mongoose.models.campaign


async function create(data) {
    return await whatsappModel.create(data)
}

async function read(whatsappId) {
    return await whatsappModel.findOne({ whatsappId })
}


async function updateCampaign(campId, msgId, leadId) {
    return await mongoose.connection.db.collection('campaigns')
        .findOneAndUpdate(
            { _id: campId },
            { $push: { "msg.$[lead].leads": { lead: leadId, receptionDate: Date.now(), status: 'recived' } } },
            {
                arrayFilters: [{ "lead._id": msgId }]
            })
}

async function del(whatsappId) {
    return await whatsappModel.deleteOne({ whatsappId })
}


module.exports = { create, updateCampaign, read, del }