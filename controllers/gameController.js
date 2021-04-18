const mongoose = require("mongoose");
const getUser = require("../handlers/getUser");

const Game = mongoose.model("game");
const User = mongoose.model("User");

exports.main = async (req, res) => {
  res.status(200).json({ message: "working" });
};

exports.saveGame = async (req, res) => {
  const requestUser = await getUser.userId(req, res);
  const newGame = new Game({
    user: requestUser,
    score: req.body.score,
  });
  newGame.save();
  const user = await User.findByIdAndUpdate(
    requestUser,
    { $addToSet: { games: newGame._id } },
    { new: true }
  );
  const highScore = Math.max(user.highScore, newGame.score)
  user.highScore = highScore;
  user.save()

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const noOfGames = await Game.countDocuments({
    user: requestUser,
    createdAt: { $gte: today },
  });
  res.status(200).json({ games: noOfGames });
};

exports.startGame = async(req, res) => {
  const requestUser = await getUser.userId(req, res);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const gamesCount = await Game.countDocuments({
    user: requestUser,
    createdAt: { $gte: today },
  });
  res.status(200).json({gamesCount});
}
