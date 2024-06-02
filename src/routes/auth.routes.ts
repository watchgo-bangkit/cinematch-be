import { Router, Request, Response, NextFunction } from 'express'
import * as authService from '../services/auth.service'
import { LoginDataSchema, RegisterDataSchema } from '../dto/auth.dto'

const router = Router()

router.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const registerData = RegisterDataSchema.parse(req.body)
      const user = await authService.registerUser(registerData)
      res.status(201).json(user)
    } catch (error) {
      next(error)
    }
  },
)

router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginData = LoginDataSchema.parse(req.body)

      const result = await authService.loginUser(loginData)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  },
)
export default router
