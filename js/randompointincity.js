var nominatimData;
var polygonData;
const nominatimRequest = new XMLHttpRequest();
const polygonRequest = new XMLHttpRequest();

function doStuff() {
  cityName = document.getElementById("citytext").value;
  console.log(cityName);
  // TODO - deal with spaces in cityName
  const url="https://nominatim.openstreetmap.org/search?format=json&q=" + cityName;
  nominatimRequest.addEventListener("load", nominatimResponseHandler);
  nominatimRequest.open("GET", url);
  nominatimRequest.send();
}

function nominatimResponseHandler(response) {
  nominatimData = JSON.parse(response.target.responseText);
  // TODO - deal with 0 results, check 1 result
  osmIdOfFirstResult = nominatimData[0].osm_id;
  console.log(osmIdOfFirstResult);
  url = "http://polygons.openstreetmap.fr/get_geojson.py?id=" + osmIdOfFirstResult + "&params=0";
  // TODO - this dont work; polygon service blocks CORS, so probably have to do this on the SERVER SIIIIDEEEE
  polygonRequest.addEventListener("load", nominatimResponseHandler);
  polygonRequest.open("GET", url);
  polygonRequest.send();
}

function polygonResponseHandler(response) {
  polygonData = response;
  console.log(response);
}








