const express = require('express') //1
const cors = require('cors') //1
const bodyParser = require('body-parser') //1
const moment = require('moment')

const port = process.env.PORT || 2017

const app = express() //1

app.use(cors()) //1 ==> agar bisa diakses dari react
app.use(bodyParser.json()) //1 == untuk kirim json dari req.body
app.use(bodyParser.urlencoded( {extended: false})) //1
app.use(express.static('public')) //3 ==> 'public' berupa nama directori yang akan di publish


app.get('/', (req, res)=>{ //1
    res.status(200).send('<h1>API Aktif!</h1>')
})

const { postsRouter} =require('./routers') //2

app.use('/post', postsRouter) //2

app.listen(port, ()=> console.log(`Api aktif di port ${port}`)) //1

var now = moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
console.log(now) 
