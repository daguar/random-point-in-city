var turf = require('@turf/turf');

module.exports = {
  getRandomPointInMultiPolygon: getRandomPointInMultiPolygon
}

function getRandomPointInMultiPolygon(multipolygon) {
  var boundingBox = turf.bbox(multipolygon);
  var x_min = boundingBox[0];
  var y_min = boundingBox[1];
  var x_max = boundingBox[2];
  var y_max = boundingBox[3];

  var lat = y_min + (Math.random() * (y_max - y_min));
  var lng = x_min + (Math.random() * (x_max - x_min));

  var point = turf.point([lng, lat]);
  var inside = turf.inside(point, multipolygon.geometries[0]);

  if(inside === true) {
    return point.geometry.coordinates;
  }
  else {
    return getRandomPointInMultiPolygon(multipolygon);
  }
}
