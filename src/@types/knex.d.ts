// eslint-disable-next-line
import  { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      session_id: string
      username: string
      email: string
      password: string
      created_at: string
      updated_at: string
    }
    meals: {
      id: string
      session_id: string
      name: string
      description: string | null
      meal_time: string
      diet_meal: boolean
      created_at: string
      updated_at: string
    }
    metrics: {
      id: string
      session_id: string
      meal_amount: number
      diet_amount: number
      not_diet_amount: number
      diet_sequence: number
      created_at: string
      updated_at: string
    }
  }
}
