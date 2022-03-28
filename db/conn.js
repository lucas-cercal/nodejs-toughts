const chalk = require('chalk');
const {Sequelize} = require('sequelize');
require('dotenv/config');

// eslint-disable-next-line max-len
const sequelize = new Sequelize(`${process.env.CLEARDB_DATABASE_URL}`);

try {
  sequelize.authenticate();
  console.log(chalk.green('\n[sequelize] authenticate successfully!\n'));
} catch (err) {
  console.log(chalk.red(`\n[sequelize] authenticate unsuccessful: ${err}\n`));
}

module.exports = sequelize;

