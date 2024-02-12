const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleeware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gkftdz7.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Collection
    const techCollection = client.db("techTrove").collection("product");
    const brandCollection = client.db("techTrove").collection("brand");

    // GET tech
    app.get("/tech", async (req, res) => {
      const result = await techCollection.find().toArray();
      res.send(result);
    });
    // GER a specific _id for tech
    app.get("/tech/:brand", async (req, res) => {
      const Brand = req.params.brand;
      const qurry = { brand: Brand };
      const result = await techCollection.find(qurry).toArray();
      res.send(result);
    });

    // POST
    app.post("/tech", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await techCollection.insertOne(newCoffee);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("TECHtrove Server is running");
});
app.listen(port, () => {
  console.log(`TechTrove is runing on:${port}`);
});
