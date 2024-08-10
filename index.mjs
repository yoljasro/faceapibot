import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import AdminBro from 'admin-bro';
import AdminBroExpress from '@admin-bro/express';
import AdminBroMongoose from '@admin-bro/mongoose';
import bodyParser from 'body-parser';
import moment from 'moment-timezone';
import cors from 'cors'

// Mongoose model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  recognizedAt: { type: Date, required: true },
});

const User = mongoose.model('User', UserSchema);

// Create an Express application
const app = express();
const server = http.createServer(app);

// Connect to MongoDB
mongoose.connect('mongodb+srv://saidaliyevjasur450:WY6J8XejQg7ssd8d@facebot.xq2i7gl.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// AdminBro setup
AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
  resources: [{
    resource: User,
    options: {
      properties: {
        recognizedAt: {
          type: 'datetime',
          isVisible: { list: true, show: true, edit: false, filter: true },
          components: {
          },
        },
      },
    },
  }],
  rootPath: '/admin',
});

const adminRouter = AdminBroExpress.buildRouter(adminBro);
app.use(adminBro.options.rootPath, adminRouter);

// Middleware
app.use(cors())
app.use(bodyParser.json());

// Routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user info' });
  }
});

app.post('/api/recognize', async (req, res) => {
  const { name } = req.body;
  
  // Toshkent vaqtini olish
  const recognizedAt = moment.tz('Asia/Tashkent').toDate();

  try {
    const newUser = new User({ name, recognizedAt });
    await newUser.save();
    res.status(200).json({ message: 'User recognized and data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving user recognition data' });
  }
});

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on port ${port}`));
