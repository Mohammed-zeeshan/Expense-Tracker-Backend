const Razorpay = require("razorpay");
const Order = require("../models/order");
const signupController = require("../controllers/signup");

exports.purchasepremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Something went wrong", error: err });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });
    const promise1 = await order.update({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    const promise2 = await req.user.update({ ispremiumuser: true });
    Promise.all([promise1, promise2])
      .then(() => {
        return res
          .status(202)
          .json({
            success: true,
            message: "Transaction Successful",
            token: signupController.generateAccessToken(
              userId,
              undefined,
              true
            ),
          });
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (err) {
    console.log(err);
  }
};
