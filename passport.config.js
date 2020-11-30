const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if (!user) {
            return done(null, false, { message: 'No user with that email' })
        }
        try {
            const compare = await bcrypt.compare(password, user.password)
            if (!compare) {
                return done(null, false, { message: 'Password incorrect' })
            }
            return done(null, user)
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize