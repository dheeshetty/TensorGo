// index.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user');
const Billing = require('./models/billing');
const Invoice = require('./models/invoice');
const { updateBillingData, calculateBillingAmount, getCurrentBillingCycle, getMonthName } = require('./Routes/billing');
require('./auth');
require('./db'); 
const { Types } = mongoose; 

const app = express();

async function isLoggedIn(req, res, next) {
    try {
      if (req.user) {
        next();
      } else {
        res.redirect('/auth/google');
      }
    } catch (error) {
      console.error('Error in isLoggedIn middleware:', error);
      res.sendStatus(500);
    }
  }

  const corsOptions = {
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
  app.use(cors(corsOptions));

  

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

const usageDetailsData = {};

app.get('/usage-details', isLoggedIn, async (req, res) => {
    try {
      const userId = req.user.id;     
      const user = await User.findOne({ id: userId });
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const userUsageDetails = user.usageDetails || {};
      res.json({ usageDetails: userUsageDetails });
    } catch (error) {
      console.error('Error fetching usage details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  app.get('/billing-information', isLoggedIn, async (req, res) => {
    try {
      const userId = req.user.id;
      console.log('User ID:', userId);
  
      const billingInfo = await Billing.findOne({ userId }).exec();
      console.log('Billing Info:', billingInfo);
  
      if (!billingInfo) {
        return res.status(404).json({ error: 'Billing information not found' });
      }
  
      const billingDetails = {
        currentBillingCycle: billingInfo.currentBillingCycle,
        cumulativeUsage: billingInfo.cumulativeUsage,
        billingAmount: billingInfo.billingAmount,
      };
  
      res.json(billingDetails);
    } catch (error) {
      console.error('Error fetching billing information:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  app.post('/generate-invoice', isLoggedIn, async (req, res) => {
    try {
      const userId = req.user.id;
      console.log('User ID:', userId);

      const billingInfo = await Billing.findOne({ userId }).exec();
  
      if (!billingInfo) {
        return res.status(404).json({ error: 'Billing information not found' });
      }
  
      const invoice = new Invoice({
        userId: new Types.ObjectId('5fec47be0a8e1d43d686142d'), 
        billingCycle: billingInfo.currentBillingCycle,
        cumulativeUsage: billingInfo.cumulativeUsage,
        billingAmount: billingInfo.billingAmount,
      });
      
      
      await invoice.save();
      res.json({ message: 'Invoice generated successfully' });
    } catch (error) {
      console.error('Error generating invoice:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3001',
    failureRedirect: '/auth/google/failure'
  })
);

app.get('/protected', isLoggedIn, (req, res) => {
  res.json(req.user);
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    req.session.destroy();
    res.redirect('http://localhost:3001'); 
  });
});


app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
