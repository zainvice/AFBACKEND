require('dotenv').config()
const express = require('express');
const app =express()
const path= require('path')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require ('./config/coresOptions')
const connectDB = require('./config/DBConn')
const mongoose = require('mongoose')
const {logEvents}= require('./middleware/logger')
const bodyParser = require('body-parser');
const PORT =process.env.PORT || 3500

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname,'public')))

app.use('/', require('./routes/root'))

app.use('/auth', require('./routes/authRoutes'))

app.use('/proposals', require('./routes/proposalRoutes'))

app.use('/drafts', require('./routes/draftRoutes'))

app.use('/users', require('./routes/userRoutes'))

app.use('/admins', require('./routes/adminRoutes'))

app.use("/api/v1", require("./routes/resetPassword"));

app.use(errorHandler)


app.all('*', (req, res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }
    else if(req.accepts('json')){
        res.json({message: '404 Not Found!'})
    }
    else{
        res.type('text').send('404 Not found')
    }
})


mongoose.connection.once('open', () =>{
    console.log('Connected to MongoDB')
    app.listen(PORT, ()=> console.log(`Server running on ${PORT}`))
})

mongoose.connection.on('error', err =>{
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'MongoErrLog.log')
})
