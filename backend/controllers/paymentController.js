const crypto = require('crypto')
const Payment = require('../models/paymentModel.js')
const Razorpay = require("razorpay");

//CHECKOUT
const checkout = async (req, res) => {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_API_SECRET,
    });
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };

    try {
      const response = await razorpay.orders.create(options)
      res.json({
          order_id: response.id,
          currency: response.currency,
          amount: response.amount,
      })
  } catch (err) {
    console.log("Error",err)
     res.status(400).send('Not able to create order. Please try again!');
  }
};

//PAYMENT VERIFICATION
const paymentVerification = async (req, res) => {
  
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  console.log(req.body)

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body)
    .digest("hex");

    await Payment.create({
      razorpay_payment_id,
    });

    res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );
  
  const isAuthentic = expectedSignature === razorpay_signature;

  // if (isAuthentic) {
  //   // Database comes here


  // } else {
  //   res.status(400).json({
  //     success: false,
  //   });
  // }
};

module.exports = {
    checkout,
    paymentVerification
}