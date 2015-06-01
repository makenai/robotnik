var bundledWorkshops = require('../bundled-workshops.json');

function Workshops($q, pouchDB) {

  var db = pouchDB('Workshops');

  function query() {
    return db.allDocs({ 
      include_docs: true
    }).then(result => result.rows.map( w => w.doc ));
  }

  function get(id) {
    return db.get(id);
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

  return { query, get };
}

export default Workshops;
