import express from 'express'
import authRoutes from './routes/auth.routes'
import movieRoutes from './routes/movie.routes'
import errorHandler from './middlewares/errorHandler'
import watchlistRoutes from './routes/watchlist.routes'
import reviewRoutes from './routes/reviews.routes'

const app = express()
const PORT = 8000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth', authRoutes)
app.use('/api/movies', movieRoutes)
app.use('/api/watchlists', watchlistRoutes)
app.use('/api/reviews', reviewRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
