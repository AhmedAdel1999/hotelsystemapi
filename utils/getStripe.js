const loadStripe=require('@stripe/stripe-js');
let stripePromise;
const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.STRIPE_API_KEY);
    }
    return stripePromise;
};
module.exports= getStripe;