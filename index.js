var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
var mongoose = require("mongoose");

const uri =
  "mongodb+srv://TimoTuominen:Salasana@cluster0.sp2jo.mongodb.net/sample_restaurants?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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

let NewRestaurant = new Restaurants({
  address: { building: "Omarakennus", street: "Omakatu", zipcode: 12345 },
  borough: "Manhattan",
  cusine: "American",
  name: "Timpan ravintola",
  restaurant_id: 123456,
});

/*
 {
    title: String,
    year: Number,
    poster: String,
  },

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://TimoTuominen:<password>@cluster0.sp2jo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/

app.get("/api/restaurant", function (req, res) {
  Restaurants.find({}, null, { limit: 15 }, function (err, results) {
    if (err) {
      res.status(500).json("Ongelma tietoja haettaessa");
    } else {
      res.status(200).json(results);
    }
  });
});

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

app.post("/api/restaurant/add", function (req, res) {
  NewRestaurant.save(function (err, user) {
    if (err) {
      res.status(500).json("Ongelma tietoja lisättäessä");
    } else {
      res.status(200).json(NewRestaurant);
    }
  });
});
app.put("/api/restaurant/update/:id", function (req, res) {
  Restaurants.find({}, null, { limit: 15 }, function (err, results) {
    if (err) {
      res.status(500).json("Ongelma tietoja haettaessa");
    } else {
      res.status(200).json(results);
    }
  });
});
app.delete("/api/restaurant/delete/:id", function (req, res) {
  var id = req.params.id;
  Restaurants.findByIdAndDelete(id, function (err, results) {
    if (err) {
      res.status(500).json("Tiedon poisto ei onnistunut");
    } else if (results == null) {
      Restaurants.status(200).json("Poistettavaa tietoa ei löytynyt");
    } else {
      console.log(results);
      res.status(200).json("Poistettiin " + id + " " + results.title);
    }
  });
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Example app is listening on port %d", PORT);
});
