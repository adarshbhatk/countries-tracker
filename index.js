import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "Facebook@1997",
    port: 5432
  });
  await db.connect();
  const data = await db.query("SELECT country_code from visited_countries");
  if(data.rows) {
      const country_data = data.rows;
      const countries = [];
      country_data.forEach((item) => {countries.push(item.country_code)});
      const total = countries.length;
      // console.log(total);
      // console.log(countries);
      await db.end();
      res.render("index.ejs", {
        total: total,
        countries: countries
      });
    } else {
      console.error("Error executing query", err.stack);
      await db.end();
      res.status(404).send("Error executing query");
    }
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
