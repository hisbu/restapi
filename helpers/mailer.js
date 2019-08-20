const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth:{
        user: 'lab.hisbu@gmail.com',
        pass: 'soacpaurkyzgdkkn'
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter;