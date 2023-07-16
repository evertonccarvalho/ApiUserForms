var bodyParser = require("body-parser");
var express = require("express");
var app = express();
var router = require("./routes/routes");
var cors = require("cors");

app.use(cors());
app.use(express.static("uploads"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use("/", router);

// app.use("/uploads", express.static("uploads"));

app.listen(8686, () => {
  console.log("Servidor rodando");
});
