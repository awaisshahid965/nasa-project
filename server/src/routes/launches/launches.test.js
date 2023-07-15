const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    setTimeout(async () => {
      await mongoDisconnect();
    }, 900);
  });

  describe("Test GET /launches", () => {
    test("should respond with 200 success", async () => {
      const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /launches", () => {
    const launchDataWithoutDate = {
      mission: "Test Launch",
      rocket: "Explorer 101",
      target: "Kepler-1652 b",
    };
    const completeLaunchData = {
      launchDate: "January 27, 2030",
      ...launchDataWithoutDate,
    };
    test("should respond with 201 success", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);
      expect(response.body).toMatchObject({
        ...launchDataWithoutDate,
        launchDate: new Date(completeLaunchData.launchDate).toISOString(),
      });
    });

    test("should catch missing required property", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    test("should catch invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send({
          ...launchDataWithoutDate,
          launchDate: "zoot",
        })
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
