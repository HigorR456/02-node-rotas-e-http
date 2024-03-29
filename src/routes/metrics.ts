import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function metricsRoutes(app: FastifyInstance) {
  // Get meal
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const metrics = await knex('metrics').where('session_id', sessionId)

      return { metrics }
    },
  )
}
