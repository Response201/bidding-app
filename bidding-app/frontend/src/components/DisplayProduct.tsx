
import { ChangeEvent } from 'react';
import { Product } from '../models/Product';
import moment from 'moment';




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
}

export const DisplayProduct = ({message, userName, setUserName, currentBid, setCurrentBid, makeBid, selectedProduct, setHighestBidUser, setHighestBid, highestBidUser, highestBid}:Props) => {

  moment.locale('sw'); // set this instance to use French
  const l =moment().format('LLLL'); // dimanche 15 juillet 2012 11:01
console.log(l)
    const m = moment(selectedProduct.ending, "YYYY-MM-DD").fromNow();


    if(highestBidUser && highestBid){
setHighestBidUser('')
setHighestBid(0)
}

    if(selectedProduct.bids.length >= 1 && highestBidUser && highestBidUser){
selectedProduct.bids.sort((a, b) =>{return b.amount - a.amount})
setHighestBidUser(selectedProduct.bids[0].bidder)
setHighestBid(selectedProduct.bids[0].amount)

}








  return  (       
 
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
 <button onClick={  makeBid}>Lägg bud</button>
 <section>
   <div>
     <h3>{selectedProduct.name}</h3> <p> Aktion avslutas om: { m } </p>
     <ul>
       {selectedProduct.bids.map((bid, i) => {
       if(i <= 2){
return(
        <li key={i} className='selectedProduct___li'>
        {bid.amount} - bidder {i+1} - {bid.time}
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


