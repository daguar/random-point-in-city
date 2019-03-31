const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('index'))

app.post('/random_point', (req, res) => res.render('random_point'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
