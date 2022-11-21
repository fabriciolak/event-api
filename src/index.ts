import express, {Express, Request, Response} from 'express'
import dotenv from 'dotenv'

import { getXataClient, Events } from './xata'

dotenv.config()

const app:Express = express()
app.use(express.json())

const port = process.env.PORT || 3000
const xata = getXataClient()

type EventsAppResponse<T> = { err: string } | T

app.get('/events', async (req: Request, res: Response) => {
  try {
    const response = await xata.db.events.getAll()

    res.status(200).json({
      length: response.length,
      response,
    })
    
  } catch (error) {
    console.error(error)
  }
})

app.post('/events', async (req: Request<{}, {}, Events>, res: Response<EventsAppResponse<Events>>) => {
  try {
    const body = req.body

    const response = await xata.db.events.create(body)
    
    return res.status(200).json(response)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ err: "Oops! 😭 Algo deu errado." })
  }
})

app.put('/events/:id', async (req: Request<{ id: string }, {}, Events>, res: Response<EventsAppResponse<Events>>) => {
  const event = req.body
  const id = req.params.id

  try {
    
    const updatedEvent = await xata.db.events.update(id, event) as Events

    if(!updatedEvent) {
      res.status(404).json({ err: "Hmm 🤔 Não conseguimos encontrar pelo que você estava procurando." })
    } 

    res.status(200).json(updatedEvent)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ err: "Eita! 🥲 Algo deu errado!" })
  }
})

app.delete('/events/:id', async (req: Request<{ id: string }, {}, Events>, res: Response<EventsAppResponse<Events>>) => {
  const id = req.params.id
  try {
    const deletedEvent = await xata.db.events.delete(id) as Events

    if(!deletedEvent) {
      return res.status(500).json({ err: "Hmm 🤔 Não conseguimos encontrar pelo que você estava procurando." })
    }

    return res.status(200).json(deletedEvent)

  } catch (error) {
    return res.status(500).json({ err: "Hmm 🤔 Algo deu errado." })
  }
})

app.listen(port, () => {
  console.log(`Server running 🔥: http://localhost:${port}`)
})