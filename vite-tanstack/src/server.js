import express from 'express'
import cors from 'cors'
import autoRefreshRouter from './AutoRefetching/api/data.js'

const app = express()

app.use(express.json())
app.use(cors())

app.use(autoRefreshRouter)

let list = ["Item 1", "Item 2", "Item 3"];

app.get('/api/data', async (req, res) => {
  if (req.query.add) {
    if (!list.includes(req.query.add)) {
      list.push(req.query.add);
    }
  } else if (req.query.clear) {
    list = [];
  }

  await new Promise((r) => setTimeout(r, 100));

  res.json(list);
})

app.get('/', (req, res) => {
  res.send('server 9001')
})

app.listen(9001, () => {
  console.log(`Server running on PORT 9001`)
})