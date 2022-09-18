import express from "express";
import { engine } from "express-handlebars";
import * as fs from "fs";
import multer from "multer";
import { dirname } from "path";
import { fileURLToPath } from "url";

const upload = multer({ dest: "./express/uploads/imagenes" });
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./express/views");

app.use(express.static(`${__dirname}/uploads`));

app.get("/", (req, res) => {
  const equipos = fs.readFileSync("./express/data/equipos.db.json");
  const dataParse = JSON.parse(equipos);

  res.render("home", {
    layout: "main",
    data: {
      dataParse,
      cantidadEquipo: () => dataParse.length,
    },
  });
});

app.get("/equipo/:id", (req, res) => {
  const equipoId = Number(req.params.id);
  const equipos = fs.readFileSync("./express/data/equipos.db.json");
  const dataParse = JSON.parse(equipos);
  const infoEquipo = dataParse.find((equipo) => equipo.id === equipoId);
  res.render("equipo", {
    layout: "main",
    data: infoEquipo,
  });
});

app.get("/equipo/:id/editar", (req, res) => {
  const equipoId = Number(req.params.id);
  const equipos = fs.readFileSync("./express/data/equipos.db.json");
  const dataParse = JSON.parse(equipos);
  const infoEquipo = dataParse.find((equipo) => equipo.id === equipoId);

  res.render("editar", {
    layout: "main",
    data: infoEquipo,
  });
});

app.get("/agregar", (req, res) => {
  res.render("agregar", {
    layout: "main",
  });
});

app.post("/agregar", upload.single("imagen"), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const formulario = req.body;
  const equipos = fs.readFileSync("./express/data/equipos.db.json");


  res.render("agregar", {
    layout: "main",
    data: {
      mensaje: "Éxito!",
      nombreArchivo: req.file.filename,
    },
  });
});

app.get("/eliminar/:id", (req, res) => {
  const equipoID = Number(req.params.id);
  console.log(equipoID);
  const equipos = fs.readFileSync("./express/data/equipos.db.json");
  const dataParse = JSON.parse(equipos);
  const infoEquipo = dataParse.find((equipo) => equipo.id === equipoID);
  console.log(infoEquipo)

  res.render("eliminar", {
    layout: "main",
    data: infoEquipo,
  });
});


app.post("/eliminar/:id", (req, res) => {


  res.render("eliminar", {
    layout: "main",
    metodo: "POST"
  });
})

app.listen(3000);
