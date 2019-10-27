/**
 * Stores parametors to check if it's time to reload scene 
 * x,z axes lies in horizontal plate
*/

function MapFrame(xyz, r){
    this.center = xyz;
    this.r = r;
}
MapFrame.prototype.checkToReload = function(xyz) {
    if ((this.center.x - xyz.x) * (this.center.x - xyz.x) + (this.center.z - xyz.z) * (this.center.z - xyz.z) > this.r * this.r) {
        return true;
    }
    return false;
}

