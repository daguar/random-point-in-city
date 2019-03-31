const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser');
const tools = require('./js/tools');
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.render('index'))

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
          console.log(response);
          polygonData = response;

          // get point
          point = tools.getRandomPointInMultiPolygon(response.data);

          // Redirect to point on google maps
          url = "https://www.google.com/maps/search/?api=1&query=" + point[1] + "," + point[0];
          res.redirect(url);
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
