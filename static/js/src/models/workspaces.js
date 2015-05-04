function Workspaces(pouchDB) {

  var db = pouchDB('Workspaces');

  function load() {
    console.log('WORKSPACE QUERY');
    return [];
  }

  function save(data) {
    console.log( util.inspect(data) );
  }


  return { load, save };
}

export default Workspaces;
