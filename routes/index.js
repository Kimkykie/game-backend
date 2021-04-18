const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");
const userController = require("../controllers/userController");

const authJwt = require("../middleware/authJwt");

/**
 * GAME ROUTES
 */
router.get('/game/start', [authJwt.verifyToken], gameController.startGame)
router.post('/game/save', [authJwt.verifyToken], gameController.saveGame)

/**
 * AUTH ROUTES
 */

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

module.exports = router;
