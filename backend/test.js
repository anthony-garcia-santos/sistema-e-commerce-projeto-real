require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function test() {
  try {
    const pi = await stripe.paymentIntents.create({
      amount: 1000,
      currency: 'brl',
      payment_method_types: ['card'],
    });
    console.log('Payment Intent criado:', pi.id);
  } catch (e) {
    console.error('Erro:', e);
  }
}

test();
