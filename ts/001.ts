import 'reflect-metadata'
import router from './router'
import express from 'express'

const app = express()

app.use(express.json())

// 接口逻辑
app.get('/user/info', (req, res) => {
  res.status(200).json({
    message: '用户'
  })
})


app.post('/user/login')