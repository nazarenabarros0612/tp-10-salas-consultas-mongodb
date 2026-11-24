const express = require("express");

const {
  validarReserva,
  validarReemplazoReserva,
  validarActualizacionParcial,
} = require("../middleware/reservas");

function crearRouterReservasApi(controlador) {
  const router = express.Router();

  router.get("/", controlador.listarApi);
  router.get("/:id", controlador.obtenerApi);

  router.post("/", validarReserva, controlador.crearApi);

  router.put("/:id", validarReemplazoReserva, controlador.reemplazarApi);

  router.patch(
    "/:id",
    validarActualizacionParcial,
    controlador.actualizarParcialApi,
  );

  router.delete("/:id", controlador.eliminarApi);

  return router;
}

module.exports = {
  crearRouterReservasApi,
};
