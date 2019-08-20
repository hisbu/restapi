const mysql = require('mysql')

// const conn = mysql.createConnection({
//     host: 'localhost',
//     user: 'hisbu',
//     password: 'password123',
//     database: 'instagrin',
//     port: 3306
// })

const conn = mysql.createConnection({
    host: 'db4free.net',
    user: 'hisbu45',
    password: 'P@ssw0rd.o1',
    database: 'instagrinhisbu',
    port: 3306
})


module.exports = conn