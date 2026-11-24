const mongoose = require("mongoose");
const Reserva = require("../modelos/reserva");

function representarReserva(reserva) {
  return {
    id: reserva._id.toString(),
    estudiante: reserva.estudiante,
    email: reserva.email,
    sala: reserva.sala,
    fecha: reserva.fecha,
    turno: reserva.turno,
    personas: reserva.personas,
    estado: reserva.estado,
  };
}

function crearServicioReservasMongo() {
  async function listar() {
    const reservas = await Reserva.find({}).lean();

    return reservas.map(representarReserva);
  }

  async function consultar(sala, orden = "estudiante", pagina = 1, limite = 2) {
    const filtro = {};

    if (sala !== undefined) {
      filtro.sala = sala.trim();
    }

    let ordenMongo = { estudiante: 1, _id: 1 };

    if (orden === "personas-asc") {
      ordenMongo = { personas: 1, _id: 1 };
    }

    if (orden === "personas-desc") {
      ordenMongo = { personas: -1, _id: 1 };
    }

    const salto = (pagina - 1) * limite;

    const total = await Reserva.countDocuments(filtro);

    const reservas = await Reserva.find(filtro)
      .sort(ordenMongo)
      .skip(salto)
      .limit(limite)
      .select("estudiante email sala fecha turno personas estado")
      .lean();

    return {
      datos: reservas.map(representarReserva),
      pagina,
      limite,
      total,
      paginas: Math.ceil(total / limite),
    };
  }

  async function obtenerPorId(id) {
    if (!mongoose.isObjectIdOrHexString(id)) {
      return null;
    }

    const reserva = await Reserva.findById(id).lean();

    if (!reserva) {
      return null;
    }

    return representarReserva(reserva);
  }

  async function contar() {
    return Reserva.countDocuments();
  }

  async function crear(datos) {
    const nuevaReserva = await Reserva.create({
      estudiante: datos.estudiante,
      email: datos.email,
      sala: datos.sala,
      fecha: datos.fecha,
      turno: datos.turno,
      personas: datos.personas,
    });

    return representarReserva(nuevaReserva);
  }

  async function reemplazar(id, datos) {
    const reserva = await Reserva.findOneAndReplace({ _id: id }, datos, {
      new: true,
      runValidators: true,
    }).lean();

    if (!reserva) {
      return null;
    }

    return representarReserva(reserva);
  }

  async function actualizarParcial(id, datos) {
    const reserva = await Reserva.findByIdAndUpdate(
      id,
      { $set: datos },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!reserva) {
      return null;
    }

    return representarReserva(reserva);
  }

  async function eliminar(id) {
    const resultado = await Reserva.deleteOne({ _id: id });

    return resultado.deletedCount > 0;
  }

  function idValido(id) {
    return mongoose.isObjectIdOrHexString(id);
  }

  return {
    listar,
    consultar,
    obtenerPorId,
    contar,
    crear,
    reemplazar,
    actualizarParcial,
    eliminar,
    idValido,
  };
}

module.exports = {
  crearServicioReservasMongo,
};
