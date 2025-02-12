import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { rateLimiter } from "hono-rate-limiter";
import { router } from './routes/router'
import { cors } from 'hono/cors'
import dotenv from 'dotenv'

dotenv.config()

const PORT = Number(process.env.PORT) || 3000;
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

serve({
  fetch: app.fetch,
  port: PORT
})
console.log(`🚀 Server running on port ${PORT}`)