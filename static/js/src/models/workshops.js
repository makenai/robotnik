var bundledWorkshops = require('../bundled-workshops.json');

function Workshops($q, pouchDB) {

  var db = pouchDB('Workshops');

  function query() {
    return $q(function(resolve, reject) {
      db.allDocs({
        include_docs: true
      }).then(function(result) {
        var workshops = result.rows.map( w => w.doc );
        resolve( workshops );
      });
    });
  }

  // Create initial records, but only if the document database is empty
  function initializeBundledWorkshops() {
    db.allDocs().then(function(result) {
      if ( result.total_rows == 0 ) {
        db.bulkDocs(bundledWorkshops);
      }
    });
  }
  initializeBundledWorkshops();

  return { query };
}

export default Workshops;
