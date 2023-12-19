import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const baseStationSchema = mongoose.Schema({
  mountpoint: {
    type: String,
    required: true,
  },
  GPST: {
    type: String,
    required: false,
  },
  height: {
    type: String,
    required: true,
  },
  q: {
    type: String,
    required: true,
  },
  ns: {
    type: String,
    required: true,
  },
  sdn: {
    type: String,
    required: true,
  },
  sde: {
    type: String,
    required: true,
  },
  sdu: {
    type: String,
    required: true,
  },
  sdne: {
    type: String,
    required: true,
  },
  sdeu: {
    type: String,
    required: true,
  },
  sdun: {
    type: String,
    required: true,
  },
  age: {
    type: String,
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
    type: String,
    required: true,
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