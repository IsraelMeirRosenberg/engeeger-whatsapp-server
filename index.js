require("dotenv").config();
const express = require("express");
const app = express();
const { createCodeQr } = require('./whatsapp');
const port = process.env.PORT || 3004;
const cors = require('cors');
require('./db').connect()
const qrcode = require('qrcode-terminal');
const { client } = require('./whatsapp')

app.use(cors())
app.use(express.json())

// client.initialize()
const router = express.Router();
app.use('/', router);
router.post('/codeQr/user',(req, res) => {
   try {
      client.on('qr', (qr) => {
         res.send(qr)
         qrcode.generate(qr, { small: true })
         console.log(qr);   
       })  
       client.on('ready', () => {
         console.log('client is ready');
})
 
  client.initialize()    
 } catch (error) {
      res.send(error)
      console.log(error);
   }
})
// app.use('*', (req, res) => {
//    res.status(404).json({ msg: 'GOT YOU! this route is not create yet! 😘' })
// })
app.listen(port, () => console.log(`server is running on port ${port} `));
