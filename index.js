const express = require('express')
const cors = require('cors')
const {swap} = require('./service/swap')
const path = require('path');
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')));

// Handle the root path (/) to render the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/swap', swap)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})