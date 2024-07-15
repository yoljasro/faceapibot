import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import axios from 'axios';
import moment from 'moment-timezone';
import path from 'path';
import { fileURLToPath } from 'url';

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
  images: [String]
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

app.post('/api/upload', upload.array('images'), async (req, res) => {
  const { employeeId, name, role } = req.body;
  const imagePaths = req.files.map((file) => file.path);

  try {
    const newUser = new User({
      employeeId,
      name,
      role,
      images: imagePaths
    });
    await newUser.save();

    // Log the upload to the backend
    const timestamp = new Date();
    const status = 'Uploaded';
    const faceLog = new FaceLog({
      employeeId,
      name,
      role,
      image: imagePaths[0], // Assuming the first image as the main image
      timestamp,
      lateMinutes: 0, // Assuming no late minutes for upload
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
      <b>Late Minutes:</b> 0
      <b>Time:</b> ${moment(timestamp).tz('Asia/Tashkent').format('YYYY-MM-DD HH:mm:ss')}
      <b>Image:</b> ${imagePaths[0]}
    `;
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
