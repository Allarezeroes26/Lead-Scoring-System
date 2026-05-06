const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config()
const dataRoutes = require('./routes/dataRoutes')

const port = process.env.PORT || 5001

const app = express()

app.use(express.json())
app.use(cors())

const mlhealth = async (req, res) => {
    try {
        res.status(200).json({message: "ML backend working"})
    } catch (err) {
        res.status(500).json({error: "Internal Error"})
    }
}

app.use('/api', dataRoutes)
app.use('/', mlhealth)

app.listen(port, () => {
    console.log(`Server running in port ${port}`)
})