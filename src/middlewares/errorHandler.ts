import { Request, Response, NextFunction } from 'express'
import HttpError from '../utils/httpError'

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof HttpError) {
    console.error(err)
    res.status(err.status).send({ error: err.message })
  } else {
    console.error(err)
    res.status(500).send({ error: 'Internal Server Error' })
  }
}

export default errorHandler
