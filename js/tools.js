var turf = require('@turf/turf');

module.exports = {
  getRandomPointInMultiPolygon: getRandomPointInMultiPolygon
}

function getRandomPointInMultiPolygon(multipolygon) {
  boundingBox = turf.bbox(multipolygon);
  x_min = boundingBox[0];
  y_min = boundingBox[1];
  x_max = boundingBox[2];
  y_max = boundingBox[3];

  lat = y_min + (Math.random() * (y_max - y_min));
  lng = x_min + (Math.random() * (x_max - x_min));

  point = turf.point([lng, lat]);
  inside = turf.inside(point, multipolygon.geometries[0]);

  if(inside === true) {
    return point.geometry.coordinates;
  }
  else {
    return getRandomPointInMultiPolygon(multipolygon);
  }
}

