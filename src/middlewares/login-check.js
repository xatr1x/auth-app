import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const loginFilePath = path.join(__dirname, '../login.html');

export default function requireLogin(req, res, next) {
  const sess = req.session;
  if (sess.username && sess.password) {
    const msFromUpdated =
      new Date().getTime() - new Date(sess.updatedAt).getTime();

    if (sess.blocked && msFromUpdated >= 300000) {
      sess.updatedAt = new Date();
      console.log('UNBLOCKED');
      sess.blocked = false;
    }

    if (!sess.blocked && msFromUpdated >= 3600000) {
      sess.updatedAt = new Date();
      console.log('BLOCKED');
      sess.blocked = true;
    }

    if (sess.blocked) {
      return res.send(`
        <h1>Blocked</h1>
        <a href='/'>Home</a>
      `);
    }
    next();
  } else {
    res.sendFile(loginFilePath);
  }
}
