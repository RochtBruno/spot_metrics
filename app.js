// app.js
const mongoose = require("mongoose");
//const bodyParser = require("body-parser");
const jogadorRoutes = require("./routes/jogadorRoutes");
const swaggerUi = require("swagger-ui-express");
const express = require("express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const cors = require("cors");
//require("dotenv").config();

mongoose
  .connect("mongodb+srv://brunotaveirar0382:wjj4lmCRIcjtqMBA@cluster0.2dxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado ao MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB Atlas:", error);
  });

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true });
});

app.use("/players", jogadorRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
