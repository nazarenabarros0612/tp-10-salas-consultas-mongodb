# TP10 - Consultas de reservas de salas con MongoDB

Aplicación web desarrollada con Node.js, Express, EJS y MongoDB Atlas para gestionar reservas de salas y realizar consultas con filtros, ordenamiento y paginación.

## Tecnologías utilizadas

- Node.js
- Express
- EJS
- MongoDB Atlas
- Mongoose
- Morgan
- Prettier
- ESLint

## Instalación

Clonar el repositorio y acceder a la carpeta del proyecto:

```bash
cd tp-10-salas-consultas-mongodb
```

Instalar las dependencias:

```bash
npm ci
```

Crear un archivo `.env` a partir de `.env.example` y configurar las variables de entorno.

## Variables de entorno

El archivo `.env.example` contiene las variables necesarias para ejecutar el proyecto:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/reservas_salas_u10
```

Configurar `MONGODB_URI` con la URI correspondiente a MongoDB Atlas y la base de datos `reservas_salas_u10`.

No subir el archivo `.env` al repositorio, ya que contiene información privada.

## Ejecución

Comprobar el código:

```bash
npm run check
```

Comprobar la conexión a MongoDB:

```bash
npm run db:comprobar
```

Iniciar la aplicación:

```bash
npm start
```

La aplicación estará disponible en:

http://localhost:3000

## Consultas de reservas

La API permite consultar las reservas mediante filtros, ordenamiento y paginación.

### Listado general

```http
GET /api/reservas
```

Obtiene las reservas disponibles con los valores de paginación predeterminados.

### Filtrar por sala

```http
GET /api/reservas?sala=Sala Norte
```

Permite filtrar las reservas por sala.

### Ordenamiento

El parámetro `orden` permite ordenar los resultados.

Valores disponibles:

- `estudiante`: orden alfabético por estudiante.
- `personas-asc`: orden ascendente por cantidad de personas.
- `personas-desc`: orden descendente por cantidad de personas.

Ejemplo:

```http
GET /api/reservas?orden=personas-asc
```

### Paginación

Los parámetros disponibles son:

- `pagina`: número de página.
- `limite`: cantidad de resultados por página.

El límite permitido es de 1 a 20 resultados por página.

Ejemplo:

```http
GET /api/reservas?pagina=2&limite=2
```

### Combinación de parámetros

Los parámetros pueden combinarse para realizar consultas específicas.

Ejemplo:

```http
GET /api/reservas?sala=Sala Norte&orden=personas-asc&pagina=1&limite=2
```

Esta consulta filtra las reservas de Sala Norte, las ordena de menor a mayor cantidad de personas y devuelve la primera página con un máximo de dos resultados.

## Ejemplos de consultas para probar

### 1. Listado general

```http
GET http://localhost:3000/api/reservas
```

### 2. Filtro por sala y orden ascendente

```http
GET http://localhost:3000/api/reservas?sala=Sala%20Norte&orden=personas-asc
```

### 3. Segunda página

```http
GET http://localhost:3000/api/reservas?pagina=2&limite=2
```

### 4. Página sin resultados

```http
GET http://localhost:3000/api/reservas?pagina=100
```

### 5. Filtro por sala sin reservas coincidentes

```http
GET http://localhost:3000/api/reservas?sala=Sala%20Multimedia
```

### 6. Orden descendente

```http
GET http://localhost:3000/api/reservas?orden=personas-desc
```

### 7. Orden por estudiante

```http
GET http://localhost:3000/api/reservas?orden=estudiante
```

### 8. Consulta de una reserva individual

```http
GET http://localhost:3000/api/reservas/ID_DE_RESERVA
```

Reemplazar `ID_DE_RESERVA` por un identificador válido.

## Respuesta de la API

Las consultas de listado devuelven un objeto con los datos de las reservas y la información de paginación.

Ejemplo de respuesta sin resultados:

```json
{
  "datos": [],
  "pagina": 1,
  "limite": 2,
  "total": 0,
  "paginas": 0
}
```

Los campos de la respuesta son:

- `datos`: reservas obtenidas.
- `pagina`: página actual.
- `limite`: cantidad máxima de resultados por página.
- `total`: cantidad total de reservas coincidentes.
- `paginas`: cantidad total de páginas.

## Validaciones

La API valida los parámetros recibidos en las consultas.

Se controlan:

- Números de página válidos.
- Límites de resultados permitidos.
- Valores de ordenamiento permitidos.
- Salas habilitadas.
- Parámetros repetidos.
- Parámetros no permitidos.
- Valores vacíos o inválidos.

Las solicitudes con parámetros inválidos devuelven un error HTTP 400.

## Operaciones CRUD

La API permite realizar operaciones sobre las reservas.

### Crear una reserva

```http
POST http://localhost:3000/api/reservas
```

Body JSON:

```json
{
  "estudiante": "Juan Pérez",
  "email": "juan@gmail.com",
  "sala": "Sala Norte",
  "fecha": "2026-11-20",
  "turno": "Mañana",
  "personas": 2
}
```

### Obtener una reserva

```http
GET http://localhost:3000/api/reservas/ID_DE_RESERVA
```

### Modificar una reserva

```http
PUT http://localhost:3000/api/reservas/ID_DE_RESERVA
```

Body JSON:

```json
{
  "estudiante": "Juan Pérez",
  "email": "juan@gmail.com",
  "sala": "Sala Sur",
  "fecha": "2026-11-20",
  "turno": "Tarde",
  "personas": 4
}
```

### Modificar parcialmente una reserva

```http
PATCH http://localhost:3000/api/reservas/ID_DE_RESERVA
```

Body JSON:

```json
{
  "personas": 3
}
```

### Eliminar una reserva

```http
DELETE http://localhost:3000/api/reservas/ID_DE_RESERVA
```

Después de eliminarla, realizar una consulta GET con el mismo identificador para comprobar que la reserva ya no existe.

## Estado de la aplicación

La aplicación dispone de un endpoint para consultar su estado.

```http
GET http://localhost:3000/estado
```

Permite verificar el estado de la aplicación y la conexión con la base de datos.

## Códigos de respuesta HTTP

| Código | Descripción |
|---|---|
| 200 | Solicitud realizada correctamente. |
| 201 | Recurso creado correctamente. |
| 204 | Recurso eliminado correctamente. |
| 400 | Solicitud inválida o parámetros incorrectos. |
| 404 | Recurso no encontrado. |
| 500 | Error interno del servidor. |

## Evidencias

Se incluye la carpeta `evidencias/` con capturas de las pruebas realizadas, correspondientes a:

- Listado general de reservas.
- Filtro y ordenamiento.
- Paginación.
- Página sin resultados.
- Consulta sin coincidencias.
- Orden descendente.
- Orden por estudiante.
- Consulta individual.
- Validaciones de parámetros incorrectos.
- Estado de la aplicación.
- Creación de reservas.
- Consulta de reserva creada.
- Modificación completa mediante PUT.
- Modificación parcial mediante PATCH.
- Verificación de modificación.
- Eliminación de reservas.
- Verificación de eliminación.

## Estructura del proyecto

```text
tp-10-salas-consultas-mongodb/
├── evidencias/
├── scripts/
├── src/
│   ├── config/
│   ├── controladores/
│   ├── middleware/
│   ├── modelos/
│   ├── rutas/
│   ├── servicios/
│   ├── vistas/
│   ├── app.js
│   └── index.js
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── package-lock.json
└── README.md
```

## Base de datos

La aplicación utiliza MongoDB Atlas.

Base de datos:

`reservas_salas_u10`

Colección:

`reservas`

Las reservas se almacenan y consultan mediante Mongoose.

## Entrega

El proyecto incluye el código fuente, los archivos de configuración, las dependencias, las evidencias de las pruebas realizadas y la documentación necesaria para su instalación, ejecución y uso.