'use strict'

module.exports = {
    secretKey: `${process.env.JWT_SECRET}`,
    option: {
        algorithm: "HS256",
        expiresIn: "10m"
    }
}