/* eslint-disable react-refresh/only-export-components */
// an simple endpoint for getting current list
import { Router } from 'express'

const router = Router()

let list = ["Item 1", "Item 2", "Item 3"];

router.get('/autorefetching/', async (req, res) => {
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

export default router
