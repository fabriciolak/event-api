import express, { Express } from 'express'
import routes from './routes/index'

const app:Express = express()
app.use(express.json())

app.use(routes)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server running 🔥: http://localhost:${port}`)
})