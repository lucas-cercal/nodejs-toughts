const chalk = require('chalk');
const {Sequelize} = require('sequelize');
require('dotenv/config');

// eslint-disable-next-line max-len
let sequelize;

if (process.env.CLEARDB_DATABASE_URL) {
  sequelize = new Sequelize(`${process.env.CLEARDB_DATABASE_URL}`);
} else {
  sequelize = new Sequelize(`${process.env.MYSQL_DATABASE}`, `${process.env.MYSQL_USER}`, `${process.env.MYSQL_ROOT_PASSWORD}`, {
    host: 'localhost',
    dialect: 'mysql',
  });
}

try {
  sequelize.authenticate();
  console.log(chalk.green('\n[sequelize] authenticate successfully!\n'));
} catch (err) {
  console.log(chalk.red(`\n[sequelize] authenticate unsuccessful: ${err}\n`));
}

module.exports = sequelize;

