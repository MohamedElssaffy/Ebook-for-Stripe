const path = require("path");

const express = require("express");
const keys = require('./config/keys')
const stripe = require("stripe")(
 keys.stripeSecKey
);
const exphbs = require("express-handlebars");

// pk_test_51J7UgpGf2SqXQW5u00yYpaJkt7hrl4xmgRhm8PgNu7ynMCfVgD2csrr5SkXVkPcZbneKYFJwKwHtlx9zSHwR9sPf00N2TxZgyP

//sk_test_51J7UgpGf2SqXQW5u34mOgdALxNlcl47vFL2VsFAxsJYCQjYpWAERKSpeL6buXSyJSqxTI2By3NqTKokR2FKG7xl000NdOkdzO0

const app = express();

// Handlebars

app.engine(".hbs", exphbs({ defaultLayout: "main", extname: "hbs" }));
app.set("view engine", ".hbs");

//  For Static Folder

app.use(express.static(path.join(__dirname, "public")));

// For Parser The Body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes


// For Home Page

app.get("/", (req, res) => {
  res.render("index", {
    stripePupKey: keys.stripePupKey
  });
});

//  For Stripe 

app.post('/charge', async (req, res) => {
try {
  const customer = await stripe.customers.create({
    email:req.body.stripeEmail,
    source: req.body.stripeToken
  })

  await stripe.charges.create({
    customer: customer.id,
    amount: 2500,
    currency: 'usd',
    description: 'Ebook Books'
  })

  res.render('success')
} catch (err) {
  console.error(err)
  res.status(400).send('SomeThing Went Wrong')
}
})



app.listen(keys.port, () => console.log("App Running"));
