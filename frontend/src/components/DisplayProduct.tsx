

import { ChangeEvent, useState} from 'react';

import { Product } from '../models/Product';
import moment from "moment-timezone"
moment.tz.setDefault('Europe/Stockholm');
  moment.locale('sv');





interface  Props{
    userName:string
    setUserName: (userName: string) => void;
    currentBid:number 
    setCurrentBid:(currentBid: number) => void;
    makeBid:() => void;
    selectedProduct: Product
message: string
setHighestBidUser:(highestBidUser:string) => void
setHighestBid:(highestBid:number) => void
highestBidUser:string
 highestBid:number
timeLeft:string

}




export const DisplayProduct = ({timeLeft,  message, userName, setUserName, currentBid, setCurrentBid, makeBid, selectedProduct, setHighestBidUser, setHighestBid, highestBidUser, highestBid, }:Props) => {

const [showWinner, setShowWinner] = useState<boolean>(false)

    if(highestBidUser && highestBid){
setHighestBidUser('')
setHighestBid(0)
}

    if(selectedProduct.bids.length >= 1 ){
selectedProduct.bids.sort((a, b) =>{return b.amount - a.amount})
setHighestBidUser(selectedProduct.bids[0].bidder)
setHighestBid(selectedProduct.bids[0].amount)

}



  return  ( 
    <> 
 
{showWinner ?   <>


  {selectedProduct.bids.map((bid, i) => {
       if(i <= 0 ){

return(
        <h2 key={i} className='selectedProduct___li'>
     Vinnare av {selectedProduct.name} är {bid.uniqUser}  {bid.amount}kr 
      </h2>

)


       }}
         
       )}










 </> :     















    <>


  <label htmlFor="user"> användare: </label>
  <input
  id='user'
   type="text"
   value={userName}
   onChange={(e: ChangeEvent<HTMLInputElement>) =>
    setUserName(e.target.value)}
 />
 <label htmlFor='bid'> bud: </label>
 <input
 id='bid'
   type="number"
   value={currentBid}
   onChange={(e:ChangeEvent<HTMLInputElement>) => setCurrentBid(+e.target.value)}
 /> 
 <button onClick={makeBid}>Lägg bud</button> 
 


 <h3>{selectedProduct.name}</h3>

 <p> Aktion avslutas {timeLeft}  </p>

</>

}

 

<section>
   <div>
   
     <ul>
       {selectedProduct.bids.map((bid, i) => {
       if(i <= 2 ){

return(
        <li key={i} className='selectedProduct___li'>
    {bid.amount}kr  {bid.uniqUser}   {bid.time}
      </li>

)


       }}
         
       )}
     </ul>
     <p>  {message} </p>
    
   </div>
 </section>





</>

)
}


