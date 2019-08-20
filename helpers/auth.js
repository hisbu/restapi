const jwt = require ('jsonwebtoken');

module.exports = {
    auth : (req, res, next) => {
        console.log(req.method)
        if (req.method !== "OPTIONS") {  //method post yang masuk
            // let success = true;
            //req.token yang dikirim dari frontend, "KucingKoneng" ke yang harus sama dgt di jwt token
            jwt.verify(req.token, "KucingKoneng", (error, decoded) => {
                if (error) {
                    // success = false;
                    return res.status(401).json({ message: "User not authorized.", error: "User not authorized." });
                }
                console.log(decoded)
                req.user = decoded; //isi decoded berisi object 
                next();
            });
        } else {
            next();
        }
    }
}


