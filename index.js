const express = require('express') //1
const cors = require('cors') //1
const bodyParser = require('body-parser') //1
const moment = require('moment')
const nodemailer = require('nodemailer')//3
const port = process.env.PORT || 2017
const Crypto = require('crypto')//4 
const bearerToken = require('express-bearer-token')//5

const app = express() //1

app.use(cors()) //1 ==> agar bisa diakses dari react
app.use(bearerToken()) // ==> agar rest api bisa terima token
app.use(bodyParser.json()) //1 == untuk kirim json dari req.body
app.use(bodyParser.urlencoded( {extended: false})) //1
app.use(express.static('public')) //3 ==> 'public' berupa nama directori yang akan di publish

//seting nodemailer
// const transporter = nodemailer.createTransport({
//     service : 'gmail',
//     auth:{
//         user: 'lab.hisbu@gmail.com',
//         pass: 'soacpaurkyzgdkkn'
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// })

//rspond API aktif
app.get('/', (req, res)=>{ //1
    res.status(200).send('<h1>API Aktif!</h1>')
})

// app.get('/coba',(req, res)=>{
//     process.exit();

//     res.status(200).send('<p>success</p>'>
// })

app.get('/testencrypt',(req, res)=>{
    var hashPassword = Crypto.createHmac("sha256", "kucingbertasbih")
                        .update(req.query.password).digest("hex");
    console.log(hashPassword);
    res.send(`Panjang = ${hashPassword.length} Password anda ${req.query.password} di encrypt menjadi ${hashPassword}`)
})

//kode kirim emial
app.post('/sendmail',(req, res)=>{
    var mailOptions = {
        from: "hisbu<lab.hisbu@gmail.com>",
        to: "hisbu.4@gmail.com",
        subject: "Selamat......!!!",
        html:`  <h2>Selamat anda mendapatkan foto menarik sekali,
                bisa dibuka di link berikut:
                <a href="https://api-imagehisbu.herokuapp.com//post/images/POS1565581729759.png">Link Image</a>
                </h2>`
    }

    transporter.sendMail(mailOptions, (err, res1)=>{
        if(err){
            return res.status(500).send({message: "Error kirim email", err})
        }

        return res.status(200).send({message: "Kirim email berhasil"})
    })
})

const { postsRouter, usersRouter} =require('./routers') //2

app.use('/post', postsRouter) //2
app.use('/user',usersRouter)//5

app.listen(port, ()=> console.log(`Api aktif di port ${port}`)) //1

var now = moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
console.log(now) 
