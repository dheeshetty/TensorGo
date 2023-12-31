const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user'); 
const axios = require('axios');
const Billing = require('./models/billing')
const { updateBillingData } = require('./Routes/billing'); 

passport.use(new GoogleStrategy({
  clientID: "114509970763-3u471brfa9u0p9dv38v5n5j9pe3dldiv.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "http://localhost:3000/auth/google/callback",
  scope: ['email', 'profile'],
  passReqToCallback: true,
},  async function(request, accessToken, refreshToken, profile, done) {
    const userId = profile.id;
  
    try {
      let user = await User.findOne({ id: userId });
  
      if (!user) {
        user = new User({
          id: userId,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          usageDetails: {
            loginCount: 0,
            lastLoginAt: new Date(),
          },
        });
  
        await user.save();
        await updateBillingData(userId, user.usageDetails.loginCount);
      } else {
        user.usageDetails.loginCount++;
        user.usageDetails.lastLoginAt = new Date();
        await user.save();
        await updateBillingData(userId, user.usageDetails.loginCount);
      }
  const billingInfo = await Billing.findOne({ userId }).exec();

  if (billingInfo) {
    const zapierUrl = "https://hooks.zapier.com/hooks/catch/17463079/3wok5lj/";
    const billingData = {
      userId: user.id,
      displayName: user.displayName,
      email: user.email,
      billingDetails: {
        currentBillingCycle: billingInfo.currentBillingCycle,
        cumulativeUsage: billingInfo.cumulativeUsage,
        billingAmount: billingInfo.billingAmount,
      },
    };

    await axios.post(zapierUrl, billingData);
  }

  return done(null, user);
} catch (err) {
  return done(err);
}
}));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});