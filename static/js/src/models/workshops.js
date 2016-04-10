var bundledWorkshops = require('../bundled-workshops.json');

function Workshops($q, pouchDB) {

  var db = pouchDB('Workshops');

  function query() {
    return db.allDocs({
      include_docs: true
    }).then(function(result) {
      if ( result.total_rows == 0 ) {
        // No rows, so load the bundled workshops, then return them from the DB
        // with id's.
        return db.bulkDocs(bundledWorkshops).then(function(results) {
          return db.allDocs({
            include_docs: true
          }).then(result => result.rows.map( w => w.doc ));
        });
      } else {
        return result.rows.map( w => w.doc );
      }
    });
  }

  function get(id) {
    return db.get(id);
  }

  return { query, get };
}

export default Workshops;
