const express = require("express");
const config = require("config");
const cookieParser = require("cookie-parser");
const errorHandlerPolice = require("./middlewares/errorHandling");

const app = express();
const mainRouter = require("./routes/index.routes");
const {
  expressWinstonErrorLogger,
} = require("./middlewares/errorLoggerWinston");

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use("/api", mainRouter);

app.use(expressWinstonErrorLogger);

app.use(errorHandlerPolice);
function start() {
  try {
    app.listen(config.get("port"), () => {
      console.log(
        `Server is running on port http://localhost:${config.get("port")}`
      );
    });
  } catch (error) {
    console.log(error);
  }
}

start();
