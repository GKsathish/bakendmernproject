    // // app.js

    // const express = require('express');
    // const { MongoClient, ObjectId } = require('mongodb');

    // const app = express();
    // const port = process.env.PORT || 3000;

    // // MongoDB connection URL
    // const url = 'mongodb://localhost:27017';
    // const dbName = 'post';

    // app.use(express.json());

    // // Connect to MongoDB
    // MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    //     .then(client => {
    //         const db = client.db(dbName);
    //         const collection = db.collection('posts');

    //         // Define routes
    //         app.get('/posts', async (req, res) => {
    //             try {
    //                 const result = await collection.find().toArray();
    //                 res.json(result);
    //             } catch (error) {
    //                 console.error(error);
    //                 res.status(500).json({ error: 'Internal Server Error' });
    //             }
    //         });

    //         app.get('/posts/:id', async (req, res) => {
    //             try {
    //                 const result = await collection.findOne({ _id: ObjectId(req.params.id) });
    //                 if (!result) {
    //                     return res.status(404).json({ error: 'Post not found' });
    //                 }
    //                 res.json(result);
    //             } catch (error) {
    //                 console.error(error);
    //                 res.status(500).json({ error: 'Internal Server Error' });
    //             }
    //         });

    //         // Start server
    //         app.listen(port, () => {
    //             console.log(`Server is running on http://localhost:${port}`);
    //         });
    //     })
    //     .catch(error => {
    //         console.error('Failed to connect to MongoDB:', error);
    //     });

    const express = require('express');
    const { MongoClient, ObjectId } = require('mongodb');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    
    const app = express();
    const port = process.env.PORT || 3000;
    
    // MongoDB connection URL
    const url = 'mongodb://localhost:27017';
    const dbName = 'post';
    const dbName1 = 'satya';
    
    app.use(express.json());
    
    // Connect to MongoDB
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(client => {
            const db = client.db(dbName);
            const db1 = client.db(dbName1);
            const collection = db.collection('posts');
            const collection1 = db1.collection('user');
    
            // Define routes for posts
            app.get('/posts', async (req, res) => {
                try {
                    const result = await collection.find().toArray();
                    res.json(result);
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            });
    
            app.get('/posts/:id', async (req, res) => {
                try {
                    const result = await collection.findOne({ _id: ObjectId(req.params.id) });
                    if (!result) {
                        return res.status(404).json({ error: 'Post not found' });
                    }
                    res.json(result);
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            });
    
            // Define login route
            app.post('/login', async (req, res) => {
                const { username, password } = req.body;
    
                try {
                    // Check if user exists in the database
                    const user = await collection1.findOne({name:username});
                    if (!user) {
                        return res.status(401).json({ message:'Name is not correct',error: 'Invalid credentials' });
                    }
    
                    // Compare password with hashed password
                    const passwordMatch = await collection1.findOne({password:password});
                    if (!passwordMatch) {
                        return res.status(401).json({message:'Password is not correct', error: 'Invalid credentials' });
                    }
    
                    // Generate JWT token
                    const token = jwt.sign({ userId: user._id }, 'your_secret_key');
    
                    // Return token and user information
                    const { _id, name, mail } = user;
                    res.json({ token, user: { _id, name, mail }  });
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            });
    
            // Start server
            app.listen(port, () => {
                console.log(`Server is running on http://localhost:${port}`);
            });
        })
        .catch(error => {
            console.error('Failed to connect to MongoDB:', error);
            process.exit(1); // Exit the process if MongoDB connection fails
        });
    