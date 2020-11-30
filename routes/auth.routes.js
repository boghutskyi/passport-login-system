const { Router } = require('express')
const bcrypt = require('bcrypt')
const router = Router()
const password = require('passport')
const checkAuthenticated = require('../middleware/checkAuthenticated.middleware')
const checkNoAuthenticated = require('../middleware/checkNoAuthenticated.middleware')

const users = []

const initializePassport = require('../passport.config')
const passport = require('passport')
initializePassport(
    password,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

router.get('/', checkAuthenticated, (req, res) => {
    res.render('../public/index.ejs', { name: req.user.name })
})
router.get('/login', checkNoAuthenticated, (req, res) => {
    res.render('../public/login.ejs')
})
router.post('/login', checkNoAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
router.get('/register', checkNoAuthenticated, (req, res) => {
    res.render('../public/register.ejs')
})
router.post('/register', checkNoAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch (e) {
        res.redirect('/register')
    }
    console.log(users)
})

module.exports = router