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
        const productCollection = client.db("outshade_jobs_tasks").collection("user_info");
        const catagoryCollection = client.db("outshade_jobs_tasks").collection("catagory_info");

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