const express = require('express')
const app = express();
const cors = require('cors');
const port = 3000
const Stripe = require("stripe");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const stripeRouter = require("./routes/stripe");
const bodyParser = require('body-parser');


dotenv.config()

const stripe = Stripe(process.env.STRIPE_SECRET);
mongoose.connect(process.env.MONGO_URL).then(() => console.log("db connected")).catch((err) => console.log(err));
const endpointSecret = "whsec_SiVF3pm2dJlWhrLQwlRqZ6tHPaDLQJUc";


app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
    const sig = request.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use("/stripe", stripeRouter);

app.listen(process.env.PORT || port, () => console.log(`App listening on port ${process.env.PORT}!`))