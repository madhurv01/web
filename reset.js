// reset.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('assets.db');

db.serialize(() => {
  db.run('DELETE FROM assets', (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('All records deleted from assets table.');
    }
  });

  db.run("DELETE FROM sqlite_sequence WHERE name='assets'", (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Sequence reset for assets table.');
    }
  });
});

db.close();
