function MapCanvas(SERVER_IP, TIME_DELAY, rotationSpeed, scaleOfDisplacement, startXYZ, radiusOfReloading){
    this.SERVER_IP = SERVER_IP;
    this.TIME_DELAY = TIME_DELAY;
    this.rotationSpeed = rotationSpeed;
    // scale = 1 - default value scale of translation
    // displacement = displacement * scale
    this.scale = scaleOfDisplacement;
    this.startXYZ = startXYZ;
    this.radiusOfReloading = radiusOfReloading;
    this.cameraControll = new THREE.Group();
    this.currentAngle = 0; 
    var currentDate = new Date();
    this.currentTimeMils = currentDate.getTime();
    this.rotationAngleZ = 0;
    this.Y_AXIS = new THREE.Vector3( 0, 1, 0 );
    //on mousedown
    this.xDwn = 0;
    this.yDwn = 0;
    //add initial center
    this.xyzCenter = this.startXYZ;
//map frame
  this.mapFrame = new MapFrame(this.xyzCenter, this.radiusOfReloading);
//add list of objects
  this.objectsListOnScene = new Array();
  this.customObjectsOnScene = new Array(); // This list contains those custom objects which were added.
//add raycaster
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  this.currentSpeed = 0;
  var url = SERVER_IP;
  this.scene = new THREE.Scene();
  this.W = parseInt(window.innerWidth);
  this.H = parseInt(window.innerHeight);
  this.camera = new THREE.PerspectiveCamera(45, this.W / this.H, 1, 10000);
  this.container = document.createElement('div');
  this.container.setAttribute("id", "div-canvas");
  this.render = new THREE.WebGLRenderer();
  this.effectListener = new EffectListener(); // Is intended to process custom object types.
}

function MapCanvas(SERVER_IP, TIME_DELAY, rotationSpeed, scaleOfDisplacement, startXYZ, radiusOfReloading, effectListener){
    this.SERVER_IP = SERVER_IP;
    this.TIME_DELAY = TIME_DELAY;
    this.rotationSpeed = rotationSpeed;
    // scale = 1 - default value scale of translation
    // displacement = displacement * scale
    this.scale = scaleOfDisplacement;
    this.startXYZ = startXYZ;
    this.radiusOfReloading = radiusOfReloading;
    this.cameraControll = new THREE.Group();
    this.currentAngle = 0; 
    var currentDate = new Date();
    this.currentTimeMils = currentDate.getTime();
    this.rotationAngleZ = 0;
    this.Y_AXIS = new THREE.Vector3( 0, 1, 0 );
    //on mousedown
    this.xDwn = 0;
    this.yDwn = 0;
    //add initial center
    this.xyzCenter = this.startXYZ;
//map frame
  this.mapFrame = new MapFrame(this.xyzCenter, this.radiusOfReloading);
//add list of objects
  this.objectsListOnScene = new Array();
  this.customObjectsOnScene = new Array(); // This list contains those custom objects which were added.
//add raycaster
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  this.currentSpeed = 0;
  var url = SERVER_IP;
  this.scene = new THREE.Scene();
  this.W = parseInt(window.innerWidth);
  this.H = parseInt(window.innerHeight);
  this.camera = new THREE.PerspectiveCamera(45, this.W / this.H, 1, 10000);
  this.container = document.createElement('div');
  this.container.setAttribute("id", "div-canvas");
  this.render = new THREE.WebGLRenderer();
  if (effectListener == null) {
	  this.effectListener = new EffectListener(); // The default version do nothing!
  } else {
	  this.effectListener = effectListener; // Is intended to process custom object types.
  }
}

MapCanvas.prototype.init = function() {

//z - axe direction is toward you from monitor = latitude
//x- to the right in plane of monitor  = longetude
//y - upright in plane of the monitor = height
  var SERVER_IP = this.SERVER_IP;
    this.prepareListeners();
    document.body.appendChild(this.container);

//TODO change hardcoded camera.position.z = 20; to the actual value
    this.camera.position.z = 0;//startXYZ.z;//20;
    this.cameraControll =  this.prepareCameraControll(this.camera);
    this.cameraControll.add(this.camera);//
    this.scene.add(this.cameraControll);//
    var light = new THREE.DirectionalLight( 0xafffff, 1 );
    var light1 = new THREE.DirectionalLight( 0xafffff, 1 );
    var light2 = new THREE.DirectionalLight( 0xafffff, 1 );
    var light3 = new THREE.DirectionalLight( 0xafffff, 1 );
            var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
            hemiLight.position.set( 0, 500, 0 );
            this.scene.add( hemiLight );
    light.position.set( 1, 1, 1 ).normalize();
    light1.position.set( 10, 10, -10 ).normalize();
    light2.position.set( 10, -10, -10 ).normalize();
    light3.position.set( 100, 100, 100 ).normalize();
    this.scene.add( light );
    this.scene.add( light1 );
    this.scene.add( light2 );
    this.scene.add( light3 );
    this.render.setSize(this.W, this.H);
    this.render.autoClear=false;
    this.container.appendChild(this.render.domElement);
    //TODO improve and turn on the following function
    //this.initDeviceOrientationListeners(this.cameraControll, scene);
    this.getObjectsListOnMap(this.startXYZ.x, this.startXYZ.z, this.startXYZ.y);
    this.animate();
}

MapCanvas.prototype.prepareListeners = function() {
    var objectMapCanvas = this;
    document.addEventListener('mousedown', function(event){
      objectMapCanvas.startTrack(event);
    });

    document.addEventListener('mouseup', function(event){
      objectMapCanvas.endTrack(event);
    });
    document.addEventListener('pointerdown', function(event){
      objectMapCanvas.startTrack(event);
    });
    document.addEventListener('pointerup', function(event){
      objectMapCanvas.endTrack(event);
    });
}
//current function return prepared camera controll
MapCanvas.prototype.prepareCameraControll = function(camera) {
    var textureLoader = new THREE.TextureLoader();
    var forwardSprite = textureLoader.load(this.SERVER_IP + "/map/sprite/forward");
    var backwardSprite = textureLoader.load(this.SERVER_IP + "/map/sprite/backward");
    var upwardSprite = textureLoader.load(this.SERVER_IP + "/map/sprite/upward");
    var downwardSprite = textureLoader.load(this.SERVER_IP + "/map/sprite/downward");
    var forwardMaterialSprite = new THREE.SpriteMaterial({
        map:forwardSprite, color : 0xffffff ,fog:true
    });
    var backwardMaterialSprite = new THREE.SpriteMaterial({
        map:backwardSprite, color : 0xffffff ,fog:true
    });
    var upwardMaterialSprite = new THREE.SpriteMaterial({
        map:upwardSprite, color : 0xffffff ,fog:true
    });
    var downwardMaterialSprite = new THREE.SpriteMaterial({
        map:downwardSprite, color : 0xffffff ,fog:true
    });
    var forwardSprite = new THREE.Sprite(forwardMaterialSprite);
    var backwardSprite = new THREE.Sprite(backwardMaterialSprite);
    var upwardSprite = new THREE.Sprite(upwardMaterialSprite);
    var downwardSprite = new THREE.Sprite(downwardMaterialSprite);
    forwardSprite.position.set(this.startXYZ.x + 0, this.startXYZ.y - 0.5, this.startXYZ.z + 0);// + 20 + 15);
    forwardSprite.name = 'forwardSprite';
    backwardSprite.position.set(this.startXYZ.x + 0, this.startXYZ.y - 1.5, this.startXYZ.z + 0);//20 + 15);
    backwardSprite.name = 'backwardSprite';
    upwardSprite.position.set(this.startXYZ.x + 3, this.startXYZ.y + 0, this.startXYZ.z + 0);// 20 +15);
    upwardSprite.name = 'upwardSprite';
    downwardSprite.position.set(this.startXYZ.x + 3, this.startXYZ.y - 1, this.startXYZ.z + 0);// 20 + 15);
    downwardSprite.name = 'downwardSprite';
    this.cameraControll.add(camera);//
    this.cameraControll.add(forwardSprite);//
    this.cameraControll.add(backwardSprite);//
    this.cameraControll.add(upwardSprite);//
    this.cameraControll.add(downwardSprite);//
    return this.cameraControll;//
}

MapCanvas.prototype.loadOBJ = function(name, z, x, y, fiY){
  var objectMapCanvas = this;
  var manager = new THREE.LoadingManager();
  var mtlLoader = new THREE.MTLLoader( manager );
  mtlLoader.load(this.SERVER_IP + '/map/material/' + name, function(materials){
        materials.preload();
       var loader = new THREE.OBJLoader( manager );
       loader.setMaterials(materials);
       loader.load(objectMapCanvas.SERVER_IP + '/map/object/' + name, function ( object ) {
           object.name = name + '_' + z + '_' + x;
           objectMapCanvas.scene.add( object );   
           selectedObject = objectMapCanvas.scene.getObjectByName(name + '_' + z + '_' + x);
           selectedObject.rotateOnAxis( objectMapCanvas.Y_AXIS, fiY );
           xyz = new XYZ(x, y, z);
           newXYZ = xyz.getRotatedCoordinates(fiY);
           selectedObject.translateZ(newXYZ.z);
           selectedObject.translateX(newXYZ.x);
           selectedObject.translateY(newXYZ.y);
//           objectMapCanvas.animate();     
       });
 });

};

//z - axe direction is toward you from monitor = latitude
//x- to the right in plane of monitor  = longetude
//y - upright in plane of the monitor = height
MapCanvas.prototype.loadSprite = function(name, latitude, longitude, hight) {
    textureLoader = new THREE.TextureLoader();
    //var forwardSprite = new THREE.Sprite(forwardMaterialSprite);
    currentSpriteTexture = textureLoader.load(this.SERVER_IP + '/map/sprite/' + name);
    currentMaterialSprite = new THREE.SpriteMaterial({
        map:currentSpriteTexture, color : 0xffffff ,fog:true
    });
    currentSprite = new THREE.Sprite(currentMaterialSprite);
    currentSprite.position.set(longitude, hight, latitude);
    currentSprite.name = name + '_' + latitude + '_' + longitude;
    this.scene.add(currentSprite);
//    this.animate();
}

/**
 * This method calls a defined effectListener to process custom object type.
 * See getObjectsListOnMap(...)
 */
MapCanvas.prototype.loadCustomObject = function(objectOnMap) {
	this.effectListener.process(objectOnMap, this);
}

MapCanvas.prototype. addSun = function(){
    // Sun
    var sun, sun_geom, sun_mat;
    sun_geom = new THREE.SphereGeometry(5, 5, 5);
    sun_mat = new THREE.MeshNormalMaterial();
    sun = new THREE.Mesh(sun_geom, sun_mat);
}

MapCanvas.prototype.animate = function() {
        var objectMapCanvas = this;
        requestAnimationFrame(function(){
          objectMapCanvas.animate();
        });
        this.render.render(this.scene, this.camera);
    }
// rotation listener

MapCanvas.prototype.initDeviceOrientationListeners = function(camera, scene){ // mapCanvas was added
      //Find our div containers in the DOM
      var objectMapCanvas = this;
      //Check for support for DeviceOrientation event
      if(window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
                var alpha = event.alpha;
                var beta = event.beta;
                var gamma = event.gamma;
               
              }, false);
      }
 
      // Check for support for DeviceMotion events
      if(window.Device,MotionEvent) {

      window.addEventListener('devicemotion', function(event) {
                var x = event.accelerationIncludingGravity.x;
                var y = event.accelerationIncludingGravity.y;
                var z = event.accelerationIncludingGravity.z;
                var r = event.rotationRate;
                objectMapCanvas.checkTimePass(x,y,z,camera,scene);
              });
      }
    }   
//when TIME_DELAY pass call rerender 
MapCanvas.prototype.checkTimePass = function(x,y,z,camera,scene) {
        //var Y_AXIS = new THREE.Vector3( 0, 1, 0 );
        var d = new Date();
        var n = d.getTime();
        this.calcRotationAngle(x,y,z);
        if(n - this.currentTimeMils > this.TIME_DELAY) {
            this.currentTimeMils = n;
            //dataContainerAngle.innerHTML = html;
            // rotate camera and set rotation angle to 0
            camera.rotateOnAxis( this.Y_AXIS, this.rotationAngleZ );
            //camera
            this.rotationAngleZ = 0;
            // lets translate camera
             // and after make translation = 0
            this.currentSpeed = 0;
            return true;
        }
        return false;
  }
MapCanvas.prototype.checkStartRotation = function(x,y,z) {
        if (x*x > 0.01 * (x*x + y*y + z*z)) {
            return true;
        }
        return false;
  }
MapCanvas.prototype.calcRotationAngle = function(x,y,z) {
        var d = new Date();
        var n = d.getTime();
        if (x > 0 && checkStartRotation(x,y,z) == true) {
            this.rotationAngleZ = this.rotationAngleZ + (n - this.currentTimeMils) * this.rotationSpeed;
            this.currentAngle = this.currentAngle + (n - this.currentTimeMils) * this.rotationSpeed;
        }
        if (x < 0 && checkStartRotation(x,y,z) == true) {
            this.rotationAngleZ = this.rotationAngleZ - (n - this.currentTimeMils) * this.rotationSpeed;
            this.currentAngle = this.currentAngle - (n - this.currentTimeMils) * this.rotationSpeed;
        }
        //let's calculate camera translation
        currentPosition = new XYZ(camera.position.x, camera.position.y, camera.position.z);
        if(this.mapFrame.checkToReload(currentPosition)) {
            this.getObjectsListOnMap(currentPosition.x, currentPosition.z, currentPosition.y);
            this.resetCenterPosition(this.cameraControll);//
        }
   }
MapCanvas.prototype.resetCenterPosition = function(cameraControll) {
            this.xyzCenter.x = cameraControll.position.x;//
            this.xyzCenter.y = cameraControll.position.y;//
            this.xyzCenter.z = cameraControll.position.z;//
  }
// calculate module of translation in current direction
MapCanvas.prototype.calcTranslation = function(aX) {
        var d = new Date();
        var n = d.getTime();
        var displacement = this.currentSpeed * (n - this.currentTimeMils) / 1000;
        this.currentSpeed = this.currentSpeed + aX * (n - this.currentTimeMils) / 1000;
	return displacement;
  }

/**
 * IE11 doesn't support array.includes().
 */
MapCanvas.prototype.contains = function (arr, val, comparator) {
	for (var i = 0; i < arr.length; i = i + 1) {
		if (comparator(arr[i], val)) {
			return true;
		}
	}
	return false;
}

MapCanvas.prototype.objectComparator = function (o1, o2) {
	if(o1.name == o2.name && o1.type == o2.type &&
   		 o1.latitude == o2.latitude &&
   		 o1.longitude == o2.longitude && o1.hight == o2.hight) { 
        return true;
    } else {
    	return false;
    }
}

MapCanvas.prototype.getObjectsListOnMap = function(longetude, lattitude, h) {
      var objectMapCanvas = this;
      //urlRequest = url + '/map/' + z + '/' + lattitude +'/' + longetude;
      urlRequest = this.SERVER_IP + '/map/' + h + '/' + lattitude +'/' + longetude;
      $.get(urlRequest, function(data, status){
          // get all appropriate objects to be placed on scene
          objectsList = new ObjectsList(data);
          //let's load objects from server
          objectNamesFromServer = new Array();
          customObjectList = new Array();
          for(var i=0; i< data.length; i = i + 1){
        	  if (data[i].type == 'SPRITE' || data[i].type == 'THREE_D_OBJECT') {
        		  objectNamesFromServer.push(data[i].name +'_' + data[i].latitude + '_' + data[i].longitude);
        	  } else {
        		  customObjectList.push(data[i]);// FORM LIST OF CUSTOM OBJECT LOADED FROM SERVER.
        	  }
          }
          while(data.length > 0){
              objectOnMap = objectsList.getObject();
              //check if the object has been already loaded
              if (objectMapCanvas.objectsListOnScene.includes(objectOnMap.name + '_' + objectOnMap.latitude + '_' + objectOnMap.longitude) == false){
            	  if (objectOnMap.type != 'SPRITE' && objectOnMap.type != 'THREE_D_OBJECT') {
            		  if (!objectMapCanvas.contains(objectMapCanvas.customObjectsOnScene, objectOnMap, objectMapCanvas.objectComparator)) {
	            		  objectMapCanvas.loadCustomObject(objectOnMap);
	            		  // Add custom objects to a list it was added yet!
	            		  objectMapCanvas.customObjectsOnScene.push(objectOnMap);
            		  }
            	  } else {
            		  if (objectOnMap.type =='SPRITE') {
	                      objectMapCanvas.loadSprite(objectOnMap.name, objectOnMap.latitude, objectOnMap.longitude, objectOnMap.hight);
	                  } else {
	                      objectMapCanvas.loadOBJ(objectOnMap.name, objectOnMap.latitude, objectOnMap.longitude, objectOnMap.hight, objectOnMap.alphaZ);
	                  }	                  
	                  // add loaded object to the list
	                  objectMapCanvas.objectsListOnScene.push(objectOnMap.name + '_' + objectOnMap.latitude + '_' + objectOnMap.longitude);
            	  }
              }
              
          }
          objectsToDelete = objectMapCanvas.getListToDelete(objectMapCanvas.objectsListOnScene, objectNamesFromServer);
          while(objectsToDelete.length > 0) {
              objectNameToBeDeleted = objectsToDelete.pop();
              objectToDelete = objectMapCanvas.scene.getObjectByName(objectNameToBeDeleted);
              //objectMapCanvas.objectMapCanvas.scene.remove( objectToDelete );
              objectMapCanvas.scene.remove( objectToDelete );
              //remove from objectsListOnScene objects to delete
              objectMapCanvas.removeByValue(objectMapCanvas.objectsListOnScene, objectNameToBeDeleted)
          }
          objectMapCanvas.removeCustomObjects(objectMapCanvas.customObjectsOnScene, customObjectList); // remove custom objects.
          //objectMapCanvas.animate();
      });
  }

 MapCanvas.prototype.removeCustomObjects = function (objectsOnScene, newObjects) {
	 objectsToDelete = new Array();
	 for(var i = 0; i < objectsOnScene.length; i = i + 1) {
		 exists = false;
		 for(var j = 0; j < newObjects.length; j = j + 1) {
			 if (this.objectComparator(objectsOnScene[i], newObjects[j])) {
                 exists = true;
             }
         }
		 if (exists == false) {
			 objectsToDelete.push(objectsOnScene[i]);
		 }
	 }
	 while(objectsToDelete.length > 0) {
         objectToBeDeleted = objectsToDelete.pop();
         this.effectListener.remove(objectToBeDeleted.name, objectToBeDeleted.type, objectToBeDeleted.latitude, objectToBeDeleted.longitude, objectToBeDeleted.hight, this);
         this.removeByValue(objectsOnScene, objectToBeDeleted); // Remove from income list.
     }
 }

 MapCanvas.prototype.getListToDelete = function(objectsOnScene, objectNamesFromServer) {
      objectsToDelete = new Array();
      for(var i = 0; i < objectsOnScene.length; i = i + 1) {
          exists = false;
          for(j = 0; j < objectNamesFromServer.length; j = j + 1) {
              if(objectsOnScene[i] == objectNamesFromServer[j]) { 
                  exists = true;
              }
          }
          if (exists == false) {objectsToDelete.push(objectsOnScene[i]);}
      }
      return objectsToDelete;
  }

MapCanvas.prototype.removeByValue = function(arr, val) {
      for( var i = 0; i < arr.length; i++){ 
          if ( arr[i] == val) {
              arr.splice(i, 1); 
          }
      }
  }

MapCanvas.prototype.checkForNavigationButtonPressed = function(x, y, wW, wH) {
      if (x/wW > 216 / 536 && x/wW < 338 / 536 && y/wH > 390 / 672 && y/wH < 483 / 672) {
          this.cameraControll.translateZ(-1 * this.scale);
          //animate();
      }
      if (x/wW > 216 / 536 && x/wW < 338 / 536 && y/wH > 520 / 672 && y/wH < 648 / 672) {
          this.cameraControll.translateZ(1 * this.scale);
          //animate();
      }
      if (x/wW > 400 / 536 && x/wW < 480 / 536 && y/wH > 290 / 672 && y/wH < 383 / 672) {
          if (this.validateHeight(1 * this.scale)) {
              this.cameraControll.translateY(1 * this.scale);
          }

          //animate();
      }
      if (x/wW > 400 / 536 && x/wW < 480 / 536 && y/wH > 400 / 672 && y/wH < 528 / 672) {
          if (this.validateHeight(-1 * this.scale)) {
              this.cameraControll.translateY(-1 * this.scale);
          }
          //animate();
      }
      //this.animate();
  }

MapCanvas.prototype.validateHeight = function(delta) {
      if(this.cameraControll.position.y + delta > 0) {
          return true;
      }
      return false;
  }

MapCanvas.prototype.startTrack = function(event) {
      this.checkForNavigationButtonPressed(event.clientX, event.clientY, this.W, this.H)
      this.xDwn = event.clientX;
      this.yDwn = event.clientY;
  }

MapCanvas.prototype.endTrack = function(event) {
      delta = (this.yDwn - event.clientY);
      delta = delta * this.scale / 100;
      angle = (this.xDwn - event.clientX) / 400;
//new version cameraControll
      this.cameraControll.rotateOnAxis( this.Y_AXIS, angle);
      this.cameraControll.translateZ(-delta);
      //animate();
      this.checkForReload();
  }
//TODO here we are checking for reloading and if ok move xyzCenter
MapCanvas.prototype.checkForReload = function(){
        //TODO check if it is a good practice to create a new object each time!!!!
        currentPosition = new XYZ(this.cameraControll.position.x, this.cameraControll.position.y, this.cameraControll.position.z);
        if(this.mapFrame.checkToReload(currentPosition)) {

            this.getObjectsListOnMap(currentPosition.x, currentPosition.z, currentPosition.y);
            this.resetCenterPosition(this.cameraControll);
        }        
        currentPosition = new XYZ(this.cameraControll.position.x, this.cameraControll.position.y, this.cameraControll.position.z);
}

MapCanvas.prototype.reloadLocatorPosition = function(x,z,alpha) {
            this.cameraControll.position.x = x;
            this.cameraControll.position.z = z;
            var ROTATION_AXIS = new THREE.Vector3( 0, 1, 0 );
            this.cameraControll.rotateOnAxis( ROTATION_AXIS, alpha);    
}



