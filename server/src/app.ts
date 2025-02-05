import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { router } from './routes/router'
import { cors } from 'hono/cors'
// import { errorHandler } from './middleware/error'

const app = new Hono()
app.use(cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET'],
  allowHeaders: ['Content-Type']
}))

// app.onError(errorHandler)
app.route('/', router)

serve(app, () => {
  console.log('Server running on http://localhost:3000')
})