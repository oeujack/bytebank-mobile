const { Router } = require("express");
const multer = require("multer");

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const UsersController = require("../controllers/UsersController");

const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.post("/", usersController.create);

usersRoutes.put("/", ensureAuthenticated, usersController.update);

module.exports = usersRoutes;