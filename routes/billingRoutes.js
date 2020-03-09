const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');
// doc stripe on create charge : https://stripe.com/docs/api/charges/create
module.exports = app => {
    // stripe library always returns a promise each time a charge is created
    app.post('/api/stripe', requireLogin, async (req, res) => {
        const charge = await stripe.charges.create({
            amount: 500,
            currency: 'usd',
            description: '$5 for 5 credits',
            source: req.body.id,
        });
        // req.user assigned by passport.initialize() and passport.session()
        req.user.credits += 5;
        const user = await req.user.save();
        //sends new user to client
        res.send(user);
    });
};