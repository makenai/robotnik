function Workshops(pouchDB) {

  return { query };

  function query() {
    console.log('WORKSHOP QUERY');
    return [
      { id: 1, description: 'Cat Heres' },
      { id: 2, description: 'Dog HEres' },
    ]
  }

}

export default Workshops;
