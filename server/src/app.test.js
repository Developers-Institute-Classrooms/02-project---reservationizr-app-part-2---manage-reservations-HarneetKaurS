const request = require("supertest");
const app = require("./app");

describe("app", () => {
  test("POST / reservations creates a new reservation", async () => {
    const expectedStatus = 201;
    const body = {
      partySize: 5,
      date: "2023-12-03T07:00:00.000Z",
      restaurantName: "1947",
    };
    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expect.objectContaining(body));

        expect(response.body.id).toBeDefined();
      });
  });

  test("POST / reservations returns a 400 when an invalid request body is provided ", async () => {
    const expectedStatus = 400;
    const body = {};
    await request(app).post("/reservations").send(body).expect(expectedStatus);
  });

  test("GET / restaurants displays all the restaurants", async () => {
    const expected = [
      {
        id: "616005cae3c8e880c13dc0b9",
        name: "Curry Place",
        description:
          "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
        image: "https://i.ibb.co/yftcRcF/indian.jpg",
      },
      {
        id: "616005e26d59890f8f1e619b",
        name: "Thai Isaan",
        description:
          "We offer guests a modern dining experience featuring the authentic taste of Thailand. Food is prepared fresh from quality ingredients and presented with sophisticated elegance in a stunning dining setting filled with all the richness of Thai colour, sound and art.",
        image: "https://i.ibb.co/HPjd2jR/thai.jpg",
      },
      {
        id: "616bd284bae351bc447ace5b",
        name: "Italian Feast",
        description:
          "From the Italian classics, to our one-of-a-kind delicious Italian favourites, all of our offerings are handcrafted from the finest, freshest ingredients available locally. Whether you're craving Italian comfort food like our Ravioli, Pappardelle or something with a little more Flavour like our famous Fettuccine Carbonara.",
        image: "https://i.ibb.co/0r7ywJg/italian.jpg",
      },
    ];

    await request(app)
      .get("/restaurants")
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(expected);
      });
  });

  test("GET / restaurants/:id display a single restaurant", async () => {
    const expected = {
      id: "616005cae3c8e880c13dc0b9",
      name: "Curry Place",
      description:
        "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
      image: "https://i.ibb.co/yftcRcF/indian.jpg",
    };

    await request(app)
      .get("/restaurants/616005cae3c8e880c13dc0b9")
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(expected);
      });
  });

  test("GET / restaurants/:id should respond with id provided is invalid", async () => {
    const expected = {
      
      "error": "invalid id provided",
    };

    await request(app)
      .get("/restaurants/256278927")
      .expect(400)
      .expect((response) => {
        expect(response.body).toEqual(expected);
      });
  });

  test("GET / restaurants/:id should respond with the restaurant trying to be retrieved does not exist", async () => {
    const expected = {
      error: "restaurant not found",
    };

    await request(app)
      .get("/restaurants/616005cae3c8e880c13dc0d8")
      .expect(404)
      .expect((response) => {
        expect(response.body).toEqual(expected);
      });
  });

  test("GET /reservations should respond with list of reservations", async () => {
    const expected = [
      {
        id: "507f1f77bcf86cd799439011",
        partySize: 4,
        date: "2023-11-17T06:30:00.000Z",
        userId: "mock-user-id",
        restaurantName: "Island Grill",
      },
      {
        id: "614abf0a93e8e80ace792ac6",
        partySize: 2,
        date: "2023-12-03T07:00:00.000Z",
        userId: "mock-user-id",
        restaurantName: "Green Curry",
      },
      
    ];

    await request(app)
      .get("/reservations")
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(expected);
      });
  });

  test("GET /reservations/:id should respond with a single reservation", async () => {
    const expected = {
      id: "507f1f77bcf86cd799439011",
      partySize: 4,
      date: "2023-11-17T06:30:00.000Z",
      userId: "mock-user-id",
      restaurantName: "Island Grill",
    };

    await request(app)
      .get("/reservations/507f1f77bcf86cd799439011")
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(expected);
      });
  });

  test("GET /reservations/:id should respond with id provided is invalid", async () => {
    const expected = {
      error: "invalid id provided",
    };

    await request(app)
      .get("/reservations/1aaaaa1111")
      .expect(400)
      .expect((response) => {
        expect(response.body).toEqual(expected);
      });
  });

  test("GET /reservations/:id should respond with Reservation does not exist with id paramete", async () => {
    const expected = {
        "error": "not found"
    };

    await request(app)
      .get("/reservations/507f1f77bcf86cd79943901a")
      .expect(404)
      .expect((response) => {
        expect(response.body).toEqual(expected);
      });
  });

  test("GET /reservations/:id should respond with user is trying to access a reservation they didf not create", async () =>{
const expected ={
    "error": "user does not have permission to access this reservation"
};
await request(app)
.get("/reservations/61679189b54f48aa6599a7fd ")
.expect(403)
.expect((response) => {
  expect(response.body).toEqual(expected);
});
  })
});
