const express = require('express')
const { usersController } = require('../controllers')
const { auth } = require('../helpers/auth') // auth token

const router = express.Router()

router.post('/register', usersController.register)
router.put('/verifikasiemail', usersController.emailVerifikasi)
router.post('/resendemailver', usersController.resendEmailVer)
router.post('/keeplogin', auth, usersController.keepLogin) //jadikan auth sebagai parameter kedua di router keep login
router.post('/login', usersController.login)

module.exports = router