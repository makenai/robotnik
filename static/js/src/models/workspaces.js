import _ from 'lodash';

function Workspaces($q, pouchDB) {

  var db = pouchDB('Workspaces');

  function load(workshopId) {
    return db.find({
      selector: { workshopId },
      limit: 1
    }).then(result => result.docs[0]);
  }

  function save(data) {
    db.find({
      selector: { workshopId: data.workshopId }
    }).then(function(result) {
      if ( result.docs.length > 0 ) {
        // Need to just update an existing record
        var updatedDoc = _.extend( result.docs[0], data );
        db.put( updatedDoc );
      } else {
        // Need to autogenerate an _id
        db.post( data );
      };
    }).catch(function (err) {
      console.log( err );
    });
  }

  // Create index, only if it doesn't exist.
  db.createIndex({
    index: {
        fields: [ 'workshopId' ]
    }
  });

  return { load, save };
}

export default Workspaces;
