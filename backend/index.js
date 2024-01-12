require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const bodyParser = require('body-parser')

const userRoutes = require('./routes/user')
const productRoutes =  require('./routes/product')
const categoryRoutes =  require('./routes/category')
const orderRoutes =  require('./routes/order')
const auth = require('./middleware/auth');

// express app
const app = express()

// middleware
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // to give access to render images to frontend

app.use('/test/welcome',auth,(req,res)=>{
  res.status(200).json({message:"hi"})
});


// routes
app.use('/api/user', userRoutes);
app.use('/api/product',productRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/order',orderRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })