const express = require('express')
const PORT = 3000
const app = express()
const router = require('./router')

app.use(express.json())

app.use('/', router)

app.listen(PORT, ()=>{
    console.log(`connected on port ${PORT}`)
})

