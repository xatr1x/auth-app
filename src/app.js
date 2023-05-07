import express from 'express';
import session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import bodyParser from 'body-parser';
import mainMessage from './helpers/mainMessage.js';
import requireLogin from './middlewares/login-check.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const redisClient = createClient();
redisClient.connect().catch(console.log('Redis error'));

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'auth app'
})

app.use(
  session({
    store: redisStore,
    secret: 'big%secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 10000 * 10000,
    },
  })
);

app.get('/', requireLogin, (req, res) => {
  const sess = req.session;
  const result = mainMessage(sess.username);

  res.send(result);
});

app.post('/login', (req, res) => {
  const sess = req.session;
  const { username, password } = req.body;
  sess.username = username;
  sess.password = password;
  sess.createdAt = new Date();
  sess.updatedAt = new Date();

  res.end('success');
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect('/');
  });
});

app.listen(3000, () => {
  process.stdout.write('\x1Bc');
  console.log('Server started at port 3000');
});
