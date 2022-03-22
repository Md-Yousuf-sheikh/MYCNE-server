const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const express = require('express')
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express()

// middleware
app.use(cors());
app.use(express.json());

//  mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.trmxc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('MYCNE');
        const productsCollection = database.collection('products');
        const ordersCollection = database.collection('orders');
        const appointmentCollection = database.collection('appointment')
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews')


        //  ======================= Product Collection =======================//
        //  get 
        app.get('/appointment', async (req, res) => {
            const cursor = appointmentCollection.find({});
            const appointment = await cursor.toArray();
            res.send(appointment)
        })
        // post
        app.post('/appointment', async (req, res) => {
            const newPost = req.body;
            const result = await appointmentCollection.insertOne(newPost);
            res.json(result);
        }) +

            // Delete product inside the products
            app.delete('/appointment:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const result = await appointmentCollection.deleteOne(query);
                res.json(result)
            })

        //  ======================= Product Collection =======================//
        //  get 
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })
        // post
        app.post('/products', async (req, res) => {
            const newPost = req.body;
            const result = await productsCollection.insertOne(newPost);
            res.json(result);
        })

        // Delete product inside the products
        app.delete('/products:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result)
        })
        //  ======================= Order Collection =======================//

        // get all
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders)
        })

        // post 
        app.post('/order', async (req, res) => {
            const newPost = req.body;
            const result = await ordersCollection.insertOne(newPost);
            res.json(result);
        })

        // Delete 
        app.delete('/orders:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })
        //  ======================= Reviews Collection =======================//
        //  get 
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews)
        })
        // post
        app.post('/reviews', async (req, res) => {
            const newPost = req.body;
            const result = await reviewsCollection.insertOne(newPost);
            res.json(result);
        }) +
        // Delete 
        app.delete('/reviews:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.json(result)
        })

        //  ======================= User Collection =======================//
        //  user add and admin check
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        })
        // user add post
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

        //  user to post users
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        })

        // user update and insert   (upsert)
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })

        // Admin user PUT
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })
        //  check admin states
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })

    }
    finally {
        // await client.close():
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Watch MW-watches server is running!!')
})

app.listen(port, () => {
    console.log('Server running at port', port)
})
