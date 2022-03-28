/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */

const res = require('express/lib/response');
const Tought = require('../models/Tought');
const User = require('../models/User');

const {Op} = require('sequelize');

module.exports = class ToughtController {
  static async showToughts(req, res) {
    let search = '';

    if (req.query.search) {
      search = req.query.search;
    }

    let order = 'DESC';

    if (req.query.order === 'old') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }

    const toughtsData = await Tought.findAll({
      include: User,
      where: {
        title: {[Op.like]: `%${search}%`},
      },
      order: [['createdAt', order]],
    });

    const toughts = toughtsData.map((result) => result.get({plain: true}));

    let toughtsQty = toughts.length;

    console.log(toughtsQty);

    if (toughtsQty == 0) {
      toughtsQty = false;
    }

    res.render('toughts/home', {toughts, search, toughtsQty});
  }

  static async dashboard(req, res) {
    const userId = req.session.userid;

    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: Tought,
      plain: true,
    });

    // Checando a existência do usuário
    if (!user) {
      res.redirect('/login');
    }

    const toughts = user.Toughts.map((result) => result.dataValues);

    let emptyToughts = true;

    console.log(toughts.length);

    if (toughts.length > 0) {
      emptyToughts = false;
    }

    console.log(emptyToughts);

    res.render('toughts/dashboard', {toughts, emptyToughts});
  }

  static createTought(req, res) {
    res.render('toughts/create');
  }

  static async createToughtSave(req, res) {
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Tought.create(tought);
      req.flash('message', 'Pensamento criado com sucesso!');

      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      });
    } catch (error) {
      console.log(chalk.red(`\n[tought] creation unsuccessful: ${error}\n`));
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;

    try {
      await Tought.destroy({where: {id: id, UserId: UserId}});
      req.flash('message', 'Pensamento removido com sucesso!');

      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      });
    } catch (error) {
      console.log(chalk.red(`\n[tought] delete unsuccessful: ${error}\n`));
    }
  }

  static async updateTought(req, res) {
    const id = req.params.id;

    const tought = await Tought.findOne({where: {id: id}, raw: true});

    console.log(tought);

    res.render('toughts/edit', {tought});
  }

  static updateToughtSave(req, res) {
    const id = req.body.id;

    const tought = {
      title: req.body.title,
      description: req.body.description,
    };

    Tought.update(tought, {where: {id: id}})
        .then(() => {
          req.flash('message', 'Pensamento atualizado com sucesso!');
          req.session.save(() => {
            res.redirect('/toughts/dashboard');
          });
        })
        .catch((err) => console.log());
  }
};
