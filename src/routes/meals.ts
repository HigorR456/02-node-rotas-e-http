import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  // Create meal
  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string().optional(),
        meal_time: z.string(),
        diet_meal: z.boolean(),
      })

      const {
        name,
        description,
        meal_time: mealTime,
        diet_meal: dietMeal,
      } = createMealBodySchema.parse(request.body)

      await knex('meals').insert({
        id: randomUUID(),
        session_id: sessionId,
        name,
        description,
        meal_time: mealTime,
        diet_meal: dietMeal,
      })

      await knex('metrics')
        .where('session_id', sessionId)
        .select('diet_sequence')

      if (dietMeal) {
        const [
          { diet_sequence: dietSequence, longest_sequence: longestSequence },
        ] = await knex('metrics')
          .where('session_id', sessionId)
          .select('diet_sequence', 'longest_sequence')

        console.log(dietSequence, longestSequence)

        if (dietSequence + 1 > longestSequence) {
          await knex('metrics')
            .where('session_id', sessionId)
            .increment('meal_amount', 1)
            .increment('diet_amount', 1)
            .increment('diet_sequence', 1)
            .increment('longest_sequence', 1)
        } else {
          await knex('metrics')
            .where('session_id', sessionId)
            .increment('meal_amount', 1)
            .increment('diet_amount', 1)
            .increment('diet_sequence', 1)
        }
      } else {
        await knex('metrics')
          .where('session_id', sessionId)
          .increment('meal_amount', 1)
          .increment('not_diet_amount', 1)
          .update('diet_sequence', 0)
      }

      return reply.status(200).send()
    },
  )

  // Edit meal
  app.put(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const updateMealBodySchema = z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        meal_time: z.string().optional(),
        diet_meal: z.boolean().optional(),
      })

      const {
        id,
        name,
        description,
        meal_time: mealTime,
        // diet_meal: dietMeal,
      } = updateMealBodySchema.parse(request.body)

      name &&
        (await knex('meals')
          .where('id', id)
          .andWhere('session_id', sessionId)
          .update({ name, updated_at: knex.fn.now() }))

      description &&
        (await knex('meals')
          .where('id', id)
          .andWhere('session_id', sessionId)
          .update({ description, updated_at: knex.fn.now() }))

      mealTime &&
        (await knex('meals')
          .where('id', id)
          .andWhere('session_id', sessionId)
          .update({ meal_time: mealTime, updated_at: knex.fn.now() }))

      /* dietMeal &&
        (await knex('meals')
          .where('id', id)
          .andWhere('session_id', sessionId)
          .update({ diet_meal: dietMeal, updated_at: knex.fn.now() })) */

      return reply.status(200).send()
    },
  )

  // Get meal
  app.post(
    '/one',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies
      const getMealBodySchema = z.object({
        id: z.string(),
      })

      const { id } = getMealBodySchema.parse(request.body)

      const meal = await knex('meals')
        .where('id', id)
        .andWhere('session_id', sessionId)

      return { meal }
    },
  )

  // Get all meals
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const meals = await knex('meals')
        .where('session_id', sessionId)
        .union(knex.raw('select * from meals where session_id'))

      return meals
    },
  )
}
