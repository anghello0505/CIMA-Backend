const jwt = require('jsonwebtoken');


const generarJWT = (uid, name, email) => {

    const payload = { uid, name, email };

    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, (err, token) => {

            if (err) {
                //Todo Mal
                console.log(err);
                reject(err);
            } else {
                //Todo bien
                resolve(token);
            }
        })
    });


}

module.exports = {
    generarJWT
}