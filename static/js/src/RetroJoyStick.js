/*
   @TODO:

     [x] add support for multiple joysticks

     [x] add support for touch events

     [x] add support for manipulating multiple joysticks

     [ ] fix issue when releasing (caused by hack for handling multiple touch events)

     [ ] increase resistance of pulling when at 75 +

     [ ] distance setter changes knob position

     [ ] angle setter changes knob position
*/

var joystickId = 0;

function RetroJoyStick(options) {

  var self = this;

  // options
  options = options || {};

  // Should there be snapping?
  self.snapping = options.snapping || true;

  // What amount of pixels should we snap to?
  self.snappingPixels = options.snappingPixels || 8;

  // How far away from the center of the joystick
  self.maxDistanceFromCenter = options.maxDistanceFromCenter || 100;

  self.speedAdjustment = options.speedAdjustment || 0.08;

  self.container = options.container || document.body;

  // @TODO:?
  // aerial or scrolling
  //
  // aerial (think helicopter):
  //   when forward is pushed, the object goes up.
  //
  // scrolling (think mario bros):
  //   when forward is pushed, the object goes to the right.
  self.orientation = options.orientation || 'arial';

  if (options.position) {
    self.position = options.position;
  }
  else {
    self.position = 'bottom_left';
  }

  self.joystickId = ++joystickId;

  self.insertJoystickMarkup();

  var wrap = $('#retrostick-' + self.joystickId);

  var ball = wrap.find('.retrostick-ball');
  var stick = wrap.find('.retrostick-stick');
  var stickWrap = wrap.find('.retrostick-stick-wrap');
  var base = wrap.find('.retrostick-base');

  // private variables used in public methods
  this._ball = ball;
  this._stick = stick;

  // Scoped to the constructor, mostly for sharing in between mouse events
  var ballOffset,
      currentPos,
      clickOffset,
      point,
      lastPointX,
      lastPointY,
      lastDistance,
      lastAngle;

  // dimension based calculations
  var ballWidth = ball.width();
  var ballHeight = ball.height();
  var baseWidth = base.width();
  var baseHeight = base.height();
  var ballRadius = ballWidth / 2;

  // couldn't live without it, no way, oh no.
  var centerPoint = {x: baseWidth / 2, y: baseHeight / 2};

  // When we are moving around the joystick.
  function handleRetroStickMove(e) {

    // get the position of the joystick
    point = {
      x: e.pageX - ballOffset.left + currentPos.left- clickOffset.left + ballRadius,
      y: e.pageY - ballOffset.top + currentPos.top - clickOffset.top + ballRadius
    };

    // publicize the distance from center
    self.distance = getDistance(point, centerPoint);

    // Get angle from center (0-360)
    var theta = Math.atan2(point.y - centerPoint.y, point.x - centerPoint.x);

    if(theta < 0) theta += 2 * Math.PI;

    // Determine the angle of the joystick
    var _angle = (theta * 180 / Math.PI + 90 ) % 360;

    // publicize the angle (triggers setter)
    self.angle = _angle;

    // Constrain the point within a circle
    var limitedPoint = limit(point, centerPoint);

    // Snapping is enabled
    if (self.snapping) {

      // amount of pixels to snap to.
      var snap = self.snappingPixels;

      // Snap to the center
      if (self.distance < snap) {
        self.angle = 0;
        limitedPoint.x = centerPoint.x;
        limitedPoint.y = centerPoint.y;
      }

      // Snap on 0 angle
      if (_angle > 360 - snap || (_angle > 0 && _angle < snap)) {
        self.angle = 0;
        limitedPoint.x = centerPoint.x;
      }

      // Snap on 90 angle
      if (_angle > 90 - snap && _angle < 90 + snap) {
        self.angle = 90;
        limitedPoint.y = centerPoint.y;
      }

      // Snap on 180 angle
      if (_angle > 180 - snap && _angle < 180 + snap) {
        self.angle = 180;
        limitedPoint.x = centerPoint.x;
      }

      // Snap on 270 angle
      if (_angle > 270 - snap && _angle < 270 + snap) {
        self.angle = 270;
        limitedPoint.y = centerPoint.y;
      }
    } // End snapping

    var changed = false;

    if (limitedPoint.y !== lastPointY) {
      ball.css('top', limitedPoint.y - (ballHeight / 2));
      lastPointY = limitedPoint.y;
      changed = true;
    }

    if (limitedPoint.x !== lastPointX) {
      ball.css('left', limitedPoint.x - ballRadius);
      lastPointX = limitedPoint.x;
      changed = true;
    }

    if (self._angle !== lastAngle) {
      // Change stick angle according to where the ball has rotated
      stickWrap.css('-webkit-transform', 'rotate(' + self._angle + 'deg)');
      stickWrap.css('-moz-transform', 'rotate(' + self._angle + 'deg)');
      stickWrap.css('transform', 'rotate(' + self._angle + 'deg)');
      lastAngle = self._angle;
      changed = true;
    }

    // Change stick height so it reaches the ball
    if (self.distance !== lastDistance) {
      stick.height(self.distance);
      changed = true;
    }

    if (changed) {
      self.publish('change');
    }

    if (e.preventDefault) e.preventDefault();
  }

  function handleRetroStickUp(e, isTouch) {
    if (e.target === self._ball[0]) {
      self.resetPosition();
      if (isTouch) {
        document.removeEventListener('touchmove', handleTouchRetroStickMove, false);
      }
      else {
        document.removeEventListener('mousemove', handleRetroStickMove, false);
      }
    }
  }

  function handleTouchRetroStickMove(e) {
    if (e.target === self._ball[0]) {
      var touches = e.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        console.log(i);
        handleRetroStickMove(touches[i], true);
      }
    }
  }

  function handleTouchRetroStickUp(e) {
    var touches = e.changedTouches;
    for (var i = 0; i < touches.length; i++) {
      handleRetroStickUp(e, true);
    }
  }

  // When we press down on the joystick ball.
  function handleRetroStickPress(e, isTouch) {

    // Notate some shit
    ballOffset = ball.offset();
    currentPos = ball.position();
    clickOffset = {left: e.pageX - ballOffset.left, top: e.pageY - ballOffset.top};

    // Remove animation classes (from previous press)
    self._ball.removeClass('retrostick-ball-to-center');
    self._stick.removeClass('retrostick-stick-to-center');

    if (isTouch) {
      document.addEventListener('touchmove', handleTouchRetroStickMove, false);
      document.addEventListener('touchend', handleTouchRetroStickUp, false);

    }
    else {
      document.addEventListener('mousemove', handleRetroStickMove, false);
      document.addEventListener('mouseup', handleRetroStickUp, false);
    }

    if (e.preventDefault) e.preventDefault();
  }

  ball[0].addEventListener('mousedown', handleRetroStickPress, false);

  ball[0].addEventListener('touchstart', function (e) {
    var touches = e.changedTouches;
    for (var i = 0; i < touches.length; i++) {
      handleRetroStickPress(touches[i], true);
    }

    e.preventDefault();
  }, false);

}

RetroJoyStick.prototype = {

    get angle(){
      return this._angle;
    },

    set angle(val){
      this._angle = Math.floor(val);
    },

    get distance(){
      return this._distance;
    },

    set distance(distance){
      // Make sure distance doesn't go further than the max.
      if (distance > this.maxDistanceFromCenter) distance = this.maxDistanceFromCenter;
      this._distance = distance;
    }

};

RetroJoyStick.prototype.insertJoystickMarkup = function () {

  var self = this;

  var wrap = document.createElement('div');
  wrap.setAttribute('id', 'retrostick-' + self.joystickId);
  wrap.className = 'retrostick';

  wrap.innerHTML = '\
      <div class="retrostick-base">\
        <div class="retrostick-base-joint">\
            <div><div></div></div>\
        </div>\
        <span class="retrostick-dir-note retrostick-dir-forward-left">left</span>\
        <span class="retrostick-dir-note retrostick-dir-forward">forward</span>\
        <span class="retrostick-dir-note retrostick-dir-forward-right">right</span>\
        <div class="retrostick-stick-wrap">\
          <div class="retrostick-stick"></div>\
        </div>\
        <div class="retrostick-ball"></div>\
        <span class="retrostick-dir-note retrostick-dir-backward-left">left</span>\
        <span class="retrostick-dir-note retrostick-dir-backward">backward</span>\
        <span class="retrostick-dir-note retrostick-dir-backward-right">right</span>\
      </div>\
  ';

  if (this.position == 'bottom_left') {
    $(wrap).addClass('retrostick-bottom-left');
  }

  if (this.position == 'bottom_right') {
    $(wrap).addClass('retrostick-bottom-right');
  }

  this.container.appendChild(wrap);

  this.publish('beforeInsert', wrap);

  return wrap;
};

RetroJoyStick.prototype.getPositionAdjustment = function () {

  var angle = angle || this.angle;
  var distance = distance || this.distance;

  distance *= this.speedAdjustment;

  angle = angle - 90;
  if (angle < 0) {
    angle = Math.abs(angle) + 270;
  }

  var radian = angle * Math.PI / 180;
  var cosAngle = Math.cos(radian);
  var sinAngle = Math.sin(radian);

  var x = Math.floor(cosAngle * distance);
  var y = Math.floor(sinAngle * distance);

  return {x: x, y: y};

};

RetroJoyStick.prototype.resetPosition = function () {
  this._ball.addClass('retrostick-ball-to-center');
  this._ball.css('top', 50);
  this._ball.css('left', 50);
  this._stick.addClass('retrostick-stick-to-center');
  this._stick.height(5);
  this.angle = 0;
  this.distance = 0;
  this.publish('change');
};

// https://gist.github.com/deshawnbw/7521966
RetroJoyStick.prototype.publish = function(topic, args){
  var self = this;
  if (this._eventCache && this._eventCache[topic]) {
    this._eventCache[topic].forEach(function (topicSubscriber) {
      topicSubscriber.apply(self, args || []);
    });
  }
};

RetroJoyStick.prototype.subscribe = function (topic, callback) {
  if (!this._eventCache) this._eventCache = {};
  if (!this._eventCache[topic]) this._eventCache[topic] = [];
  this._eventCache[topic].push(callback);

  return [topic, callback];
};

RetroJoyStick.prototype.on = RetroJoyStick.prototype.subscribe;

RetroJoyStick.prototype.trigger = RetroJoyStick.prototype.publish;

RetroJoyStick.prototype.unsubscribe = function(handle){
  var self = this;
  if (this._eventCache && this._eventCache[handle[0]]) {
    this._eventCache[handle[0]].forEach(function (callback, i) {
      if (handle[1] === callback) {
        self._eventCache[handle[0]].splice(i, 1);
      }
    });
  }
};

function getDistance(point1, point2) {
  var xs = (point1.x - point2.x) * (point1.x - point2.x);
  var ys = (point1.y - point2.y) * (point1.y - point2.y);

  return Math.floor(Math.sqrt(xs + ys));
}

// http://stackoverflow.com/questions/8515900/how-to-constrain-movement-within-the-area-of-a-circle
// http://jsfiddle.net/7Asn6/
function limit(point, centerPoint) {
  if (centerPoint.x) {
  var dist = getDistance(point, centerPoint);
  if (dist <= centerPoint.x) { // radius
      return point;
  } 
  else {
    x = point.x - centerPoint.x;
    y = point.y - centerPoint.y;
    var radians = Math.atan2(y, x);
       return {
           x: Math.cos(radians) * centerPoint.x + centerPoint.x,
           y: Math.sin(radians) * centerPoint.y + centerPoint.y
       };
  }
  }
}

