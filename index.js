const express = require("express")
const cors = require("cors")

const db = require("./db/models/index.js")
const categories = require("./src/categories/category.controller.js")


const app = express()
app.use(express.json());
app.use(cors())

const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

  // users.init(app)
  categories.init(app)
})

