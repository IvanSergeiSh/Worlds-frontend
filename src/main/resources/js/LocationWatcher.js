/**
 * Stores parametors to check if it's time to reload scene 
 * x,z axes lies in horizontal plate
*/
//z - axe direction is toward you from monitor = latitude
//x- to the right in plane of monitor  = longetude
//y - upright in plane of the monitor = height

function LocationWatcher(mapCanvas, radiusOfReloading, centerXYZ){
    this.centerXYZ = centerXYZ;
    this.radiusOfReloading = radiusOfReloading;
    this.mapCanvas = mapCanvas;
    this.transformator = new CoordinatesTransformator(new XYZ(-10,1,-1), centerXYZ.z, centerXYZ.x, 10000, 10000);
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
        this.mapCanvas.reloadLocatorPosition(xyz.x,xyz.z);
    }
}
