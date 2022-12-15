const jwt = require('jsonwebtoken')
require('dotenv').config()

const generateAdminToken = (id) => {
    return new Promise ((resolve,reject)=>{
        let adminToken =  jwt.sign({ id }, process.env.ADMIN_TOKEN_SECRET, { expiresIn: '3d' })
        resolve(adminToken)
    })
}



module.exports = {generateAdminToken}