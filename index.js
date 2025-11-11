const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware----------
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3l8ftnx.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const userCollection = client.db('Movie_Collection').collection('Users');
        const MovieCollection = client.db('Movie_Collection').collection('Movie');
        const FavoriteCollection = client.db('Movie_Collection').collection('FavoriteMovie');
        // Movie data load and client side show-------------
        app.get('/movieInfo', async (req, res) => {
            const allMovieInfo = await MovieCollection.find().toArray();
            res.send(allMovieInfo)
        });
        app.get('/movieDetails/:id', async (req, res) => {
            const id = req.params.id;
            const movieId = { _id: new ObjectId(id) };
            const result = await MovieCollection.findOne(movieId);
            res.send(result)
        });
        app.get('/updateMovie/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await MovieCollection.findOne(query);
            res.send(result)
        })
        // Get Favorite Movie List -------------------
        app.get('/favoriteMovieList', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email }
            const result = await FavoriteCollection.find(query).toArray();
            res.send(result)
        })
        // User-----
        // app.post('/users', async(req, res) => {
        //     const newUser = req.body;
        //     console.log(newUser);
        //     const result = await userCollection.insertOne(newUser);
        //     res.send(result);
        // })
        // User Add Movie Data--------------------
        app.post('/addMovie', async (req, res) => {
            const AddMovie = req.body;
            // console.log(newUser);
            const result = await MovieCollection.insertOne(AddMovie);
            res.send(result);
        });
        // User Add Favorite Data----------
        app.post('/userFavorite', async (req, res) => {
            const FavoriteMovie = req.body;
            const addMovieData = await FavoriteCollection.insertOne(FavoriteMovie)
            res.send(addMovieData)

        });
        // Movie Data Update ---------------------
        app.put('/movieUpdate/:id', async (req, res) => {
            const movieInfo = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = { $set: movieInfo };
            const result = await MovieCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // Delete  Favorite Movie Item ---------------------
        app.delete('/favoriteMovieDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await FavoriteCollection.deleteOne(query);
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('welcome to the backend server........')
});

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
})