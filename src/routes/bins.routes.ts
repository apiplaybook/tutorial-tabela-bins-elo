import { Router } from 'express'

import BinsController from '../controllers/BinsController'

const binsController = new BinsController()

const routes = Router()

routes.get('/', binsController.index)

routes.post('/', binsController.store)

export default routes;