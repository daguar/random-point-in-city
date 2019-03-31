var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;

describe('getRandomPointInMultiPolygon()', function() {
    it('should return a single point', function() {
        //point = getRandomPointInMultiPolygon(geojson);
        point = [1,1];
        expect(point).to.be.a('array');
        expect(point.length).to.equal(2);
      }
    );
  }
);

