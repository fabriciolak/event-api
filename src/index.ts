import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'ok'
  })
})

const PORT = 3000 || 5000
app.listen(PORT, () => {
  console.log('Server runing at 🔥 : http://localhost:3000')
})