/* eslint-disable no-shadow */
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

const secret = process.env.SECRET;

const User = mongoose.model("User");

exports.registerUser = (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      return res.status(400).json({
        email: "Email already exists",
      });
    }
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(404).json(err);
      else {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) return res.status(404).json(err);
          else {
            newUser.password = hash;
            newUser.save().then(async (user) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              user.save((err) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
                const cleanUser = user.toObject();
                delete cleanUser.password;
                res.json(cleanUser);
              });
            });
          }
        });
      }
    });
  });
};

exports.loginUser = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email } = req.body;
  const { password } = req.body;

  User.findOne({ email }).then((user) => {
    if (!user) {
      errors.email = "Sorry! User with email not found!";
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
          highScore: user.highScore
        };
        jwt.sign(
          payload,
          secret,
          {
            expiresIn: "1d",
          },
          (err, token) => {
            if (err) res.status(400).json(err);
            else {
              user.token = token;
              user.save();
              res.json({
                success: true,
                token,
              });
            }
          }
        );
      } else {
        errors.password = "Sorry! Incorrect Password entered";
        return res.status(400).json(errors);
      }
    });
  });
};
