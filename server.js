const app = require('./app');
const mongoose = require('mongoose');

const { DB_CONNECT, PORT = 3000 } = process.env;

mongoose
  .connect(DB_CONNECT)
  .then(() => {
    console.log('Database connection successful');
    app.listen(PORT, () => {
      console.log('Server running. Use our API on port: 3000');
    });
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  });
