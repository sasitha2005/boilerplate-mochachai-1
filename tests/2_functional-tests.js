const chai = require("chai");
const assert = chai.assert;

const server = require("../server");

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

suite("Functional Tests", function () {
  this.timeout(5000);
  suite("Integration tests with chai-http", function () {
    // #1
    test("Test GET /hello with no name", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/hello")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "hello Guest");
          done();
        });
    });
    // #2
    test("Test GET /hello with your name", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/hello?name=Jake")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "hello Jake");
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/travellers")
        .send({ surname: "Colombo" })
        .end(function (err, res) {
          assert.equal(res.status, 200, "The status should be 200");
          assert.equal(
            res.type,
            "application/json",
            "The type should be application/json"
          );
          assert.equal(
            res.body.name,
            "Cristoforo",
            "The body.name should be Cristoforo"
          );
          assert.equal(
            res.body.surname,
            "Colombo",
            "The body.surname should be Colombo"
          );
          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/travellers")
        .send({ surname: "da Verrazzano" })
        .end(function (err, res) {
          assert.equal(res.status, 200, "The status should be 200");
          assert.equal(
            res.type,
            "application/json",
            "The type should be application/json"
          );
          assert.equal(res.body.name, "Giovanni");
          assert.equal(
            res.body.surname,
            "da Verrazzano",
            "The body.surname should be da Verrazzano"
          );
          done();
        });
    });
  });
});

const Browser = require("zombie");
Browser.site = "https://testing-with-chai.onrender.com";
const browser = new Browser();

suite("Functional Tests with Zombie.js", function () {
  this.timeout(10000);

  suiteSetup(function (done) {
    return browser.visit("/", done);
  });

  suite("Headless browser", function () {
    test('should have a working "site" property', function () {
      assert.isNotNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    // #5
    test('Submit the surname "Colombo" in the HTML form', function (done) {
      browser.fill("surname", "Colombo").then(() => {
        browser.pressButton("submit", () => {
          browser.assert.success();
          browser.assert.text("span#name", "Cristoforo");
          browser.assert.text("span#surname", "Colombo");
          browser.assert.elements("span#dates", 1);
          done();
        });
      });
    });
    // #6
    test('Submit the surname "Vespucci" in the HTML form', function (done) {
      browser.fill("surname", "Vespucci").then(() => {
        browser.pressButton("submit", () => {
          browser.assert.success();
          browser.assert.text(
            "span#name",
            "Amerigo",
            "Assert that the text inside the element span#name is 'Amerigo'"
          );
          browser.assert.text(
            "span#surname",
            "Vespucci",
            "Assert that the text inside the element span#surname is 'Vespucci'"
          );
          browser.assert.elements(
            "span#dates",
            1,
            "Assert that the element(s) span#dates exist and their count is 1"
          );
          done();
        });
      });
    });
  });
