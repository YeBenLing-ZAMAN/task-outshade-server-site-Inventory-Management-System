const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



const port = process.env.PORT || 5000;


/* middleware */
app.use(cors());
app.use(express.json());

/* basic connect with mongodb and create a client */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.phion.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const userCollection = client.db("outshade_jobs_tasks").collection("user_info");
        const catagoryCollection = client.db("outshade_jobs_tasks").collection("catagory_info");
        const productCollection = client.db("outshade_jobs_tasks").collection("product_info");

        /* authencation routes */
        app.post('/signin', async (req, res) => {
            // const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.get('/login/:email', async (req, res) => {
            const email = req.params.email;
            const user = await userCollection.findOne({ email: email });
            const isUser = user?.email === email;
            isUser ? res.send(user) : res.send({ user: false });
        })


        /* catagory routes */
        app.get('/catagory_list', async (req, res) => {
            const catagory = await catagoryCollection.find().toArray();
            // console.log(catagory);
            res.send(catagory);
        })
        
        app.get('/catagory_list/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const catagory = await catagoryCollection.findOne(filter);
            res.send(catagory);
        })

        app.post('/add_catagory', async (req, res) => {
            const catagory = req.body;
            // console.log(catagory);
            const result = await catagoryCollection.insertOne(catagory);
            res.send(result);
        })

        app.delete('/delete_catagory/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const catagory = await catagoryCollection.findOne(filter);
            const query = { catagory: catagory.catagory }
            const productDelete = await productCollection.deleteMany(query);
            const result = await catagoryCollection.deleteOne(filter);
            res.send(result);
        })



        /* product routes */
        app.get('/product_list', async (req, res) => {
            const products = await productCollection.find().toArray();
            // console.log(products);
            res.send(products);
        })

        app.get('/product_list/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const product = await productCollection.findOne(filter);
            res.send(product);
        })

        app.post('/add_product', async (req, res) => {
            const product = req.body;
            // console.log(product);
            const result = await productCollection.insertOne(product);
            res.send(result);
        })

        app.patch('/update_product/:id', async (req, res) => {
            const id = req.params.id;
            const updateProductInfo = req.body;
            const filter = { _id: ObjectId(id) };
            // console.log(updateProductInfo);
            // res.send({data: true});

            const updateDoc = {
                $set: {
                    name: updateProductInfo.name,
                    quantity: updateProductInfo.quantity,
                    price: parseInt(updateProductInfo.price),
                    catagory: updateProductInfo.catagory
                }
            }
            const result = await productCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.delete('/delete_product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            // console.log(filter);
            const result = await productCollection.deleteOne(filter);
            res.send(result);
        })


    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is found!')
})

app.listen(port, () => {
    console.log(`Ppp listening on port ${port}`)
})