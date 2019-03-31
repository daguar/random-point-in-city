var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
var fs = require('fs');

var tools = require('../js/tools')

describe('getRandomPointInMultiPolygon()', function() {
  it('should return a single point', function() {
    rawData = fs.readFileSync('./test/fixtures/oakland.geojson');
    geojson = JSON.parse(rawData);
    point = tools.getRandomPointInMultiPolygon(geojson);
    expect(point).to.be.a('array');
    expect(point.length).to.equal(2);
  });
});

