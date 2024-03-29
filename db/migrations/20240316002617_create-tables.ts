import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.uuid('session_id').index()
    table.text('username').notNullable()
    table.text('email').notNullable()
    table.text('password').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })

  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('session_id').index()
    table.text('name').notNullable()
    table.text('description')
    table.timestamp('meal_time').defaultTo(knex.fn.now()).notNullable()
    table.boolean('diet_meal').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })

  await knex.schema.createTable('metrics', (table) => {
    table.uuid('id').primary()
    table.uuid('session_id').index()
    table.integer('meal_amount').notNullable()
    table.integer('diet_amount').notNullable()
    table.integer('not_diet_amount').notNullable()
    table.integer('diet_sequence').notNullable()
    table.integer('longest_sequence').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
  await knex.schema.dropTable('meals')
  await knex.schema.dropTable('metrics')
}
