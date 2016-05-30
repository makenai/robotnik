import Workshop from './workshop';
var bundledWorkshops = require('../bundled-workshops.json');

function Workshops($q, pouchDB) {

  var db = pouchDB('Workshops');

  function query() {
    return db.allDocs({
      include_docs: true
    }).then(function(result) {
      var rows = result.rows.map( w => w.doc );
      return bundledWorkshops.concat( rows );
    });
  }

  function get(id) {
    var bundledWorkshop = bundledWorkshops.find( doc => doc._id === id );
    var workshopData;
    if (bundledWorkshop) {
      workshopData = bundledWorkshop;
    } else {
      workshopData = db.get(id).then( result => result );
    }
    return new Workshop( workshopData );
  }

  return { query, get };
}

export default Workshops;
