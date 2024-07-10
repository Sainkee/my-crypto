const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.set("view engine", "ejs");
let selectedCoin = "bitcoin";

let allCoin = {};
let marketChart;
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  await getCoinData(selectedCoin);
  res.render("index", { allCoin, marketChart });
});

app.post("/", async (req, res) => {
  const selectSearchCoin = req.body.selectCoin;
  const inputSearchCoin = req.body.inputCoin;
  selectedCoin = inputSearchCoin ? inputSearchCoin : selectSearchCoin;
  console.log(selectedCoin);
  try {
    // Fetch data for selected coin
    await getCoinData(selectedCoin);

    res.render("index", { allCoin, marketChart }); // populated allCoin to the template
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

async function getCoinData(selectedCoin) {
  try {
    let url = `https://api.coingecko.com/api/v3/coins/${selectedCoin}`;

    const options = {
      method: "GET",
      headers: { "x-cg-demo-api-key": "CG-rs3HzMv4PKK3Eq6Vk883AKM9" },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    allCoin = data;

    if (selectedCoin) {
      const url = `https://api.coingecko.com/api/v3/coins/${selectedCoin}/market_chart?vs_currency=usd&days=10`;

      const options = {
        method: "GET",
        headers: { "x-cg-demo-api-key": "CG-rs3HzMv4PKK3Eq6Vk883AKM9" },
      };

      const response = await fetch(url, options);
      const data = await response.json();
      marketChart = data;
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}/`);
});
