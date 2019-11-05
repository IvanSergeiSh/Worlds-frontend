function ObjectsList(objectsList) {
    //  Array of objects to be situated on map
    this.objectsList = objectsList;
}

ObjectsList.prototype.addObject = function(obj) {
    this.objectsList.push(obj);
}

ObjectsList.prototype.getObject = function() {
    return this.objectsList.pop();
}
