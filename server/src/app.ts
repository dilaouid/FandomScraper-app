import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { rateLimiter } from "hono-rate-limiter";
import { router } from './routes/router'
import { cors } from 'hono/cors'
import dotenv from 'dotenv'

dotenv.config()

const ORIGIN = process.env.ORIGIN || 'http://localhost:5173'

const app = new Hono()
app.use(cors({
  origin: ORIGIN,
  allowMethods: ['GET'],
  allowHeaders: ['Content-Type']
}))

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-6",
    keyGenerator: (c) => c.req.header('cf-connecting-ip') || c.req.header('x-real-ip') || c.req.header("x-forwarded-for") || ""
  })
);

app.route('/', router)

serve(app, () => {
  console.log('Server running on http://localhost:3000')
})