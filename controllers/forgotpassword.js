const uuid = require("uuid");
const Sib = require("sib-api-v3-sdk");
const bcyrpt = require("bcrypt");

const Signup = require("../models/signup");
const Forgotpassword = require("../models/forgotPassword");

const client = Sib.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.EMAIL_KEY;

exports.forgotpassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const user = await Signup.findOne({ where: { email } });
    if (user) {
      const id = uuid.v4();
      Forgotpassword.create({ id, active: true, signupId: user.id }).catch((err) => {
        throw new Error(err);
      });
      const sender = {
        email: "mohammedzeeshan440@gmail.com",
        name: "Expense Tracker",
      };
      const recievers = [
        {
          email: email,
        },
      ];
      tranEmailApi
        .sendTransacEmail({
          sender,
          to: recievers,
          subject: "Reset password",
          textContent: "Now you can reset your password",
          htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
        })
        .then((email) => {
          console.log(email);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      throw new Error("User does not exist");
    }

    return res.status(201).json("success");
  } catch (err) {
    console.log(err);
  }
};

exports.resetpassword = (req, res, next) => {
  const id = req.params.id;
  Forgotpassword.findOne({ where: { id } }).then((forgotpasswordrequest) => {
    if (forgotpasswordrequest) {
      forgotpasswordrequest.update({ active: false });
      res.status(201).send(`<html>
                              <script>
                                function formsubmitted(e) {
                                  e.preventDefault();
                                  console.log('called');
                                }
                              </script>

                              <form action="/password/updatepassword/${id}" method="GET">
                                <label for="newpassword">Enter New password</label>
                                <input name="newpassword" type="password" required></input>
                                <button>Reset password</button>
                              </form>
                            </html>
                          `);
      res.end();
    }
  });
};

exports.updatepassword = (req, res, next) => {
  try {
    const newpassword = req.query.newpassword;
    const resetpasswordid = req.params.resetpasswordid;
    Forgotpassword.findOne({ where: {id: resetpasswordid}}).then(resetpasswordrequest => {
      Signup.findOne({where: {id: resetpasswordrequest.signupId}}).then(user => {
        if (user) {
          const saltRounds = 10;
          bcyrpt.genSalt(saltRounds, function (err, salt) {
            if (err) {
              console.log(err);
              throw new Error(err);
            }
            bcyrpt.hash(newpassword, salt, function (err, hash) {
              if (err) {
                console.log(err);
                throw new Error(err);
              }
              user.update({password: hash}).then(() => {
                res.status(201).json({message: 'Successfully update the new password'})
              })
            })
          })
        }
        else {
          return res.status(404).json({ error: 'No user exists', success: false});
        }
      })
    })
  } catch (err) {
    return res.status(403).json({ err, success: false });
  }
};
