/**
 * Stores parametors to check if it's time to reload scene 
 * x,z axes lies in horizontal plate
*/
//z - axe direction is toward you from monitor = latitude
//x- to the right in plane of monitor  = longetude
//y - upright in plane of the monitor = height
//centerXYZ - latitude, longetude of initial point

function LocationWatcher(mapCanvas, radiusOfReloading, centerXYZ){
    this.centerXYZ = centerXYZ;
    this.radiusOfReloading = radiusOfReloading;
    this.mapCanvas = mapCanvas;
    this.transformator = new CoordinatesTransformator(new XYZ(-10,1,-1), centerXYZ.z, centerXYZ.x, 10000, 10000);
    this.angleDirection = 0.0; // angle arount Oz - axis
}
LocationWatcher.prototype.checkPosition = function(position) {
    x = this.centerXYZ.x;
    z = this.centerXYZ.z;
    r = this.radiusOfReloading;
    if ((x - position.coords.longitude) * (x - position.coords.longitude) 
    + (z - position.coords.latitude) * (z - position.coords.latitude) >
       r * r) {
        this.centerXYZ.x = position.coords.longitude;
        this.centerXYZ.z = position.coords.latitude;
        //transformator
        xyz = this.transformator.calcXYZ(position.coords.longitude, 1, position.coords.latitude);
        this.mapCanvas.reloadLocatorPosition(xyz.x,xyz.z, this.getAngle(position));
    }
}

LocationWatcher.prototype.getAngle = function(position) {
  longitude = position.coords.longitude - this.centerXYZ.x;
  latitude  = position.coords.latitude - this.centerXYZ.z;
  if (longitude==0 && latitude==0) {
    return 0;
  }
  angleAsin = Math.asin(longitude/Math.sqrt(longitude*longitude + latitude * latitude));
  angleAcos = Math.acos(latitude/Math.sqrt(longitude*longitude + latitude * latitude));
  if (angleAsin >= 0 && angleAcos >= 0) {
      return angleAcos;
  }
  if (angleAsin >= 0 && angleAcos < 0) {
      return angleAcos;
  }
  if (angleAsin < 0 && angleAcos >= 0) {
      return angleAsin;
  }
  if (angleAsin < 0 && angleAcos < 0) {
      return angleAcos + 3.14;
  }
}
