function Workspaces(pouchDB) {

  return { query, get };

  function query() {
    return 'WORKSPACE QUERY';
    return [];
  }

  function get() {
    console.log('WORKSPACE GET');
  }

}

export default Workspaces;
