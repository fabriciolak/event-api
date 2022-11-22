import { Router } from 'express'

import eventsRoute from './events.routes'

const router = Router()

type EventsAppResponse<T> = { err: string } | T

router.use('/', eventsRoute)


export default router