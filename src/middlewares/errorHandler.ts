import { Request, Response, NextFunction } from 'express'
import HttpError from '../utils/httpError'
import { Prisma } from '@prisma/client'

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof HttpError) {
    console.error(err)
    res.status(err.status).send({ error: err.message })
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const targetedFields = err.meta?.target as string[]
    const joinedFields = Array.isArray(targetedFields)
      ? targetedFields.join(', ')
      : null

    if (err.code === 'P2002') {
      res.status(400).send({
        error: `'There is a unique constraint violation ${joinedFields ? 'on field(s) ' + joinedFields : ''}`,
      })
    } else {
      res.status(400).send({
        error: 'Prisma error occurred',
      })
    }
  } else {
    res.status(500).send({ error: 'Internal Server Error' })
  }
}

export default errorHandler
