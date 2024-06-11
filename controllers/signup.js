const SignUp = require("../models/signup");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function stringValidator(string) {
  if (string == undefined || string.length === 0) {
    return true;
  } else {
    return false;
  }
}

const postsignup = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (
      stringValidator(name) ||
      stringValidator(email) ||
      stringValidator(password)
    ) {
      return res.json({ message: "Something is missing" });
    } 
    await SignUp.findAll({where: {email: email}}).then((data) => {
      if (data.length === 1) {
        res.status(201).json({message: "User already exist"});
      }
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) {
            res.status(201).json({message: 'Unable to create a user'});
          }
          SignUp.create({name, email, password: hash}).then(() => {
            res.status(201).json({message: 'Successfully created a user'});
          }).catch(err => {
            res.status(401).json(err);
          })
        })
      })
    })
  } catch (err) {
    res.status(500).json(err);
  }
};

function generateAccessToken (id, name, ispremiumuser) {
  return jwt.sign({ userId: id, name: name, ispremiumuser}, process.env.SECRET_KEY);
}

const postlogin = async (req, res, next) => {
  const password = req.body.password;
    await SignUp.findAll({where: {email: req.body.email}}).then((data) => {
      if (data.length > 0) {
        if (data.length > 0) {
          bcrypt.compare(password, data[0].password, function(err, response) {
            if (err) {
              console.log(err);
              return res.status(201).json({message: 'Something went wrong'});
            }
            if (response) {
              const jwttoken = generateAccessToken(data[0].id, data[0].name, data[0].ispremiumuser);
              res.status(201).json({token: jwttoken, success: true, message: 'User login successful'});
            }
            else {
              res.status(201).json({success: false, message: 'Password incorrect'});
            }
          })
        }
      }
      else {
        return res.status(201).json({success: false, message: "User not found"});
      }
    }).catch((err) => {
      console.log(err);
    })
};

module.exports = {
  postsignup,
  postlogin,
  generateAccessToken
}