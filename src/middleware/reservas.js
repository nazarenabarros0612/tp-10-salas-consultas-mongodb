const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];
const estadosPermitidos = ["pendiente", "confirmada"];

function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas de salas";
  next();
}

function validarReserva(req, res, next) {
  const valores = req.body ?? {};
  const esApi = req.baseUrl.startsWith("/api/");

  const camposTexto = ["estudiante", "email", "sala", "fecha", "turno"];

  const tiposTextoValidos = camposTexto.every(
    (campo) =>
      typeof valores[campo] === "string" && valores[campo].trim().length > 0,
  );

  const personasTipoValido =
    typeof valores.personas === "number" ||
    (!esApi &&
      typeof valores.personas === "string" &&
      valores.personas.trim() !== "");

  const estudiante =
    typeof valores.estudiante === "string" ? valores.estudiante.trim() : "";

  const email = typeof valores.email === "string" ? valores.email.trim() : "";

  const sala = typeof valores.sala === "string" ? valores.sala.trim() : "";

  const fecha = typeof valores.fecha === "string" ? valores.fecha.trim() : "";

  const turno = typeof valores.turno === "string" ? valores.turno.trim() : "";

  const personas = personasTipoValido ? Number(valores.personas) : NaN;

  const emailValido = email.includes("@");

  const personasValidas =
    Number.isInteger(personas) && personas >= 1 && personas <= 6;

  if (
    !tiposTextoValidos ||
    !personasTipoValido ||
    !emailValido ||
    !salasPermitidas.includes(sala) ||
    !turnosPermitidos.includes(turno) ||
    !personasValidas
  ) {
    const mensaje = "Completá todos los campos con valores válidos.";

    if (esApi) {
      return res.status(400).json({
        error: mensaje,
      });
    }

    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reserva",
      error: mensaje,
      valores,
    });
  }

  req.reservaValidada = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas,
  };

  next();
}

function validarReemplazoReserva(req, res, next) {
  const valores = req.body;

  if (!valores || typeof valores !== "object" || Array.isArray(valores)) {
    return res.status(400).json({
      error: "El cuerpo de la solicitud debe ser un objeto.",
    });
  }

  const camposObligatorios = [
    "estudiante",
    "email",
    "sala",
    "fecha",
    "turno",
    "personas",
    "estado",
  ];

  const camposTexto = ["estudiante", "email", "sala", "fecha", "turno"];

  const tiposTextoValidos = camposTexto.every(
    (campo) =>
      typeof valores[campo] === "string" && valores[campo].trim().length > 0,
  );

  const camposCompletos = camposObligatorios.every((campo) =>
    Object.prototype.hasOwnProperty.call(valores, campo),
  );

  const email = typeof valores.email === "string" ? valores.email.trim() : "";

  const emailValido = email.includes("@");

  const personasValidas =
    typeof valores.personas === "number" &&
    Number.isInteger(valores.personas) &&
    valores.personas >= 1 &&
    valores.personas <= 6;

  const salaValida = salasPermitidas.includes(valores.sala);
  const turnoValido = turnosPermitidos.includes(valores.turno);
  const estadoValido = estadosPermitidos.includes(valores.estado);

  if (
    !camposCompletos ||
    !tiposTextoValidos ||
    !emailValido ||
    !personasValidas ||
    !salaValida ||
    !turnoValido ||
    !estadoValido
  ) {
    return res.status(400).json({
      error: "Los datos enviados no son válidos o están incompletos.",
    });
  }

  req.reservaValidada = {
    estudiante: valores.estudiante.trim(),
    email,
    sala: valores.sala,
    fecha: valores.fecha.trim(),
    turno: valores.turno,
    personas: valores.personas,
    estado: valores.estado,
  };

  next();
}

function validarActualizacionParcial(req, res, next) {
  const valores = req.body;

  if (!valores || typeof valores !== "object" || Array.isArray(valores)) {
    return res.status(400).json({
      error: "El cuerpo de la solicitud debe ser un objeto.",
    });
  }

  const camposPermitidos = ["personas", "estado"];
  const camposRecibidos = Object.keys(valores);

  const camposValidos =
    camposRecibidos.length > 0 &&
    camposRecibidos.every((campo) => camposPermitidos.includes(campo));

  if (!camposValidos) {
    return res.status(400).json({
      error:
        "Solo se pueden modificar los campos personas y estado. Debés enviar al menos uno.",
    });
  }

  if (
    Object.prototype.hasOwnProperty.call(valores, "personas") &&
    (typeof valores.personas !== "number" ||
      !Number.isInteger(valores.personas) ||
      valores.personas < 1 ||
      valores.personas > 6)
  ) {
    return res.status(400).json({
      error: "Personas debe ser un número entero entre 1 y 6.",
    });
  }

  if (
    Object.prototype.hasOwnProperty.call(valores, "estado") &&
    !estadosPermitidos.includes(valores.estado)
  ) {
    return res.status(400).json({
      error: "El estado debe ser pendiente o confirmada.",
    });
  }

  req.actualizacionValidada = {};

  if (Object.prototype.hasOwnProperty.call(valores, "personas")) {
    req.actualizacionValidada.personas = valores.personas;
  }

  if (Object.prototype.hasOwnProperty.call(valores, "estado")) {
    req.actualizacionValidada.estado = valores.estado;
  }

  next();
}

module.exports = {
  prepararAreaReservas,
  validarReserva,
  validarReemplazoReserva,
  validarActualizacionParcial,
};
