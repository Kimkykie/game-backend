// User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    highScore: {
      type: Number,
      default: 0,
    },
    games: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "game",
      },
    ],
  },
  {
    toObject: {
      virtuals: true,
    },
  }
);

function autopopulate(next) {
  this.populate("games");
  next();
}

UserSchema.pre("find", autopopulate);
UserSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("User", UserSchema);
