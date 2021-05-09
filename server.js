const mongoose = require("mongoose");
const dotenv = require("dotenv");

// process.on('uncaughtException', (err) => {
//   console.log((err.name, err.message));
//   console.log('Unhandled Rejection !!!, shutting down');
//   process.exit(1);
// });

const app = require("./app");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(
    console.log(
      `the database has been connected succesfully in ${process.env.NODE_ENV} `,
      process.env.NODE_ENV
    )
  );

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log("please wait till we listen for the event");
});

process.on("unhandledRejection", (err) => {
  console.log((err.name, err.message));
  console.log("Unhandled Rejection !!!, shutting down");
  server.close(() => {
    process.exit(1);
  });
});
