const { Router } = require("express");
const TransactionsController = require("../controllers/TransactionsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const transactionsRoutes = Router();
const transactionsController = new TransactionsController();

transactionsRoutes.use(ensureAuthenticated);

transactionsRoutes.post("/", transactionsController.create);
transactionsRoutes.get("/", transactionsController.index);
transactionsRoutes.get("/balances", transactionsController.getBalances);
transactionsRoutes.get("/:id", transactionsController.show);
transactionsRoutes.put("/:id", transactionsController.update);
transactionsRoutes.delete("/:id", transactionsController.delete);

module.exports = transactionsRoutes;
