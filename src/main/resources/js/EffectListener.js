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
 */
EffectListener.prototype.process = function (name, type, mapCanvas) {
	// Override this method.
	message = "name: " + name + ", type: " + type;
	console.log(message);
}