import 'dotenv/config'
import mongoose from 'mongoose'
import pool from '../db/mysqlPool.mjs'

import Brand from '../_mongo_backup/models/Brand.js'
import Owner from '../_mongo_backup/models/Owner.js'
import Product from '../_mongo_backup/models/Product.js'

async function migrateBrands() {
  const brands = await Brand.find().lean()

  for (const brand of brands) {
    await pool.query(
      `
      INSERT INTO brands (name, mongo_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name)
      `,
      [brand.name, String(brand._id)],
    )
  }

  console.log('Brands migrated')
}

async function migrateOwners() {
  const owners = await Owner.find().lean()

  for (const owner of owners) {
    await pool.query(
      `
      INSERT INTO owners (name, location, mongo_id)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        location = VALUES(location)
      `,
      [owner.name, owner.location, String(owner._id)],
    )
  }

  console.log('Owners migrated')
}

async function getMysqlIdByMongoId(table, mongoId) {
  const [rows] = await pool.query(
    `
    SELECT id
    FROM ${table}
    WHERE mongo_id = ?
    `,
    [String(mongoId)],
  )

  return rows[0]?.id || null
}

async function migrateProducts() {
  const products = await Product.find().lean()

  for (const product of products) {
    const brandId = await getMysqlIdByMongoId(
      'brands',
      product.brand,
    )

    const ownerId = await getMysqlIdByMongoId(
      'owners',
      product.owner,
    )

    await pool.query(
      `
      INSERT INTO products
        (title, year, number, price, photo, brand_id, owner_id, mongo_id)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        year = VALUES(year),
        number = VALUES(number),
        price = VALUES(price),
        photo = VALUES(photo),
        brand_id = VALUES(brand_id),
        owner_id = VALUES(owner_id)
      `,
      [
        product.title,
        product.year,
        product.number,
        product.price || 0,
        product.photo || null,
        brandId,
        ownerId,
        String(product._id),
      ],
    )
  }

  console.log('Products migrated')
}

async function runMigration() {
  try {
    await mongoose.connect(process.env.MONGODB_URL)

    await migrateBrands()
    await migrateOwners()
    await migrateProducts()

    console.log('Migration completed')
  } catch (error) {
    console.log('Migration error:', error)
  } finally {
    await mongoose.disconnect()
    await pool.end()
  }
}

runMigration()