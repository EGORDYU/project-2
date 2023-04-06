//required packages
const express = require('express')
const router = express.Router()

//mount routes on router


//GET /users/new -- show route for a form that creates a new user
//(sign up for the app)
router.get('/new', (req,res) =>{
    res.render('users/new.ejs')
})

//POST /users -- CREATE a new user from the form @ GET /users/new
router.post ('/', (req,res) => {

    //do a find or create with the user's given email
    //if the user's email returns as found -- don't let them sign up

    //instead redirect them to the login page
    //hash the user's password before we add it to the db
    //save the user in the db
    // encrypt the logged in user's id
    //set encrypted id as a cookie
    //redirect user




    res.send('create a new user if they do not exist alread in the db, log a user in')
})

//GET /users/login --show route for a form that lets a user login
router.get('/login', (req,res) =>{
    res.send('show a form that lets the user log in')
})
//POST /users/login --authenticate a user's credentials
router.post('/login',(req,res) =>{
    res.send('verify credentials that are given by the user to login')
})
// GET /users/logout -- log out the current user
router.get('/logout',(req,res)=>{
    res.send('log a user out')
    res.redirect('/')
})

//GET /users/profile -- show authorized users their profile page (optional)
router.get('/profile',(req,res) =>{
    res.send('show the currently logged in user their personal profile page')
})
//export the router instance

module.exports = router