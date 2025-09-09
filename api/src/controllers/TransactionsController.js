const knex = require("../database");
const AppError = require("../utils/AppError");

class TransactionsController {
  async create(request, response) {
    const { 
      account_type, 
      transaction_type, 
      amount, 
      description, 
      attachment_url 
    } = request.body;
    const user_id = request.user.id;

    if (!account_type || !transaction_type || !amount) {
      throw new AppError("Todos os campos obrigatórios devem ser preenchidos");
    }

    if (!['conta-corrente', 'poupanca'].includes(account_type)) {
      throw new AppError("Tipo de conta inválido");
    }

    if (!['transferencia', 'deposito'].includes(transaction_type)) {
      throw new AppError("Tipo de transação inválido");
    }

    const [transaction_id] = await knex("transactions").insert({
      user_id,
      account_type,
      transaction_type,
      amount,
      description,
      attachment_url,
      transaction_date: knex.fn.now()
    });

    const transaction = await knex("transactions")
      .where({ id: transaction_id })
      .first();

    return response.status(201).json(transaction);
  }

  async index(request, response) {
    const user_id = request.user.id;

    const transactions = await knex("transactions")
      .where({ user_id })
      .orderBy("transaction_date", "desc");

    return response.json(transactions);
  }

  async show(request, response) {
    const { id } = request.params;
    const user_id = request.user.id;

    const transaction = await knex("transactions")
      .where({ id, user_id })
      .first();

    if (!transaction) {
      throw new AppError("Transação não encontrada");
    }

    return response.json(transaction);
  }

  async update(request, response) {
    const { id } = request.params;
    const {
      account_type,
      transaction_type,
      amount,
      description,
      attachment_url
    } = request.body;
    const user_id = request.user.id;

    const transaction = await knex("transactions")
      .where({ id, user_id })
      .first();

    if (!transaction) {
      throw new AppError("Transação não encontrada");
    }

    if (account_type && !['conta-corrente', 'poupanca'].includes(account_type)) {
      throw new AppError("Tipo de conta inválido");
    }

    if (transaction_type && !['transferencia', 'deposito'].includes(transaction_type)) {
      throw new AppError("Tipo de transação inválido");
    }

    await knex("transactions")
      .where({ id, user_id })
      .update({
        account_type: account_type || transaction.account_type,
        transaction_type: transaction_type || transaction.transaction_type,
        amount: amount !== undefined ? amount : transaction.amount,
        description: description !== undefined ? description : transaction.description,
        attachment_url: attachment_url !== undefined ? attachment_url : transaction.attachment_url,
        updated_at: knex.fn.now()
      });

    const updatedTransaction = await knex("transactions")
      .where({ id })
      .first();

    return response.json(updatedTransaction);
  }

  async delete(request, response) {
    const { id } = request.params;
    const user_id = request.user.id;

    const transaction = await knex("transactions")
      .where({ id, user_id })
      .first();

    if (!transaction) {
      throw new AppError("Transação não encontrada");
    }

    await knex("transactions")
      .where({ id, user_id })
      .delete();

    return response.status(204).send();
  }

  async getBalances(request, response) {
    const user_id = request.user.id;

    const balances = await knex("transactions")
      .where({ user_id })
      .select('account_type')
      .sum('amount as total')
      .groupBy('account_type');

    const result = {
      'conta-corrente': 0,
      'poupanca': 0
    };

    balances.forEach(balance => {
      result[balance.account_type] = parseFloat(balance.total) || 0;
    });

    return response.json(result);
  }
}

module.exports = TransactionsController;
