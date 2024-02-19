const { Client, LocalAuth } = require('whatsapp-web.js')
const db = require('./whatsapp.db')
const qrcode = require('qrcode-terminal')
const cron = require('node-cron')
const numbers = '+972545894480'

const client = new Client({
    authStrategy: new LocalAuth
})
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true })
})
client.on('ready', () => {
    console.log('client is ready');


})
const num = '+972545894480'
const listNum = ['+972544370508']

const data = {
    leads: [{
        leadId: '',
        phone: '0544370508',
    }],
    campId: '',
    msgId: '',
}


function sendMessageNow(message, data) {
    for (const l in data.leads) {
        const chatId = l.phone.substring(1) + '@c.us'
        setTimeout(() => {
            client.sendMessage(chatId, message)
                .then(m => {
                    let obj = {
                        campId: data.campId,
                        msgId: data.msgId,
                        leadId: l.leadId,
                        whatsappId: m.id.id
                    }
                    db.create(obj)
                    console.log("done");
                })
        }, 8000)
    }
}
// sendMessageNow(message, data)


// client.on('message', async (message) => {
//     try {
//         const contact = await message.getContact()
//         const chat = await message.getChat()
//         if (message.from !== 'status@broadcast') {
//             if (message.body) {
//                 setTimeout(() => {

//                     client.sendMessage(message.from, `מה קורה?${contact.shortName}😊`)
//                 }, 3000)
//             }
//         }

//     } catch (error) {
//         console.log(error);
//     }
// })


client.on('message_ack', async (message) => {
    // אם קיבלתי ack שתיים אז להפעיל פונקצייה לטיפול ולעביר אליה את מזהה
    console.log("id: ", message.id.id);
    console.log('ack: ', message.ack);
    if (message.ack == 3) {
        handleMessage(message.id)
    }
})
async function handleMessage(whatsappId) {
    try {

        // 1 read from db by whatsappId
        console.log("whatsappId:", whatsappId);
        const result = await db.read(whatsappId.id)
        console.log("result:", result);
        // 2 update campaign 
        await db.updateCampaign(result.campId, result.msgId, result.leadId)
        console.log("updated");
        // 3 deleate from db whatsapp 
        await db.del(whatsappId.id)
        console.log("deleted");
    }
    catch (err) {
        console.log("err:", err.message);
    }
}

module.exports = { client }