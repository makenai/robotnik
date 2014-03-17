var callbacks = {}

module.exports = {

  on: function(button, callback) {
    callbacks[ button + '_down' ] = callbacks[ button + '_down' ] || []
    callbacks[ button + '_down' ].push( callback )
  },

  off: function(button, callback) {
    callbacks[ button + '_up' ] = callbacks[ button + '_up' ] || []
    callbacks[ button + '_up' ].push( callback )
  }


}

process.on('message', function(message) {

  console.log( message + ' is hit' )
  console.log( callbacks )

  if ( callbacks[ message ] ) {
    for (var i=0;i<callbacks[ message ].length;i++) {
      callbacks[ message ][ i ]()  
    }
    console.log( 'trigger' )
  }
    

});