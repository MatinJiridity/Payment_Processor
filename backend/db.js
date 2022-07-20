//import mongoose driver
const mongoose = require('mongoose');

//with mongoos connect to our database 
mongoose.connect(
    'mongodb+srv://blockchain-ecommerce:9VI7CRszMBTF23mK@cluster0.ebzatdj.mongodb.net/blockchain-ecommerce',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

//we need to define what we are going to store in our database
//in mongooDB we  store object in collection
const paymentSchema = new mongoose.Schema({
    id: String,
    itemId: String,
    paid: Boolean
});
const Payment = mongoose.model('Payment', paymentSchema);

//we are going to use Payment in another file
module.exports = {Payment}; 