import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const baseStationSchema = mongoose.Schema({
  mountpoint: {
    type: Number,
    required: true,
  },
  gpst: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  q: {
    type: Number,
    required: true,
  },
  ns: {
    type: Number,
    required: true,
  },
  sdn: {
    type: Number,
    required: true,
  },
  sde: {
    type: Number,
    required: true,
  },
  sdu: {
    type: Number,
    required: true,
  },
  sdne: {
    type: Number,
    required: true,
  },
  sdeu: {
    type: Number,
    required: true,
  },
  sdun: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  ratio: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const subscriptionSchema = mongoose.Schema({
  basemountpoint: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  passsword: {
    type: String,
    required: false,
  },
  delay: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  baseStationdata: [baseStationSchema], // Array of baseStationSchema in subscriptionSchema
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    subscriptions: [subscriptionSchema], // Array of subscriptionSchema
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;