/**
  * ObjectOnMap represent's object to be placed on map
*/
function ObjectOnMap (name, type, latitude, longitude, alphaX, alphaY, alphaZ){
    this.name = objName;
    this.type = type;
    this.latitude = latitude;
    this.longitude = longitude;
    this.alphaX = alphaX;
    this.alphaY = alphaY;
    this.alphaZ = alphaZ;
    
}
ObjectOnMap.prototype.getFullName = function() {
    return this.name + '_' + this.latitude + '_' + this.longitude;
}
