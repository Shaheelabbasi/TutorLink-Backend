require("dotenv").config({path:"../.env"})
const app = require('./app.js');
const { connectDb } = require('./Db/connect.js');
const PORT=process.env.PORT
connectDb()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is running on the port ${PORT}`)
    );
  })
  .catch(err => console.log(err));

  