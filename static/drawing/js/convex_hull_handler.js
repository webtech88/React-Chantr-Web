// JavaScript Document
function calculateConvexHull(pointsToFindConvexHullOf) {
  var convexHull = GeometryHelper.convexHullOfPoints(pointsToFindConvexHullOf);
  return convexHull;
}
// extensions
function ArrayExtensions() {
  // extension class
} {
  Array.prototype.contains = function(item) {
    return (this.indexOf(item) != -1);
  }
  Array.prototype.insert = function(itemToInsert, indexToInsertAt) {
    this.splice(indexToInsertAt, 0, itemToInsert);
  }
}
// classes
function Coords(x, y) {
  this.x = x;
  this.y = y;
} {
  Coords.prototype.add = function(other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }
  Coords.prototype.angleInCycles = function() {
    var returnValue = Math.atan2(this.y, this.x) / (2 * Math.PI);
    if (returnValue < 0) {
      returnValue += 1;
    }
    return returnValue;
  }
  Coords.prototype.clone = function() {
    return new Coords(this.x, this.y);
  }
  Coords.prototype.dotProduct = function(other) {
    return this.x * other.x + this.y * other.y;
  }
  Coords.prototype.floor = function() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }
  Coords.prototype.magnitude = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  Coords.prototype.multiply = function(other) {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }
  Coords.prototype.overwriteWith = function(other) {
    this.x = other.x;
    this.y = other.y;
    return this;
  }
  Coords.prototype.randomize = function() {
    this.x = Math.random();
    this.y = Math.random();
    return this;
  }
  Coords.prototype.subtract = function(other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }
  Coords.prototype.toString = function() {
    return ("" + this.x + "," + this.y);
  }
}

function GeometryHelper() {
  // static class
} {
  GeometryHelper.convexHullOfPoints = function(points) {
    var numberOfPoints = points.length;
    var pointsSorted = GeometryHelper.sortPoints(points);
    var pointOnHull = pointsSorted[0];
    var pointsOnHull = [pointOnHull];
    var displacement = new Coords();
    var angleAbsolutePrev = 0;
    while (pointOnHull != pointsOnHull[0] || pointsOnHull.length == 1) {
      var minAngleRelativeSoFar = Number.POSITIVE_INFINITY;
      var pointWithMinAngleRelativeSoFar = null;
      for (var i = 0; i < numberOfPoints; i++) {
        var pointCandidate = points[i];
        displacement.overwriteWith(pointCandidate).subtract(pointOnHull);
        var distanceFromPointOnHullToCandidate = displacement.magnitude();
        if (distanceFromPointOnHullToCandidate != 0) {
          var angleAbsolute = displacement.angleInCycles();
          var angleRelativeToHullEdge = angleAbsolute - angleAbsolutePrev;
          if (angleRelativeToHullEdge < 0) {
            angleRelativeToHullEdge += 1;
          }
          if (angleRelativeToHullEdge <= minAngleRelativeSoFar) {
            if (angleRelativeToHullEdge == minAngleRelativeSoFar) {
              // collinear points; use closest
              var distancePrev = displacement.overwriteWith(pointWithMinAngleRelativeSoFar).subtract(pointOnHull).magnitude();
              if (distanceFromPointOnHullToCandidate < distancePrev) {
                minAngleRelativeSoFar = angleRelativeToHullEdge;
                pointWithMinAngleRelativeSoFar = pointCandidate;
              }
            }
            else {
              minAngleRelativeSoFar = angleRelativeToHullEdge;
              pointWithMinAngleRelativeSoFar = pointCandidate;
            }
          } // end if (angle < minSoFar)
        } // end if (distanceFromPointOnHullToCandidate != 0)
      } // end for (each candidate point)
      pointOnHull = pointWithMinAngleRelativeSoFar;
      pointsOnHull.push(pointOnHull);
      angleAbsolutePrev += minAngleRelativeSoFar;
    }
    return pointsOnHull;
  }
  GeometryHelper.sortPoints = function(pointsToSort) {
    var pointsSorted = [];
    for (var i = 0; i < pointsToSort.length; i++) {
      var pointToSort = pointsToSort[i];
      var j;
      for (j = 0; j < pointsSorted.length; j++) {
        var pointSorted = pointsSorted[j];
        if (pointToSort.y <= pointSorted.y) {
          if (pointToSort.y == pointSorted.y) {
            if (pointToSort.x < pointSorted.x) {
              break;
            }
          }
          else {
            break;
          }
        }
      }
      pointsSorted.insert(pointToSort, j);
    }
    return pointsSorted;
  }
}
