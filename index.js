require("dotenv").config();
const express = require("express");
const app = express();
const { createCodeQr } = require('./whatsapp');
const port = process.env.PORT || 3004;
const cors = require('cors');
const webSocket = require('ws');
const wss = new webSocket.Server({ port: 8080 });
require('./db').connect()
const qrcode = require('qrcode-terminal');
const { client } = require('./whatsapp')


app.use(cors())
app.use(express.json())

// client.initialize()
const router = express.Router();

wss.on("connection", ws => {
      console.log("started");
      try {
      client.on('qr', (qr) => {
         ws.send(qr)
         console.log(qr);

      })
      client.on('ready', () => {

         console.log('client is ready');
      })
//       client.on("disconnected", () => {
//     client.logout()
   
//     console.log("disconnected");
//  })
      client.initialize()
   } catch (error) {
      res.send(error)
      console.log(error);
   }
})
// })
// app.use('*', (req, res) => {
//    res.status(404).json({ msg: 'GOT YOU! this route is not create yet! 😘' })
// })
app.listen(port, () => console.log(`server is running on port ${port} `));









