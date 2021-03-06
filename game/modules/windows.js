define([
    './frameLoader'
  ], function(frameLoader) {
  var framesUrls = [
    'windows/1',
    'windows/1d',
    'windows/2',
    'windows/2d'
  ];
  var frames = [];
  var windowTypes = 0;
  var box;

  var init = function() {
    var dfd = $.Deferred();
    frameLoader.load(framesUrls).then(function(frameMeshes) {
      frames = frameMeshes;
      windowTypes = frames.length/2;
      // mesh.scale.set(4, 4, 4);
      frameMeshes.forEach(function(mesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;

      });
      dfd.resolve();
    });
    return dfd;
  };

  var allWindows = [];
  var getWindow = function(name) {
    var win = allWindows.filter(function(mesh) {
      return mesh.name === name;
    });
    if (win.length) {
      return win[0];
    } else {
      return false;
    }
  };
  var createWindow = function() {
    var mesh = new THREE.Group();
    var frameNumber = (~~(Math.random() * windowTypes))*2;

    mesh.fixedFrame = frames[frameNumber].clone();
    mesh.brokenFrame = frames[frameNumber+1].clone();
    mesh.add(mesh.fixedFrame);
    // mesh.add(mesh.brokenFrame);

    mesh.break = function() {
      mesh.remove(mesh.fixedFrame);
      mesh.add(mesh.brokenFrame);
    };

    mesh.fix = function() {
      mesh.remove(mesh.brokenFrame);
      mesh.add(mesh.fixedFrame);
    };

    mesh.sizes = function() {
      var box = new THREE.Box3().setFromObject(mesh);
      return box.size();
    };

    allWindows.push(mesh);
    return mesh;
  };
  return {
    init: init,
    createWindow: createWindow,
    getWindow: getWindow
  };

});
