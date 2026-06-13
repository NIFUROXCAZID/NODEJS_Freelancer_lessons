import mongoose from 'mongoose'
import config from '../../config/default.mjs'

const { Schema } = mongoose

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [50, 'Name must be at most 50 characters long'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Age must be at least 18'],
    max: [120, 'Age must be at most 120'],
    toInt: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    maxlength: [16, 'Password must be at most 16 characters long'],
    validate: {
      validator: function (v) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
          v,
        )
      },
      message: (props) =>
        'Password must contain at least one letter, one number, and one special character',
    },
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'Type',
  },
  img: {
    type: String,
  },
})

userSchema.static.checkDatabaseExists = async () => {
  const databases = await mongoose.connection.listDatabases()
  return databases.databases.some((db) => db.name === config.databaseName)
}

userSchema.static.checkCollectionExists = async function () {
  if (await this.checkDatabaseExists()) {
    const collections = await mongoose.connection.db
      .listCollections({ name: 'users' })
      .toArray()
    return collections.length > 0
  }
  return false
}

const User = mongoose.model('User', userSchema)
export default User
