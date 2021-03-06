define([
  './animate'
],function(animate) {
  var level = 0;
  var monster;
  var cbo;
  var setLevel = function (lev) {
    level = lev
  }
  var setMonster = function(obj) {
    monster = obj;
  }

  var setCallBack = function(call) {
    cbo = call;
  }
  var start = function(platform) {
    var tw;
    var startDirection;
    if((monster.mesh.position.x)>0) {
      startDirection = 'left';
    } else {
      startDirection = 'right';
    }
    if (startDirection==='right') {
      monster.lookRight();
    } else {
      monster.lookLeft();
    }

    var onRepeat = function() {
      tw.pause();
      startDirection = startDirection === 'right' ? 'left': 'right';
      if (startDirection==='right') {
        monster.lookRight(function(){tw.resume();});
      } else {
        monster.lookLeft(function(){tw.resume();});
      }
      var pauseTime =  ~~((Math.random() * 2500) + 1000);
      animate.dfdTimeOut(function(){
        tw.pause();
        monster.lookStraight();
        monster.changeAnimation('action');
        var pom = cbo || function() {};
        pom();
      }, pauseTime).then(function(){
        return animate.dfdTimeOut(function(){
          if (startDirection==='right') {
            monster.lookRight();
          } else {
            monster.lookLeft();
          }
          tw.resume();
          monster.changeAnimation('walk');
        }, 1000);
      });
    };
    animate.jumpTo(monster, 2, platform.width/2 - monster.mesh.position.x, monster.mesh.position.y).then(function(){
      monster.lookRight();
      startDirection = 'right';
      tw = TweenMax.to(monster.mesh.position, 3, {x:-monster.mesh.position.x, repeat:-1, yoyo:true, onRepeat:onRepeat, repeatDelay:1.0, ease:Linear.easeNone});
    });
  };
  return {
    setLevel: setLevel,
    setMonster: setMonster,
    start: start,
    setCallBack: setCallBack
  };
});
