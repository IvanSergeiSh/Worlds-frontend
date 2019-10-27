/**
 * Tracks current player's position
*/

function XYZ(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
  }

// Calculates current position after step of length stepLength in direction vx, vy, vz

XYZ.prototype.step = function(vx, vy, vz, stepLength) {
    this.x = this.x + vx * stepLength;
    this.y = this.y + vy * stepLength;
    this.z = this.z + vz * stepLength;    
}

XYZ.prototype.getRotatedCoordinates = function(fi) {
    newXYZ = new XYZ(this.x * Math.cos(fi) + this.y * Math.sin(fi), -this.x * Math.sin(fi) + this.y * Math.cos(fi), this.z);
    return newXYZ;
}
XYZ.prototype.getRotatedX = function(fi) {
    return this.x * Math.cos(fi) + this.y * Math.sin(fi);
}

XYZ.prototype.getRotatedY = function(fi) {
    return -this.x * Math.sin(fi) + this.y * Math.cos(fi);
}

