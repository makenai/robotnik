function Workspaces(pouchDB) {

  var db = pouchDB('Workspaces');

  function query() {
    console.log('WORKSPACE QUERY');
    return [];
  }


  return { query };
}

export default Workspaces;
