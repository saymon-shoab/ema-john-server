
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DV_USER}:${process.env.DV_PASS}@cluster0.5h4lz.mongodb.net/${process.env.DV_NAME}?retryWrites=true&w=majority`;




const app = express()
app.use(bodyParser.json());
app.use(cors());


const port = 5000;

app.get('/', (req, res) => {
    res.send("api is working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emajohnstore").collection("products");
  const ordersCollection = client.db("emajohnstore").collection("orders");
     app.post('/addProduct', (req, res)=>{
         const products= req.body;
        // console.log(product)
        productsCollection.insertOne(products)
         .then(result=>{
             console.log(result.insertedCount)
             res.send(result.insertedCount)
         })
     })
     console.log('database connected')

     app.get('/products', (req, res)=>{
        productsCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
     })



     app.get('/product/:key', (req, res)=>{
        productsCollection.find({key: req.params.key})
        .toArray((err,documents)=>{
            res.send(documents[0])
        })
     })

     app.post('/productsByKeys', (req, res)=>{
         const productKeys= req.body;
        productsCollection.find({key: {$in:productKeys}})
        .toArray((err,documents)=>{
            res.send(documents);
        })
     })
    

     app.post('/addOrder', (req, res)=>{
        const order= req.body;
        ordersCollection.insertOne(order)
        .then(result=>{
            console.log(result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })
});


app.listen(process.env.PORT || port)