import { Router, Request, Response } from 'express'
import ServiceError from '../utils/serviceError'
import { getXataClient, Events } from '../xata'
import dotenv from 'dotenv'
dotenv.config()

const router = Router()
const xata = getXataClient()

type EventsAppResponse<T> = { err: string } | { data: T }

router.get('/', async (req: Request, res: Response) => {
    try {
        const response = await xata.db.events.getAll()

        res.status(200).json({
        length: response.length,
        data: response,
        })
        
    } catch (error) {
        throw new ServiceError('Hmmm 👀. Algo deu errado.', 500)
    }
})

router.get('/events/:id', async (req: Request<{ id: string }, {}, Events>, res: Response) => {
    const id = req.params.id

    try {

        const response = await xata.db.events.read(id)

        if(!response) {
            res.status(404).json({ err: "Hmm 🤔 Não conseguimos encontrar pelo que você estava procurando." })
        }

        res.status(200).json(response)
        
    } catch (error) {
        throw new ServiceError('Hmmm 👀. Algo deu errado.', 500)
    }
})

router.post('/events', async (req: Request<{}, {}, Events>, res: Response<EventsAppResponse<Events>>) => {
    try {
        const body = req.body

        const response = await xata.db.events.create(body)
        
        return res.status(200).json({data: response})
    } catch (err) {
        console.error(err)
        return res.status(500).json({ err: "Oops! 😭 Algo deu errado." })
    }
})

router.put('/events/:id', async (req: Request<{ id: string }, {}, Events>, res: Response<EventsAppResponse<Events>>) => {
    const event = req.body
    const id = req.params.id

    try {
        
        const updatedEvent = await xata.db.events.update(id, event) as Events

        if(!updatedEvent) {
        res.status(404).json({ err: "Hmm 🤔 Não conseguimos encontrar pelo que você estava procurando." })
        } 

        res.status(200).json({data: updatedEvent})

    } catch (error) {
        console.error(error)
        return res.status(500).json({ err: "Eita! 🥲 Algo deu errado!" })
    }
})

router.delete('/events/:id', async (req: Request<{ id: string }, {}, Events>, res: Response<EventsAppResponse<Events>>) => {
    const id = req.params.id
    try {
        const deletedEvent = await xata.db.events.delete(id) as Events

        if(!deletedEvent) {
        return res.status(500).json({ err: "Hmm 🤔 Não conseguimos encontrar pelo que você estava procurando." })
        }

        return res.status(200).json({data: deletedEvent})

    } catch (error) {
        return res.status(500).json({ err: "Hmm 🤔 Algo deu errado." })
    }
})

export default router