var express = require('express')
  , app = express()

app.use(express.static(__dirname + '/static'))

app.listen(8000)
console.log('Listening on port 8000')