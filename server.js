require('dotenv').config()
const express = require('express');
const app =express()
const path= require('path')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require ('./config/coresOptions')
//const connectDB = require('./config/DBConn')
const mongoose = require('mongoose')
const {logEvents}= require('./middleware/logger')
const bodyParser = require('body-parser');
const PORT =process.env.PORT || 3500

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

console.log(process.env.NODE_ENV)


//connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.listen(PORT, ()=> console.log(`Server running on ${PORT}`))