//generate token
const jwt = require ('jsonwebtoken');

module.exports = {
    createJWTToken(payload){
        return jwt.sign(payload, "KucingKoneng", { expiresIn : '12h' })
    }
}