//require packages
const express = require('express')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const cryptoJs = require('crypto-js');
const db = require('./models')


// app config
const app = express()
const PORT = process.env.PORT || 8000
app.set('view engine', 'ejs')

// middlewares
//parse html form request obdies
app.use(express.urlencoded({ extended: false }))
//tells express to parse incoming cookies sent from the browser
app.use(cookieParser())
app.use((req, res, next) => {
    //incoming request console logger
    console.log(`[${new Date().toLocaleString()}]: ${req.method} ${req.url}`)
    console.log('request body:', req.body)
    next() //tells express that this middleware has finished
})
// custom auth middleware
app.use( async (req,res,next) =>{
    try{
        //check if there is a cookie
        if (req.cookies.userId){
        // if so we will decrypt the cookie and lookup the user using their PK
        const decryptedPk = cryptoJs.AES.decrypt(req.cookies.userId, process.env.ENC_KEY)
        const decryptedPkString = decryptedPk.toString(cryptoJs.enc.Utf8)
        const user = await db.user.findByPk(decryptedPkString) // eager loading can be done here
        //mount the found user on the res.locals
        //in all other routes you can use that the res.locals.user is the currently logged in user
        res.locals.user=user
        } else {
            res.locals.user = null
        }
        //if there is no cookie, set res.locals.user to be null
            
    } catch(error){
        console.log(error)
        //if something goes wrong
        //set the user in the res.locals to be null
        res.locals.user = null
    } finally {
        next()
    }
})


// routes and controllers
app.get('/', (req, res) =>{
    console.log(res.locals)
    res.render('index.ejs', {
        user: res.locals.user
    });
})



app.use('/users', require('./controllers/users.js'))


//app.listen
app.listen(PORT, () => {
    console.log(`authenticating users on port ${PORT}`)
})