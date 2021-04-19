const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { json } = require('body-parser');
const { ObjectId } = require('bson');

const password = 'tlqraorUWfNDTS42';

const uri = "mongodb+srv://node-mongodb-crud:tlqraorUWfNDTS42@cluster0.vihvh.mongodb.net/node-crud-mongo-db?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}))


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});


client.connect(err => {
  const productCollection = client.db("node-crud-mongo-db").collection("products")
  
  // product create
  app.post('/product/store', (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
      console.log(result);
      res.redirect('/')
    })
  })

  // product list
  app.get('/product', (req, res) => {
    productCollection.find({})
    .toArray((err,doc) => {
      res.send (doc);
    })
  })

  // prduct edit data
  app.get('/product/edit/:id',(req, res) => {
    productCollection.find({_id : ObjectId(req.params.id)})
    .toArray((error,document) => {
      res.send(document[0])
    })
  })
  
  // product update 
  app.patch('/product/update/:id',(req,res) => {
    const {name,price,quantity,productTag} = req.body;
    productCollection.updateOne({_id : ObjectId(req.params.id)},
    {
      $set : {name : name,price : price, quantity : quantity,productTag : productTag}
    })
    .then(result => {
      res.send(result.modifiedCount > 0)
    })
  })

  
  // product delete
  app.delete('/product/delete/:id', (req, res) => {
    productCollection.deleteOne({_id : ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })

})


app.listen(3000)