import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Facebook@1997",
  port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const data = await db.query("SELECT country_code from visited_countries");
  if(data.rows) {
      const country_data = data.rows;
      const countries = [];
      country_data.forEach((item) => {countries.push(item.country_code)});
      const total = countries.length;
      res.render("index.ejs", {
        total: total,
        countries: countries
      });
    } else {
      console.error("Error executing query", err.stack);
      res.status(404).send("Error executing query");
    }
  });

  app.post("/add", async (req, res) => {
    const countryName = req.body.country;
    const data = await db.query("SELECT country_code from countries WHERE country_name = $1", [countryName]);
    if(data.rows) {
      const countryCode = data.rows[0].country_code;
      await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [countryCode]);
    } else {
      console.error("Error executing query", err.stack);
      res.status(404).send("Error executing query");
    }
    res.redirect("/");
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
