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

app.post('/random_point', function(req, res) {
  var nominatimData;
  var polygonData;
  var osmId;

  cityName = req.body.city;
  console.log(cityName);

  // Issue request for osm ID from nominatim
  nominatimUrl="https://nominatim.openstreetmap.org/search?format=json&q=" + encodeURIComponent(cityName);

  axios.get(nominatimUrl)
    .then(response => {
      // TODO - deal with 0 results, check 1 result
      osmId = response.data[0].osm_id;
      console.log(osmId.toString());

      // Issue request for polygon
      polygonUrl = "http://polygons.openstreetmap.fr/get_geojson.py?id=" + osmId + "&params=0";
      axios.get(polygonUrl)
        .then(response => {
          returnedPolygon = response.data;

          function findNonWaterPointAndRedirect(polygon, attemptNumber) {
            maxAttempts = 10;
            // Get point
            point = tools.getRandomPointInMultiPolygon(polygon);
            // Issue request to check whether in water
            onWaterUrl = "https://api.onwater.io/api/v1/results/" + lat + "," + lng + "?access_token=" + onwater_api_key;
            console.log("trying water API attempt # " + attemptNumber);
            console.log(onWaterUrl);

            axios.get(onWaterUrl)
              .then(response => {
                onWater = response.data.water;
                console.log('onWater result: ' + onWater);

                // If on LAND, redirect to that awesome point
                if(onWater === false) {
                  url = "https://www.google.com/maps/search/?api=1&query=" + point[1] + "," + point[0];
                  res.redirect(url);
                } else {
                  // If onWater is true AND if < max attempts, try again
                  if(attemptNumber < maxAttempts) {
                    nextAttempt = attemptNumber + 1;
                    findNonWaterPointAndRedirect(polygon, nextAttempt);
                  }
                  // If onWater is true AND = max attempts, redirect to water-y grave (message)
                  else {
                    res.send('ERROR in robot voice (maybe this is mostly water?)');
                  }
                }
              })
              .catch(error => {
                console.log('ERROR in robot voice (onwater api):');
                console.log(error);
              });
          };
          findNonWaterPointAndRedirect(returnedPolygon, 1);
        })
        .catch(error => {
          console.log(error);
          res.send('ERROR in robot voice (polygon request)');
        })

    })
    .catch(error => {
      console.log(error);
      res.send('ERROR in robot voice (nominatim request)');
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
