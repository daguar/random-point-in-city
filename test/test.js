var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;

var tools = require('../js/tools')

describe('getRandomPointInMultiPolygon()', function() {
    it('should return a single point', function() {
        geojson = 'fakefornow';
        point = tools.getRandomPointInMultiPolygon(geojson);
        //point = [1,1];
        expect(point).to.be.a('array');
        expect(point.length).to.equal(2);
      }
    );
  }
);

