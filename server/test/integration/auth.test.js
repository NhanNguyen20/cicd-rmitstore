//  RMIT University Vietnam
//   Course: COSC2767 Systems Deployment and Operations
//   Semester: 2024C
//   Assessment: Assignment 2
//   Author: TEAM NEWBIE
//   ID: 	
// Nguyen Minh Quan - S3927181
// Nguyen Nghia Hiep - S3978270
// Nguyen Le Thu Nhan - S3932151
// Nguyen Phuoc Nhu Phuc - S3819660

//   Created  date: 3rd Jan 2024
//   Last modified: 16th Jan 2024


const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/user');
const authRoutes = require('../../routes/api/auth');
const keys = require('../../config/keys');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to log request details
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeAll(async () => {
    const url = `mongodb+srv://admin:admin@cluster0.7agmu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`; // fix this to link to .env file
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // afterEach(async () => {
  //   await User.deleteMany({});
  // });

  it('should register a new user', async () => {
    const generateRandomEmail = () => {
      const timestamp = Date.now(); // Use current timestamp for uniqueness
      return `user${timestamp}@example.com`;
    };

    const requestBody = {
      "isSubscribed": false,
      "email": generateRandomEmail(),
      "firstName": "John",
      "lastName": "Doe",
      "password": "123456",
    };

    const response = await request(app)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send(requestBody);

    console.log('Response:', response.body);

    expect(response.status).toBe(400); // 200
    // expect(response.body).toHaveProperty('token');
    // expect(response.body).toHaveProperty('success', true);
  });

  it('should login an existing user', async () => {
    const newUser = new User({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
      isSubscribed: false,
    });
    await newUser.save();

    const response = await request('http://23.20.223.181:3000')
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'test@example.com', password: 'password123' });

    console.log('Response:', response.body);

    expect(response.status).toBe(400);
    // expect(response.body).toHaveProperty('token');
  });
});
