import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import axios from 'axios';
import moment from 'moment-timezone';
import path from 'path';
import { fileURLToPath } from 'url';
import AdminBro from 'admin-bro';
import AdminBroExpress from '@admin-bro/express';
import AdminBroMongoose from '@admin-bro/mongoose';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://saidaliyevjasur450:WY6J8XejQg7ssd8d@facebot.xq2i7gl.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define a schema and model for users
const userSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  role: String,
  images: [String],
  descriptors: [[Number]] // Store face descriptors for each image
});

const User = mongoose.model('User', userSchema);

// Define a schema and model for face logs
const faceLogSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  role: String,
  image: String,
  timestamp: Date,
  lateMinutes: Number,
  status: String
});

const FaceLog = mongoose.model('FaceLog', faceLogSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// AdminBro setup
AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
  resources: [
    {
      resource: User,
      options: {
        listProperties: ['name', 'role', 'images', 'descriptors'], // Customize fields for list view
        showProperties: ['name', 'role', 'images', 'descriptors'], // Customize fields for show view
        editProperties: ['name', 'role', 'images', 'descriptors'], // Customize fields for edit view
        filterProperties: ['name', 'role'] // Optional: filter properties if needed
      }
    },
    {
      resource: FaceLog,
      options: {
        listProperties: ['name', 'timestamp', 'image', 'role', 'status', 'lateMinutes'], // Customize fields for list view
        showProperties: ['name', 'timestamp', 'image', 'role', 'status', 'lateMinutes'], // Customize fields for show view
        editProperties: ['name', 'timestamp', 'image', 'role', 'status', 'lateMinutes'], // Customize fields for edit view
        filterProperties: ['name', 'role'] // Optional: filter properties if needed
      }
    }
  ],
  rootPath: '/admin',
});

const router = AdminBroExpress.buildRouter(adminBro);

app.use(adminBro.options.rootPath, router);

// Mock face recognition function
const mockFaceRecognition = (descriptor) => {
  // Mock logic: always return the first user if descriptor is provided
  return User.findOne();
};

// Route to handle file uploads and user creation
app.post('/api/upload', upload.array('images'), async (req, res) => {
  const { employeeId, name, role } = req.body;
  const imagePaths = req.files.map(file => file.path);

  try {
    // Mock descriptors for demonstration
    const descriptors = imagePaths.map(() => Array(128).fill(0)); // Example descriptor array

    const newUser = new User({
      employeeId,
      name,
      role,
      images: imagePaths,
      descriptors // Save mock descriptors
    });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to handle face log creation and send data to Telegram
app.post('/api/log', async (req, res) => {
  const { employeeId, name, role, image, timestamp, lateMinutes, status } = req.body;

  try {
    const faceLog = new FaceLog({
      employeeId,
      name,
      role,
      image,
      timestamp,
      lateMinutes,
      status
    });
    await faceLog.save();

    // Send data to Telegram bot
    const botToken = '7229766137:AAEPvJdYTwex1-uqbs7daOmV83it9mk8qyw';
    const chatId = '1847596793';
    const message = `
      <b>Name:</b> ${name}
      <b>Role:</b> ${role}
      <b>Status:</b> ${status}
      <b>Late Minutes:</b> ${lateMinutes}
      <b>Time:</b> ${moment(timestamp).tz('Asia/Tashkent').format('YYYY-MM-DD HH:mm:ss')}
      <b>Image:</b> ${image}
    `;
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });

    res.status(201).json(faceLog);
  } catch (error) {
    console.error('Error logging face data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to verify face descriptors
app.post('/api/verify', async (req, res) => {
  const { descriptor } = req.body;
  const threshold = 0.6; // Adjust the threshold as needed

  try {
    const users = await User.find({});
    let matchedUser = null;

    for (const user of users) {
      for (const savedDescriptor of user.descriptors) {
        // Mock distance calculation for demonstration
        const distance = 0.5; // Example distance value
        if (distance < threshold) {
          matchedUser = user;
          break;
        }
      }
      if (matchedUser) break;
    }

    res.status(200).json(matchedUser);
  } catch (error) {
    console.error('Error verifying face data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
