// const firebase = require("firebase")
const {initializeApp, cert} = require('firebase-admin/app')
const {getFirestore} = require('firebase-admin/firestore')

const serviceAccount = require('./credentials.json')

const app = initializeApp({
    credential : cert(serviceAccount)
})

const db = getFirestore(app)
// console.log(db)
module.exports = {db}



