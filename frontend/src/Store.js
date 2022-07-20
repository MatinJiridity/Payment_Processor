import React from 'react';
import { ethers } from 'ethers';
//axios: liabrary to do http requests we are going to use it to hit the api of our backend
import axios from 'axios';

const API_URL = 'http://localhost:4000';

const ITEMS = [
    {
        id: 1, price: ethers.utils.parseEther('100')
    },
    {
        id: 2, price: ethers.utils.parseEther('200')
    }
];

function Store({ paymentProcessor, dai }) {

    const buy = async item => {
        //first we need to generate the payment id from the baclend
        const response1 = await axios.get(`${API_URL}/api/getPaymentId/${item.id}`);

        //second approve the payment processor to spend our dai
        const tx1 = await dai.approve(paymentProcessor.address, item.price);
        await tx1.wait();

        const tx2 = await paymentProcessor.pay(item.price, response1.data.paymentId); //we need pass the paymentId so thats going to be content in the respons1 , respons1 object  we got from the backend dot data this data coms from the axios ligrary 
        console.log(tx2)
        await tx2.wait();

        await new Promise(resolve => setTimeout(resolve, 7000));

        //get our download url
        const respons2 = await axios.get(`${API_URL}/api/getItemUrl/${response1.data.paymentId}`);
        console.log(respons2);
        alert(`Item link: ${respons2.data.url}`);

    };

    return (
        <ul className='list-group'> <h6>Wellcom to Store</h6>

            <div class="list-group">
                <button type="button" class="list-group-item list-group-item-action active" aria-current="true">
                    Click to Buy Items
                </button>
                <button type="button" class="list-group-item list-group-item-action" onClick={() => buy(ITEMS[0])}>Item: 1 &nbsp;&nbsp;&nbsp;<span className='text-muted'>100 DAI</span> </button>
                <button type="button" class="list-group-item list-group-item-action" onClick={() => buy(ITEMS[1])}>Item: 2 &nbsp;&nbsp;&nbsp;<span className='text-muted'>200 DAI</span></button>

            </div>

        </ul>
    )
}
export default Store;
