import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'
import { metricsRoutes } from './routes/metrics'

export const app = fastify()

app.register(cookie)

app.addHook('preHandler', async (request) => {
  console.log(`[${request.method}] ${request.url}`)
})

app.register(usersRoutes, {
  prefix: 'users',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})

app.register(metricsRoutes, {
  prefix: 'metrics',
})
