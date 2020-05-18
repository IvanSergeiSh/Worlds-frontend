/**
 * This class should provide custom object type processing, 
 * fore example it could be: sound, may be video or some animations.
 * Please override method process = function (name, type, mapCanvas)
 * to provide additional functionality.
 */
function EffectListener () {
	
}

/**
 * Override this function to provide support of your own custom object processors.
 * This method is called by MapCanvas during the processing 
 * of a list of object locations if object type is not 
 * either SPRITE or THREE_D_OBJECT
 * See MapCanvas.getObjectsListOnMap when it calls loadCustomObject(...)
 * 
 * MapCanvas.customObjectsOnScene - contains a list of custom objects which were already added to a scene,
 * incoming object will be added to the list after execution of this function.
 */
EffectListener.prototype.process = function (name, type, latitude, longitude, hight, mapCanvas) {
	// Override this method.
	message = "name: " + name + ", type: " + type;
	console.log(message);
}

/**
 * This method is intended to remove an object of a custom type from a scene or from anywhere.
 * 
 * MapCanvas.customObjectsOnScene - contains a list of custom objects which exists on a scene,
 * after call of this function an object will be removed from the list.
 */
EffectListener.prototype.remove = function (name, type, latitude, longitude, hight, mapCanvas) {
	// Override this method.
	message = "remove objet( name: " + name + ", type: " + type + " )";
	console.log(message);
}