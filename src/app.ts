import express from 'express'
import authRoutes from './routes/auth.routes'
import movieRoutes from './routes/movie.routes'
import errorHandler from './middlewares/errorHandler'

const app = express()
const PORT = 8000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth', authRoutes)
app.use('/api/movies', movieRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
