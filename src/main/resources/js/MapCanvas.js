function MapCanvas(SERVER_IP, TIME_DELAY, rotationSpeed, scaleOfDisplacement, startXYZ, radiusOfReloading){
    this.SERVER_IP = SERVER_IP;
    this.TIME_DELAY = TIME_DELAY;
    this.rotationSpeed = rotationSpeed;
    // scale = 1 - default value scale of translation
    // displacement = displacement * scale
    this.scale = scaleOfDisplacement;
    this.startXYZ = startXYZ;
    this.radiusOfReloading = radiusOfReloading;
}
MapCanvas.prototype.init = function() {

//z - axe direction is toward you from monitor = latitude
//x- to the right in plane of monitor  = longetude
//y - upright in plane of the monitor = height
  var SERVER_IP = this.SERVER_IP;
  var currentDate = new Date();
  var currentTimeMils = currentDate.getTime();
  var TIME_DELAY = TIME_DELAY;
  var rotationAngleZ = 0;
  var rotationSpeed = this.rotationSpeed;
  var startXYZ = this.startXYZ;
  var radiusOfReloading = this.radiusOfReloading;
  var scale = this.scale;
  var currentAngle = 0;
  var Y_AXIS = new THREE.Vector3( 0, 1, 0 );
  //add group camera + controll
  var cameraControll = new THREE.Group();
  //on mousedown
  var xDwn = 0;
  var yDwn = 0;
//add initial center
  var xyzCenter = this.startXYZ;
//map frame
  var mapFrame = new MapFrame(xyzCenter, this.radiusOfReloading);
//add list of objects
  var objectsListOnScene = new Array();
//add raycaster
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  var currentSpeed = 0;
  var url = SERVER_IP;
    document.addEventListener('mousedown', startTrack);
    document.addEventListener('mouseup', endTrack);
    document.addEventListener('pointerdown', startTrack);
    document.addEventListener('pointerup', endTrack);
    var scene, camera, render, container, W, H;

    W = parseInt(window.innerWidth);
    H = parseInt(window.innerHeight);

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, W / H, 1, 10000);
    camera.position.z = 20;
    var cameraControll =  prepareCameraControll(camera);
    cameraControll.add(camera);
    scene = new THREE.Scene();
    scene.add(cameraControll);
    var light = new THREE.DirectionalLight( 0xafffff, 1 );
    var light1 = new THREE.DirectionalLight( 0xafffff, 1 );
    var light2 = new THREE.DirectionalLight( 0xafffff, 1 );
    var light3 = new THREE.DirectionalLight( 0xafffff, 1 );
    var hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 1 ); 
    light.position.set( 1, 1, 1 ).normalize();
    light1.position.set( 10, 10, -10 ).normalize();
    light2.position.set( 10, -10, -10 ).normalize();
    light3.position.set( 100, 100, 100 ).normalize();
    scene.add( light );
    scene.add( light1 );
    scene.add( light2 );
    scene.add( light3 );
    var render = new THREE.WebGLRenderer();
    render.setSize(W, H);
    render.autoClear=false;
    container.appendChild(render.domElement);
    init(cameraControll, scene);
    getObjectsListOnMap(this.startXYZ.x, this.startXYZ.z, this.startXYZ.y);
    animate();

//current function return prepared camera controll
function prepareCameraControll(camera) {
    var textureLoader = new THREE.TextureLoader();
    var forwardSprite = textureLoader.load(SERVER_IP + "/map/sprite/forward");
    var backwardSprite = textureLoader.load(SERVER_IP + "/map/sprite/backward");
    var upwardSprite = textureLoader.load(SERVER_IP + "/map/sprite/upward");
    var downwardSprite = textureLoader.load(SERVER_IP + "/map/sprite/downward");
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
    forwardSprite.position.set(startXYZ.x + 0, startXYZ.y - 0.5, startXYZ.z + 15);
    forwardSprite.name = 'forwardSprite';
    backwardSprite.position.set(startXYZ.x + 0, startXYZ.y - 1.5, startXYZ.z + 15);
    backwardSprite.name = 'backwardSprite';
    upwardSprite.position.set(startXYZ.x + 3, startXYZ.y + 0, startXYZ.z + 15);
    upwardSprite.name = 'upwardSprite';
    downwardSprite.position.set(startXYZ.x + 3, startXYZ.y - 1, startXYZ.z + 15);
    downwardSprite.name = 'downwardSprite';
    cameraControll.add(camera);
    cameraControll.add(forwardSprite);
    cameraControll.add(backwardSprite);
    cameraControll.add(upwardSprite);
    cameraControll.add(downwardSprite);
    return cameraControll;
}

function loadOBJ(name, z, x, y, fiY){
  var manager = new THREE.LoadingManager();
  var mtlLoader = new THREE.MTLLoader( manager );
  mtlLoader.load(SERVER_IP + '/map/material/' + name, function(materials){
        materials.preload();
       var loader = new THREE.OBJLoader( manager );
       loader.setMaterials(materials);
       loader.load(SERVER_IP + '/map/object/' + name, function ( object ) {
           object.name = name + '_' + z + '_' + x;
           scene.add( object );   
           selectedObject = scene.getObjectByName(name + '_' + z + '_' + x);
           selectedObject.rotateOnAxis( Y_AXIS, fiY );
           xyz = new XYZ(x, y, z);
           newXYZ = xyz.getRotatedCoordinates(fiY);
           selectedObject.translateZ(newXYZ.z);
           selectedObject.translateX(newXYZ.x);
           selectedObject.translateY(newXYZ.y);
           animate();     
       });
 });

};

function addSun(){
    // Sun
    var sun, sun_geom, sun_mat;
    sun_geom = new THREE.SphereGeometry(5, 5, 5);
    sun_mat = new THREE.MeshNormalMaterial();
    sun = new THREE.Mesh(sun_geom, sun_mat);
    //scene.add(sun);
}

    function animate() {
        requestAnimationFrame(animate);
        render.render(scene, camera);
    }
// rotation listener

function init(camera, scene){
      //Find our div containers in the DOM
      //var dataContainerOrientation = document.getElementById('dataContainerOrientation');
      //var dataContainerMotion = document.getElementById('dataContainerMotion');
      //var dataContainerAngle = document.getElementById('dataContainerAngle');
 
      //Check for support for DeviceOrientation event
      if(window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
                var alpha = event.alpha;
                var beta = event.beta;
                var gamma = event.gamma;
               
              }, false);
      }
 
      // Check for support for DeviceMotion events
      if(window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', function(event) {
                var x = event.accelerationIncludingGravity.x;
                var y = event.accelerationIncludingGravity.y;
                var z = event.accelerationIncludingGravity.z;
                var r = event.rotationRate;
                checkTimePass(x,y,z,camera,scene);
              });
      }
    }   
//when TIME_DELAY pass call rerender 
  function checkTimePass(x,y,z,camera,scene) {
        //var Y_AXIS = new THREE.Vector3( 0, 1, 0 );
        var d = new Date();
        var n = d.getTime();
        calcRotationAngle(x,y,z);
        if(n - currentTimeMils > TIME_DELAY) {
            currentTimeMils = n;
            //dataContainerAngle.innerHTML = html;
            // rotate camera and set rotation angle to 0
            camera.rotateOnAxis( Y_AXIS, rotationAngleZ );
            //camera
            rotationAngleZ = 0;
            // lets translate camera
             // and after make translation = 0
            currentSpeed = 0;
            return true;
        }
        return false;
  }
  function checkStartRotation(x,y,z) {
        if (x*x > 0.01 * (x*x + y*y + z*z)) {
            return true;
        }
        return false;
  }
  function calcRotationAngle(x,y,z) {
        var d = new Date();
        var n = d.getTime();
        if (x > 0 && checkStartRotation(x,y,z) == true) {
            rotationAngleZ = rotationAngleZ + (n - currentTimeMils) * rotationSpeed;
            currentAngle = currentAngle + (n - currentTimeMils) * rotationSpeed;
        }
        if (x < 0 && checkStartRotation(x,y,z) == true) {
            rotationAngleZ = rotationAngleZ - (n - currentTimeMils) * rotationSpeed;
            currentAngle = currentAngle - (n - currentTimeMils) * rotationSpeed;
        }
        //let's calculate camera translation
        currentPosition = new XYZ(camera.position.x, camera.position.y, camera.position.z);
        if(mapFrame.checkToReload(currentPosition)) {
            getObjectsListOnMap(currentPosition.x, currentPosition.z, currentPosition.y);
            xyzCenter.x = camera.position.x;
            xyzCenter.y = camera.position.y;
            xyzCenter.z = camera.position.z;
        }
   }

// calculate module of translation in current direction
  function calcTranslation(aX) {
        var d = new Date();
        var n = d.getTime();
        var displacement = currentSpeed * (n - currentTimeMils) / 1000;
        currentSpeed = currentSpeed + aX * (n - currentTimeMils) / 1000;
	return displacement;
  }

  function getObjectsListOnMap(longetude, lattitude, h) {
      //urlRequest = url + '/map/' + z + '/' + lattitude +'/' + longetude;
      urlRequest = url + '/map/' + h + '/' + lattitude +'/' + longetude;
      $.get(urlRequest, function(data, status){
          // get all appropriate objects to be placed on scene
          objectsList = new ObjectsList(data);
          //let's load objects from server
          objectNamesFromServer = new Array();
          for(i=0; i< data.length; i = i + 1){
              objectNamesFromServer.push(data[i].name +'_' + data[i].latitude + '_' + data[i].longitude);
          }
          while(data.length > 0){
              objectOnMap = objectsList.getObject();
              //check if the object has been allready loaded
              if (objectsListOnScene.includes(objectOnMap.name + '_' + objectOnMap.latitude + '_' + objectOnMap.longitude) == false){
                  loadOBJ(objectOnMap.name, objectOnMap.latitude, objectOnMap.longitude, objectOnMap.hight, objectOnMap.alphaZ);
                  // add loaded object to the list
                  objectsListOnScene.push(objectOnMap.name + '_' + objectOnMap.latitude + '_' + objectOnMap.longitude);
              }
              
          }
          objectsToDelete = getListToDelete(objectsListOnScene, objectNamesFromServer);
          while(objectsToDelete.length > 0) {
              objectNameToBeDeleted = objectsToDelete.pop();
              objectToDelete = scene.getObjectByName(objectNameToBeDeleted);
              scene.remove( objectToDelete );
              //remove from objectsListOnScene objects to delete
              removeByValue(objectsListOnScene, objectNameToBeDeleted)
          }
          animate();
      });
  }

  function getListToDelete(objectsOnScene, objectNamesFromServer) {
      objectsToDelete = new Array();
      for(i = 0; i < objectsOnScene.length; i = i + 1) {
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

  function removeByValue(arr, val) {
      for( var i = 0; i < arr.length; i++){ 
          if ( arr[i] == val) {
              arr.splice(i, 1); 
          }
      }
  }

  function checkForNavigationButtonPressed(x, y, wW, wH) {
      if (x/wW > 216 / 536 && x/wW < 338 / 536 && y/wH > 390 / 672 && y/wH < 483 / 672) {
          cameraControll.translateZ(-1 * scale);
          animate();
      }
      if (x/wW > 216 / 536 && x/wW < 338 / 536 && y/wH > 520 / 672 && y/wH < 648 / 672) {
          cameraControll.translateZ(1 * scale);
          animate();
      }
      if (x/wW > 400 / 536 && x/wW < 480 / 536 && y/wH > 290 / 672 && y/wH < 383 / 672) {
          cameraControll.translateY(1 * scale);
          animate();
      }
      if (x/wW > 400 / 536 && x/wW < 480 / 536 && y/wH > 400 / 672 && y/wH < 528 / 672) {
          cameraControll.translateY(-1 * scale);
          animate();
      }
  }

  function startTrack(event) {
      checkForNavigationButtonPressed(event.clientX, event.clientY, W, H)
      xDwn = event.clientX;
      yDwn = event.clientY;
  }

  function endTrack(event) {
      delta = (yDwn - event.clientY);
      delta = delta * scale / 100;
      angle = (xDwn - event.clientX) / 400;
//new version cameraControll
      cameraControll.rotateOnAxis( Y_AXIS, angle );
      cameraControll.translateZ(-delta);
      animate();
      checkForReload();
  }

  function checkForReload(){
        //currentPosition = new XYZ(camera.position.x, camera.position.y, camera.position.z);
        currentPosition = new XYZ(cameraControll.position.x, cameraControll.position.y, cameraControll.position.z);
        if(mapFrame.checkToReload(currentPosition)) {

            getObjectsListOnMap(currentPosition.x, currentPosition.z, currentPosition.y);
            // camera.x - has been changed to cameraControll.position.x
            xyzCenter.x = cameraControll.position.x;
            xyzCenter.y = cameraControll.position.y;
            xyzCenter.z = cameraControll.position.z;
        }        
        currentPosition = new XYZ(cameraControll.position.x, cameraControll.position.y, cameraControll.position.z);
        //if(mapFrame.checkToReload(currentPosition)) {
        //    getObjectsListOnMap(currentPosition.x, currentPosition.z, currentPosition.y);
        //    xyzCenter.x = cameraControll.position.x;
        //    xyzCenter.y = cameraControll.position.y;
        //    xyzCenter.z = cameraControll.position.z;
        //}
  }


}

