/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */

const User = require('../models/User');

const bcrypt = require('bcryptjs');

module.exports = class AuthController {
  static login(req, res) {
    res.render('auth/login');
  };

  static async loginPost(req, res) {
    const {email, password} = req.body;

    // Verificação da existência do usuário
    const user = await User.findOne({where: {email}});
    if (!user) {
      req.flash('message', 'Não foi possível encontrar sua conta no Toughts!');
      res.render('auth/login');
      return;
    }

    // Comparação das senhas
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      req.flash('message', 'E-mail e/ou senha incorretos!');
      res.render('auth/login');
      return;
    }

    req.session.userid = user.id;

    req.flash('message', 'Autenticação realizada com sucesso!');

    req.session.save(() => {
      res.redirect('/');
    });
  }

  static register(req, res) {
    res.render('auth/register');
  };

  static logout(req, res) {
    req.session.destroy();
    res.redirect('/login');
  }

  static async registerPost(req, res) {
    const {name, email, password, confirmpassword} = req.body;

    // Validação da senha
    if (password != confirmpassword) {
      req.flash('message', 'As senhas não conferem, tente novamente!');
      res.render('auth/register');
      return;
    };

    // Validação do usuário
    const checkIfUserExists = await User.findOne({where: {email: email}});

    if (checkIfUserExists) {
      req.flash('message', 'O e-mail inserido já está cadastrado!');
      res.render('auth/register');
      return;
    };

    // Criando a senha
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const createdUser = await User.create(user);

      // Inicializando a sessão

      req.session.userid = createdUser.id;

      req.flash('message', 'Cadastro realizado com sucesso!');

      req.session.save(() => {
        res.redirect('/');
      });
    } catch (err) {
      console.log(chalk.redBright(`\n${err}\n`));
    }
  };
};
