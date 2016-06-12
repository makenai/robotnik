export default function() {
  return {
    controllerAs: 'vm',
    scope: {
      onMove: '&?'
    },
    link: function(scope, element) {
      let joystick = new RetroJoyStick({
        container: element[0],
        position: 'custom',
        snapping: true
      });

      var past_directions = {
        up:    false,
        down:  false,
        left:  false,
        right: false
      };

      this.lastEvent;
      this.heldDirection = {};

      var move = function(direction, state) {
        if (state == "down") {
            if (this.lastEvent && this.lastEvent == direction) {
                return;
            }
            this.lastEvent = direction;
            this.heldDirection[direction] = true;
        } else {
            this.lastEvent = null;
            delete this.heldDirection[direction];
        }
        scope.onMove({direction, state});
      }.bind(this);

      joystick.on('change', function(e) {
        scope.$apply(function() {
          if ( this.distance > 40 && this.angle > 40 && this.angle < 140 ) {
            move('right', 'down');
            past_directions.right = true;
          } else {
            if ( past_directions.right ) {
              move('right', 'up');
              past_directions.right = false;
            }
          }

          if ( this.distance > 40 && this.angle < 320 && this.angle > 240 ) {
            move('left', 'down');
            past_directions.left = true;
          } else {
            if ( past_directions.left ) {
              move('left', 'up');
              past_directions.left = false;
            }
          }

          if ( this.distance > 40 && ( this.angle < 40 || this.angle > 320 ) ) {
            move('up', 'down');
            past_directions.up = true;
          } else {
            if ( past_directions.up ) {
              move('up', 'up');
              past_directions.up = false;
            }
          }

          if ( this.distance > 40 && this.angle > 120 && this.angle < 240 ) {
            move('down', 'down');
            past_directions.down = true;
          } else {
            if ( past_directions.down ) {
              move('down', 'up');
              past_directions.down = false;
            }
          }
        }.bind(this));
      });
    }
  };
}
