'use strict';



export default {
  init: init
};

function init() {
  $( document ).ready(function() {
    // Keep the tabs sized to the window minus the header
    $( window ).resize(function() {
      $('.tab-content').css('height', $(window).height() - 100 + 'px' );
      $('#runningWindow').css({
        top: ( $(window).height() / 2 ) - ( $('#runningWindow').height() / 2 ),
        left: ( $(window).width() / 2 ) - ( $('#runningWindow').width() / 2 )
      });
    });
  });
}
