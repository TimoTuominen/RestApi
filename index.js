//Lisätään tarvittavat moduulit
var express = require("express");
var cors = require("cors");
var app = express();
app.use(cors());
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
var mongoose = require("mongoose");

// Tietokanta yhteyden osoite
const uri =
  "mongodb+srv://TimoTuominen:Salasana@cluster0.sp2jo.mongodb.net/sample_restaurants?retryWrites=true&w=majority";

// Luodaan yhteys
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Luodaan schema tietojen käsittelyä varten
const Restaurants = mongoose.model(
  "Restaurants",
  {
    address: { building: String, street: String, zipcode: Number },
    borough: String,
    cusine: String,
    name: String,
    restaurant_id: Number,
  },
  "restaurants"
);

// Luodaan myöhemmin lisättävä tietue
let NewRestaurant = new Restaurants({
  address: { building: "Omarakennus", street: "Omakatu", zipcode: 12345 },
  borough: "Manhattan",
  cusine: "American",
  name: "Timpan ravintola",
  restaurant_id: 12345678,
});

// Haetaan tiedot tietokannasta, näytetään 15 ensimmäistä
app.get("/api/restaurant", function (req, res) {
  Restaurants.find({}, null, { limit: 15 }, function (err, results) {
    if (err) {
      res.status(500).json("Ongelma tietoja haettaessa");
    } else {
      res.status(200).json(results);
    }
  });
});

// Haetaan tiedot annetun ID:n mukaan
app.get("/api/restaurant/findbyid/:id", function (req, res) {
  var id = req.params.id;
  Restaurants.findById(id, function (err, results) {
    if (err) {
      res.status(500).json("Ongelma tietoja haettaessa");
    } else {
      res.status(200).json(results);
    }
  });
});

// Haetaan tietoja ruokaravintolan tyypin mukaan, näytettään 15 ensimmäistä
app.get("/api/restaurant/findbycuisine", function (req, res) {
  Restaurants.find(
    { cuisine: "American" },
    null,
    { limit: 15 },
    function (err, results) {
      if (err) {
        res.status(500).json("Ongelma tietoja haettaessa");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Lisätään uusi tietue kantaan
app.post("/api/restaurant/add", function (req, res) {
  NewRestaurant.save(function (err, user) {
    if (err) {
      res.status(500).json("Ongelma tietoja lisättäessä");
    } else {
      res.status(200).json(NewRestaurant);
    }
  });
});

// Päivitetään olemassa oleva tietue annetun ID:n mukaan
app.put("/api/restaurant/update/:id", function (req, res) {
  var query = { _id: req.params.id };
  var newdata = { restaurant_id: 123456 };
  var options = { new: true };
  Restaurants.findOneAndUpdate(
    query,
    newdata,
    options,
    function (err, results) {
      if (err) {
        res.status(500).json("Ongelma tietoja päivitettäessä");
      } else if (results == null) {
        Restaurants.status(200).json("Päivitettävää tietoa ei löytynyt");
      } else {
        res.status(200).json("Tiedot päivitetty!");
      }
    }
  );
});

// Poistetaan tietue annetun ID:n mukaan
app.delete("/api/restaurant/delete/:id", function (req, res) {
  var id = req.params.id;
  Restaurants.findByIdAndDelete(id, function (err, results) {
    if (err) {
      res.status(500).json("Tiedon poisto ei onnistunut");
    } else if (results == null) {
      Restaurants.status(200).json("Poistettavaa tietoa ei löytynyt");
    } else {
      console.log(results);
      res.status(200).json("Poistettiin " + id);
    }
  });
});

// Luodaan palvelin
var PORT = process.env.PORT || 8000;
app.listen(PORT, function () {
  console.log("Example app is listening on port %d", PORT);
});
