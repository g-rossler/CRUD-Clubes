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

app.post("/equipo/:id/editar",upload.single("imagen"), (req, res) => {
  const equipoId = Number(req.params.id);
  const equipos = fs.readFileSync("./express/data/equipos.db.json");
  const dataParse = JSON.parse(equipos);
  const equipoFiltrado = dataParse.find((equipo) => equipo.id === equipoId);
  const formulario = req.body;
  let crest = equipoFiltrado.crestUrl
  if(req.file) {
    crest = req.file.filename
  } 

  
  const nuevoEquipo = {
    id: Number(equipoId),
    name: formulario.nombreInput,
    founded: formulario.fundacionInput,
    area: {
      name: formulario.paisInput
    },
    venue: formulario.nombreEstadioInput,
    address: formulario.direccionInput,
    website: formulario.paginaWebInput,
    crestUrl: crest

  }
  const listadoFiltrado = dataParse.filter(equipo => equipo.id != equipoId)
  listadoFiltrado.push(nuevoEquipo)
  const nuevaListaEquipos = JSON.stringify(listadoFiltrado)
  
  fs.writeFileSync("./express/data/equipos.db.json", nuevaListaEquipos);

  res.render("editar", {
    layout: "main",
    metodo: 'delete'
  });
});

app.get("/agregar", (req, res) => {
  res.render("agregar", {
    layout: "main",
  });
});

app.post("/agregar", upload.single("imagen"), (req, res) => {
  const formulario = req.body;
  const nuevoEquipo = {
    id: Number(formulario.idInput),
    name: formulario.nombreInput,
    founded: formulario.fundacionInput,
    area: {
      name: formulario.paisInput
    },
    venue: formulario.nombreEstadioInput,
    address: formulario.direccionInput,
    website: formulario.paginaWebInput,
    crestUrl: req.file.filename

  }
  
  
  const equipos = fs.readFileSync("./express/data/equipos.db.json");
  const dataParse = JSON.parse(equipos);
  
  
  dataParse.push(nuevoEquipo)
  const equiposString = JSON.stringify(dataParse)
  fs.writeFileSync("./express/data/equipos.db.json", equiposString);

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
  const equipos = fs.readFileSync("./express/data/equipos.db.json");
  const dataParse = JSON.parse(equipos);
  const infoEquipo = dataParse.find((equipo) => equipo.id === equipoID);

  res.render("eliminar", {
    layout: "main",
    data: infoEquipo,
  });
});



app.post("/eliminar/:id", (req, res) => {
  const equipoID = Number(req.params.id);
  const equipos = fs.readFileSync("./express/data/equipos.db.json");
  const dataParse = JSON.parse(equipos);
  const equiposFiltrados = dataParse.filter((equipo) => equipo.id != equipoID);
  const equiposFiltradosString = JSON.stringify(equiposFiltrados)
  
  fs.writeFileSync("./express/data/equipos.db.json", equiposFiltradosString);
  

  res.render("eliminar", {
    layout: "main",
    metodo: "Delete"
  });
})

app.listen(3000);
