require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { CLIENT_ORIGIN } = require("./config");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const validateToken = require("./validateToken");
const mealsRouter = require("./meals/meals-router");
const ordersRouter = require("./orders/orderForm-router");
const usersRouter = require("./users/users-router");
const errorHandler = require("./errorHandler");
const chefsRouter = require("./chefs/chefs-router");
const cuisinesRouter = require("./cuisines/cuisines-router");
const app = express();

app.use(
  morgan(NODE_ENV === "production" ? "tiny" : "common", {
    skip: () => NODE_ENV === "test",
  })
);
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(helmet());

app.use(validateToken);

app.use("/api/meals", mealsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);
app.use("/api/chefs", chefsRouter);
app.use("/api/cuisines", cuisinesRouter);

app.get("/", (req, res) => {
  res.send("Hey now, it works!");
});

app.use(errorHandler);

module.exports = app;
