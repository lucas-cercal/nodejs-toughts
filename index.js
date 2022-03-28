/* eslint-disable no-unused-vars */
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
const chalk = require('chalk');

const app = express();

const conn = require('./db/conn');

// Models
const Tought = require('./models/Tought');
const User = require('./models/User');

// Import Routes
const toughtsRoutes = require('./routes/toughtsRoutes');
const authRoutes = require('./routes/authRoutes');

// Import Controller
const ToughtController = require('./controllers/ToughtController');

// Template engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Arquivos públicos
app.use(express.static('public'));

// Extração das requisições
app.use(
    express.urlencoded({
      extended: true,
    }),
);

app.use(express.json());

// Session middleware

app.enable('trust proxy');

app.use(
    session({
      name: 'session',
      secret: 'nosso_secret',
      resave: false,
      proxy: true,
      saveUninitialized: true,
      store: new FileStore({
        logFn: function() {},
        path: require('path').join(require('os').tmpdir(), 'sessions'),
      }),
      cookie: {
        secure: true,
        maxAge: 360000,
      },
    }),
);

// Flash messages
app.use(flash());

// Salvando session na resposta
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  };

  next();
});

// Routes
app.use('/toughts', toughtsRoutes);
app.use('/', authRoutes);

app.get('/', ToughtController.showToughts);

// Conexão com o banco de dados
conn.sync()
    .then(() => {
      app.listen(process.env.PORT || 5000);
    })
    .catch((err) => {
      console.log(chalk.redBright(`\n${err}\n`));
    });
