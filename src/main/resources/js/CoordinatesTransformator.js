/**
 * Transformates longitude, height, latitude to XYZ object
*/
//z - axe direction is toward you from monitor = latitude
//x- to the right in plane of monitor  = longetude
//y - upright in plane of the monitor = height

function CoordinatesTransformator(point0, kLatitude, kLongitude){
    this.point0 = point0;
    this.kLatitude = kLatitude;
    this.kLongitude = kLongitude;
  }

CoordinatesTransformator.prototype.calcXYZ = function(longitude, height, latitude) {
    xyz = new XYZ(point0.x + longitude * this.kLongitude, height, point0.z + latitude * kLatitude);
}


