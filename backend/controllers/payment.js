const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_KEY);

const create = async (req, res) => {
  console.log(req.body)
    let { currency,orderId} = req.body;
      let amount = orderId.amount*100;
      let order = orderId.orderId;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error); // Log the error for debugging
    res.status(500).send(error);
  }
}
module.exports = { create };