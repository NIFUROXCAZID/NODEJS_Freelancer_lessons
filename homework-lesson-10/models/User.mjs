import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [50, 'Username must be at most 50 characters'],
      trim: true,
      unique: true,
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
    },

    role: {
      type: String,
      enum: ['user', 'manager', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
)

const User = mongoose.model('User', userSchema)

export default User