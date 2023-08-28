const express = require("express");
const cors = require("cors");
const RestaurantModel = require("./models/RestaurantModel");
const ReservationModel = require("./models/ReservationModel");
const formatRestaurant = require("./formatRestaurant");
const formatReservation = require("./formatReservation");
const { celebrate, Joi, errors, Segments } = require("celebrate");
const { auth } = require("express-oauth2-jwt-bearer");
const validId = require("./validId");
// const { now } = require("mongoose");
const app = express();

const checkJwt = auth({
  audience: "https://reservationizer.com",
  issuerBaseURL: `https://dev-67v1j53bpc2usven.au.auth0.com/`,
});

app.use(cors());
app.use(express.json());

app.post(
  "/reservations",
  checkJwt,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      partySize: Joi.number().min(1).required(),
      date: Joi.date().required(),
      restaurantName: Joi.string().required(),
    }),
  }),
  async (req, res, next) => {
    try {
      const { body, auth } = req;
      const reservationBody = {
        userId: auth.payload.sub,
        ...body,
      };
      const reservation = new ReservationModel(reservationBody);
      await reservation.save();
      return res.status(201).send(formatReservation(reservation));
    } catch (error) {
      error.status = 400;
      next(error);
    }
  }
);

app.get("/restaurants", async (request, response) => {
  const restaurants = await RestaurantModel.find({});
  const formattedRestaurants = restaurants.map((restaurant) => {
    return formatRestaurant(restaurant);
  });
  return response.status(200).send(formattedRestaurants);
});

app.get("/restaurants/:id", async (request, response) => {
  const id = request.params.id;
  if (!validId(id)) {
    return response.status(400).send({ error: "invalid id provided" });
  }
  const restaurant = await RestaurantModel.findById(id);
  if (!restaurant) {
    return response.status(404).send({
      error: "restaurant not found",
    });
  }
  const formattedRestaurant = formatRestaurant(restaurant);
  return response.status(200).send(formattedRestaurant);
});

app.get("/reservations", checkJwt, async (request, response) => {
  const reservations = await ReservationModel.find({
    userId: request.auth.payload.sub,
  });

  return response.status(200).send(reservations);
});

/* app.get("/reservations", async (request, response) => {
  const reservations = await ReservationModel.find({});

  const formattedReservations = reservations.map((reservation) => {
    return formatReservation(reservation);
  });
  return response.status(200).send(formattedReservations);
});
*/

/* app.get("/reservations/:id", async (request, response) => {
  const id = request.params.id;
  if (!validId(id)) {
    return response.status(400).send({ "error": "invalid id provided" });
  }
  const reservation = await ReservationModel.findById(id);
  if (!reservation) {
    return response.status(404).send({
      
"error": "not found"
    });
  }

  const formattedReservation = formatReservation(reservation);

  return response.status(200).send(formattedReservation);
});
*/
app.get("/reservations/:id", checkJwt, async (request, response) => {
  const id = request.params.id;
  if (!validId(id)) {
    return response.status(400).send({ error: "invalid id provided" });
  }
  const reservation = await ReservationModel.findById(id);
  if (!reservation) {
    return response.status(404).send({
      error: "not found",
    });
  }

  const formattedReservation = formatReservation(reservation);
  if (request.auth.payload.sub === reservation.userId) {
    return response.status(200).send(formattedReservation);
  } else {
    return response.status(403).send({
      error: "user does not have permission to access this reservation",
    });
  }
});

app.use(errors());

module.exports = app;
