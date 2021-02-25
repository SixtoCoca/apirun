import express from "express";
import bodyparser from "body-parser";
import vision from "@google-cloud/vision";
import multer from "multer";
import fs from "fs";

const server = express();
const client = new vision.ImageAnnotatorClient();
const upload = multer({ dest: "uploads/" });

server.use(bodyparser.json());

server.get("/", (peticion, respuesta) => {
  respuesta.json({
    mensaje: "Que pasa maquina",
    peticion: peticion.headers,
  });
});

const middleware = (peticion, respuesta, next) => {
  console.log("Estamos en el middleware");
  fs.writeFileSync("uploads/sync.txt", "anni");
  next();
};
server.get("/sixto", middleware, (peticion, respuesta) => {
  respuesta.json({
    mensaje: "Que pasa maquina",
    peticion: peticion.headers,
  });
});

server.post("/", (peticion, respuesta) => {
  respuesta.json({
    mensaje: "Esto es un post",
    num: peticion.body.num,
  });
});

server.post("/api", upload.single("imagen"), async (peticion, respuesta) => {
  const [result] = await client.labelDetection(
    peticion.file.destination + peticion.file.filename
  );
  const labels = result.labelAnnotations;
  respuesta.json({
    resultado: labels,
  });
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log("Escuchando en http://localhost:" + port);
});
