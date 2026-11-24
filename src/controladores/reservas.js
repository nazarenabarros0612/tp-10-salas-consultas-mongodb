function crearControladorReservas(servicioReservas) {
  function inicio(req, res) {
    res.render("inicio", {
      titulo: "Salas de estudio",
    });
  }

  async function estado(req, res) {
    const cantidad = await servicioReservas.contar();

    res.json({
      servicio: "activo",
      reservas: cantidad,
      solicitudId: res.locals.solicitudId,
    });
  }

  async function listar(req, res) {
    const reservas = await servicioReservas.listar();

    res.render("reservas/lista", {
      titulo: "Reservas de salas",
      reservas,
    });
  }

  function mostrarFormulario(req, res) {
    res.render("reservas/nueva", {
      titulo: "Nueva reserva",
      error: null,
      valores: {},
    });
  }

  async function mostrarDetalle(req, res) {
    const reserva = await servicioReservas.obtenerPorId(req.params.id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: "No existe una reserva con ese identificador.",
      });
    }

    res.render("reservas/detalle", {
      titulo: `Reserva #${reserva.id}`,
      reserva,
    });
  }

  async function crear(req, res) {
    await servicioReservas.crear(req.reservaValidada);

    res.redirect(302, "/reservas");
  }

  async function listarApi(req, res) {
    const permitidos = ["sala", "orden", "pagina", "limite"];

    for (const campo of Object.keys(req.query)) {
      if (!permitidos.includes(campo)) {
        return res.status(400).json({
          error: "Parámetro no permitido.",
        });
      }
    }

    const sala = req.query.sala;

    if (sala !== undefined) {
      if (typeof sala !== "string" || sala.trim() === "") {
        return res.status(400).json({
          error:
            "El parámetro sala debe aparecer una sola vez y tener contenido.",
        });
      }
    }

    let orden = "estudiante";

    if (req.query.orden !== undefined) {
      orden = req.query.orden;

      if (
        typeof orden !== "string" ||
        (orden !== "estudiante" &&
          orden !== "personas-asc" &&
          orden !== "personas-desc")
      ) {
        return res.status(400).json({
          error: "Orden no permitido.",
        });
      }
    }

    let pagina = 1;

    if (req.query.pagina !== undefined) {
      if (typeof req.query.pagina !== "string") {
        return res.status(400).json({
          error: "El parámetro pagina debe aparecer una sola vez.",
        });
      }

      pagina = Number(req.query.pagina);

      if (!Number.isInteger(pagina) || pagina < 1 || pagina > 1000) {
        return res.status(400).json({
          error: "La página debe ser un entero entre 1 y 1000.",
        });
      }
    }

    let limite = 2;

    if (req.query.limite !== undefined) {
      if (typeof req.query.limite !== "string") {
        return res.status(400).json({
          error: "El parámetro limite debe aparecer una sola vez.",
        });
      }

      limite = Number(req.query.limite);

      if (!Number.isInteger(limite) || limite < 1 || limite > 20) {
        return res.status(400).json({
          error: "El límite debe ser un entero entre 1 y 20.",
        });
      }
    }

    const resultado = await servicioReservas.consultar(
      sala,
      orden,
      pagina,
      limite,
    );

    res.status(200).json(resultado);
  }

  async function obtenerApi(req, res) {
    const id = req.params.id;

    if (!servicioReservas.idValido(id)) {
      return res.status(400).json({
        error: "El identificador de la reserva no tiene un formato válido.",
      });
    }

    const reserva = await servicioReservas.obtenerPorId(id);

    if (!reserva) {
      return res.status(404).json({
        error: "No existe una reserva con ese identificador.",
      });
    }

    res.status(200).json(reserva);
  }

  async function crearApi(req, res) {
    const reserva = await servicioReservas.crear(req.reservaValidada);

    const location = `/api/reservas/${reserva.id}`;

    res.location(location).status(201).json(reserva);
  }

  async function reemplazarApi(req, res) {
    const id = req.params.id;

    if (!servicioReservas.idValido(id)) {
      return res.status(400).json({
        error: "El identificador de la reserva no tiene un formato válido.",
      });
    }

    const reserva = await servicioReservas.reemplazar(id, req.reservaValidada);

    if (!reserva) {
      return res.status(404).json({
        error: "No existe una reserva con ese identificador.",
      });
    }

    res.status(200).json(reserva);
  }

  async function actualizarParcialApi(req, res) {
    const id = req.params.id;

    if (!servicioReservas.idValido(id)) {
      return res.status(400).json({
        error: "El identificador de la reserva no tiene un formato válido.",
      });
    }

    const reserva = await servicioReservas.actualizarParcial(
      id,
      req.actualizacionValidada,
    );

    if (!reserva) {
      return res.status(404).json({
        error: "No existe una reserva con ese identificador.",
      });
    }

    res.status(200).json(reserva);
  }

  async function eliminarApi(req, res) {
    const id = req.params.id;

    if (!servicioReservas.idValido(id)) {
      return res.status(400).json({
        error: "El identificador de la reserva no tiene un formato válido.",
      });
    }

    const eliminada = await servicioReservas.eliminar(id);

    if (!eliminada) {
      return res.status(404).json({
        error: "No existe una reserva con ese identificador.",
      });
    }

    res.status(204).end();
  }

  function noEncontrado(req, res) {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  }

  return {
    inicio,
    estado,
    listar,
    mostrarFormulario,
    mostrarDetalle,
    crear,
    listarApi,
    obtenerApi,
    crearApi,
    reemplazarApi,
    actualizarParcialApi,
    eliminarApi,
    noEncontrado,
  };
}

module.exports = {
  crearControladorReservas,
};
