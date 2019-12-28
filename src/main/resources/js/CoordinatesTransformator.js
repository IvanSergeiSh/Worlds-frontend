/**
 * Transformates longitude, height, latitude to XYZ object
*/
//z - axe direction is toward you from monitor = latitude
//x- to the right in plane of monitor  = longetude
//y - upright in plane of the monitor = height

function CoordinatesTransformator(point0, lat0, long0, kLatitude, kLongitude){
    this.point0 = point0;
    this.kLatitude = kLatitude;
    this.kLongitude = kLongitude;
    this.lat0 = lat0;
    this.long0 = long0;
  }

CoordinatesTransformator.prototype.calcXYZ = function(longitude, height, latitude) {
    xyz = new XYZ(this.point0.x + (longitude - this.long0) * this.kLongitude, height, this.point0.z + (latitude - this.lat0) * this.kLatitude);
    return xyz;
}


