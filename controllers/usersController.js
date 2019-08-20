const conn = require('../database')
const Crypto = require('crypto')
const transporter = require('../helpers/mailer')
const { createJWTToken } = require('../helpers/jwt')


module.exports={
    register: (req,res)=>{
        var {username, password, email} = req.body;
        var sql = `Select username from users Where username = '${username}'`;
        conn.query(sql, (err,result)=>{
            if(err){
                return res.status(500).send({status: 'error', err})
            }

            if(result.length > 0){
                return res.status(200).send({status: 'error', message: 'Username has been taken!'})
            }
            else{
                var hashPassword = Crypto.createHmac("sha256", "kucingKoneng")
                                        .update(password).digest("hex");
                
                var dataUser = {
                    username,
                    password: hashPassword,
                    email,
                    status: 'Unverified',
                    lastlogin: new Date()
                }
            }

            sql= `INSERT into users SET ?`;
            conn.query(sql,dataUser,(err1,result1)=>{
                if(err1){
                    return res.status(500).send({status: 'error', err: err1})
                }

                var linkVerifikasi = `http://localhost:3000/verified?username=${username}&password=${hashPassword}`;
                var mailOptions ={
                    from : `Penguasa Instagrin <lab.hisbu@gmail.com>`,
                    to: email,
                    subject: 'Verifikasi email untuk Instagrin',
                    html: `Mohon untuk klik link dibawah ini untuk verifikasi email anda :
                            <a href="${linkVerifikasi}">Join Instagrin</a>`
                }

                transporter.sendMail(mailOptions, (err2, res2)=>{
                    if(err2){
                        console.log(err2)
                        return res.status(500).send({status: 'error', err: err2})
                    }

                    console.log('Success!')
                    return res.status(200).send({username, email, status: 'Unverified'})
                })
            })
        })
        
    },
    emailVerifikasi: (req,res)=>{
        var {username, password} = req.body;
        var sql = `SELECT username,email from users where username = '${username}'`;
        conn.query(sql, (err, results)=>{
            if(err) return res.status(500).send({status: 'error', err})

            if(results.length === 0){
                return res.status(500).send({status: 'error', err: 'User Not Found!'})
            }
            
            sql = `Update users set status='Verified' where username='${username}' and password='${password}'`;
            conn.query(sql, (err, results1)=>{
                if(err) return res.status(500).send({status: 'error', err})

                return res.status(200).send({username: results[0].username, email: results[0].email, status: 'Verified'})
            })

        })
    },
    resendEmailVer: (req, res)=>{
        var {username, email} = req.body

        var sql = `Select username,password,email from users whre username = '${username}' and email='${email}'`
        conn.query(sql, (err, results)=>{
            if(err)  return res.status(500).send({status: 'error', err})

            if(results.length === 0) {
                return res.status(500).send({status: 'error', err: 'User not FOund'})
            }

            var linkVerifikasi = `http://localhost:3000/verified?username=${results[0].username}&password=${results[0].password}`;
            var mailOptions ={
                from : `Penguasa Instagrin <lab.hisbu@gmail.com>`,
                to: results[0].email,
                subject: 'Verifikasi email untuk Instagrin',
                html: `Mohon untuk klik link dibawah ini untuk verifikasi email anda :
                        <a href="${linkVerifikasi}">Join Instagrin</a>`
            }

            transporter.sendMail(mailOptions, (err2, res2)=>{
                if(err2){
                    console.log(err2)
                    return res.status(500).send({status: 'error', err: err2})
                }

                console.log('Success!')
                return res.status(200).send({username, email, status: 'Unverified'})
            })
        })
        
    },
    keepLogin: (req, res)=>{
        var {username} = req.body
        console.log(req.user)
        var sql = `Select * from users where id = ${req.user.userId}`
        conn.query(sql, (err,results)=>{
            if(err) return res.status(500).send({status: 'error', err})

            if(results.length===0){
                return res.status(500).send({status: 'error', err: 'User not FOund'})
            }

            const token = createJWTToken({userId: results[0].id, username : results[0].username})

            res.send({username: results[0].username, email: results[0].email, status: results[0].status, token})
        })
    },
    login: (req,res)=>{
        console.log('masuk login')
        var {username, password} = req.body
        var hashPassword = Crypto.createHmac("sha256", "kucingKoneng")
                                        .update(password).digest("hex");
        
        var sql = `Select * from users where username = '${username}' and password='${hashPassword}'`
        conn.query(sql, (err, results)=>{
            
            if(err) {
                console.log(err)
                return res.status(500).send({status: 'error', err})
            }

            if(results.length === 0){
                return res.status(200).send({status: 'error', message: 'Username or Password Incorrect!'})

            }

            //create token
            const token = createJWTToken({userId: results[0].id, username : results[0].username})
            console.log(token)
            return res.status(200).send({username, email: results[0].email, status: results[0].status, token})
        })
    }
}