import { Router } from 'express'
import * as authService from '../services/auth.service'
import { LoginDataSchema, RegisterDataSchema } from '../dto/auth.dto'
import validateSchema from '../middlewares/validateSchema'

const router = Router()

router.post(
  '/register',
  validateSchema(RegisterDataSchema),
  authService.registerUser,
)

router.post('/login', validateSchema(LoginDataSchema), authService.loginUser)
export default router
