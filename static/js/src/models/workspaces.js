function Workspaces($resource) {
  return $resource('/api/workspaces/:id');
}

export default Workspaces;