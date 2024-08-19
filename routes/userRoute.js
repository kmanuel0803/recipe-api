const router = require("express").Router();

const UserController = require("../controllers/UserController");

const authMiddleware = require('../middleware/AuthMiddleware');

router.use(authMiddleware);

router.get("/", UserController.getUser);

module.exports = router;