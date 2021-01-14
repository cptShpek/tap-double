require('colors');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Guest = require('./models/Guest');
const User = require('./models/User');
const Event = require('./models/Event');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Import into DB
const importData = async () => {
  try {
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (ex) {
    console.error(ex);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Guest.deleteMany();
    await User.deleteMany();
    await Event.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (ex) {
    console.error(ex);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
