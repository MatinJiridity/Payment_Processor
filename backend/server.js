const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const ethers = require('ethers');
const PaymentProcessor = require('../frontend/src/abis/PaymentProcessor.json');
const { Payment } = require('./db.js');
const { url } = require('@koa/router');

const app = new Koa;
const router = new Router;
const items = {
    '1': { id: 1, url: 'http://UrlToDownloadItem1' },
    '2': { id: 2, url: 'http://UrlToDownloadItem2' },
}

//we need to listen to the event from the blockchain to update status in mongoDB
const listenToEvent = () => {

    console.log('listenToEvent!')


    const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545'); //ganache
    const networkId = '5777';

    //define contract object
    const paymentProcessor = new ethers.Contract(
        PaymentProcessor.networks[networkId].address,
        PaymentProcessor.abi,
        provider
    );

    //listen to event smart contract
    paymentProcessor.on('PaymentDone', async (payer, amount, paymentId, date) => {

        console.log(`
        from: ${payer} 
        amount: ${ethers.utils.formatEther(amount.toString())} 
        paymentId: ${paymentId} 
        date: ${(new Date(date.toNumber() * 1000)).toLocaleString()}
        `);

        //if this payment already exist in the database we are going ti update its status 
        const payment = await Payment.findOne({ id: paymentId });
        if (payment) {
            payment.paid = true;
            await payment.save();
            // console.log(payment)
        }

    });
}

//after the customer click purchase button so we ask the backend to generate payment id
//we have to specify wich item we want purchase here as parameter to url : item id , then call back a async func
router.get('/api/getPaymentId/:itemId', async ctx => {
    //gnenrate random paymrnt id 
    const paymentId = (Math.random() * 10000).toFixed(0); //remove decimal part

    //create payment entry in our mongoDB database
    await Payment.create({
        id: paymentId,
        itemId: ctx.params.itemId,
        paid: false
    })

    // ctx.body = 'hello world';     this is method how you return response
    ctx.body = { paymentId };  //paymentId:paymentId
});

//we need to create anther route to get the url of the item that we purchase 
router.get('/api/getItemUrl/:paymentId', async ctx => {
    //first fetch the payment id from the mongoDB database
    const payment = await Payment.findOne({ id: ctx.params.paymentId }); //use Payment Modol. findOne() to find one single item and id will be paymentId that was provided in the url  

    //if we finde a corresponding entry and the payment has been done
    if (payment && payment.paid === true) {
        console.log(payment.paid)
        ctx.body = {
            url: items[payment.itemId].url
        };

    } else {
        console.log(payment.paid)
        ctx.body = {
            url: ''
        };
    }
});



//configure out our app object
//first: we want to use cors to be able recive requests from other urls  
//then configure out our routes to be use by rhe app   
app
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods());

//we can finaly start the server 
app.listen(4000, () => {
    console.log('Server runing on port 4000');
});


listenToEvent();
