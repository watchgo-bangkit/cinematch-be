import { Request, Response, NextFunction } from 'express'
import { AnyZodObject } from 'zod'

const validateSchema = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      return next()
    } catch (error) {
      return res.status(400).send({ message: error })
    }
  }
}

export default validateSchema
