const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser');
const tools = require('./js/tools');
const app = express()
const port = process.env.PORT || 3000;
const ga_key = process.env.GA_KEY || '';

// Config for OnWater API key
require('dotenv').config();
const onwater_api_key = process.env.ONWATER_API_KEY || '';

app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.render('index', { ga_key: ga_key }))

async function findNonWaterPointUrl(polygon, attemptNumber) {
  const maxAttempts = 10;
  // Get point
  var point = tools.getRandomPointInMultiPolygon(polygon);
  // Issue request to check whether in water
  var onWaterUrl = "https://api.onwater.io/api/v1/results/" + point[1] + "," + point[0] + "?access_token=" + onwater_api_key;
  console.log("trying water API attempt # " + attemptNumber);
  console.log(onWaterUrl);

  var response = await axios.get(onWaterUrl)
  var onWater = response.data.water;
  console.log('onWater result: ' + onWater);

  // If on LAND, redirect to that awesome point
  if(onWater === false) {
    return "https://www.google.com/maps/search/?api=1&query=" + point[1] + "," + point[0];
  } else if(attemptNumber < maxAttempts) {
    // If onWater is true AND if < max attempts, try again
    return findNonWaterPointUrl(polygon, attemptNumber + 1);
  } else {
    // If onWater is true AND = max attempts, redirect to water-y grave (message)
    return null;
  }
};

app.post('/random_point', async function(req, res) {
  var cityName = req.body.city;
  console.log(cityName);

  // Issue request for osm ID from nominatim
  var nominatimUrl="https://nominatim.openstreetmap.org/search?format=json&q=" + encodeURIComponent(cityName);

  try {
    var response = await axios.get(nominatimUrl);

    // TODO - deal with 0 results, check 1 result
    var osmId = response.data[0].osm_id;
    console.log(osmId.toString());

    // Issue request for polygon
    var polygonUrl = "http://polygons.openstreetmap.fr/get_geojson.py?id=" + osmId + "&params=0";

    try {
      response = await axios.get(polygonUrl)

      var returnedPolygon = response.data;

      try {
        var url = await findNonWaterPointUrl(returnedPolygon, 1);
        if (url) {
          res.redirect(url);
        } else {
          res.send('ERROR in robot voice (maybe this is mostly water?)');
        }
      } catch (error) {
        console.log(error);
        res.send('ERROR in robot voice (onwater api):');
      }
    } catch(error) {
      console.log(error);
      res.send('ERROR in robot voice (polygon request)');
    }
  } catch(error) {
    console.log(error);
    res.send('ERROR in robot voice (nominatim request)');
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
