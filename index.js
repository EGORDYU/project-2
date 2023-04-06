//require packages
const express = require('express')
require('dotenv').config()


// app config
const app = express()
const PORT = process.env.PORT || 8000
app.set('view engine', 'ejs')

// middlewares
//parse html form request obdies
app.use(express.urlencoded({ extended: false }))

// routes and controllers
app.get('/', (req, res) =>{
    res.render('index.ejs');
})



app.use('/users', require('./controllers/users.js'))

//app.listen
app.listen(PORT, () => {
    console.log(`authenticating users on port ${PORT}`)
})