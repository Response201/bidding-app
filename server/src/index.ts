import { Product } from "./models/Product";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Bid } from "./models/Bid";
import moment from "moment-timezone"
moment.tz.setDefault('Europe/Stockholm');
  moment.locale('sv');

let products: Product[] = [
  {
    id: "abc123",
    name: "Bike",
    description: "A very nice bike",
    price: 1000,
    highestBid: 0,
    highestBidder: "",
    ending:"2024-03-07 21:27",
   
    bids: [
      { amount: 100, productId: "abc123", bidder: "Kalle", time:'2024-03-07 15:12:04', uniqUser:'bidder 1' },
      { amount: 200, productId: "abc123", bidder: "Pelle", time: '2024-03-07 16:12:04', uniqUser:'bidder 2' },
    ],
  },
  {
    id: "qwe321",
    name: "Car",
    description: "A very nice car",
    price: 50000,
    highestBid: 0,
    highestBidder: "",
    ending:"2024-03-08 12:10:15",

    bids: [],
  },
];





const PORT = 3000;
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {  
  console.log("a user connected");


  socket.emit(
    "product_list",
    products.map((p) => {
      moment.tz.setDefault('Europe/Stockholm');
        if (moment(p.ending, "YYYY-MM-DD HH:mm:ss").isAfter(moment())) {
          
            return { id: p.id, name: p.name };
        } else {
            return '';
        }
    }));



  
 

 
    function sendTimeUpdate() {
     
      socket.emit('time_update', new Date().toISOString());



      socket.emit(
        "product_list",
        products.map((p) => {
          moment.tz.setDefault('Europe/Stockholm');
            if (moment(p.ending, "YYYY-MM-DD HH:mm:ss").isAfter(moment())) {
              
                return { id: p.id, name: p.name };
            } else {
            
                return '';
            }
        }));

  }
  
  // Uppdatera tidsinformation varje sekund
  setInterval(sendTimeUpdate, 5000); // Uppdatera varje sekund
  



  socket.on('time', (id: string, callback) => {
    moment.tz.setDefault('Europe/Stockholm');
    const hello = products.find((p) => p.id === id)
 
    if(hello)
            
           callback(moment(hello.ending, "YYYY-MM-DD HH:mm:ss").fromNow())
          
          
           
           
});























  socket.on("join_room", (id: string, callback) => {
    socket.rooms.forEach((room) => {
      console.log("Leaving room: ", room);

      socket.leave(room);
    });

    console.log("Joining room: ", id);

    socket.join(id);

    callback(products.find((p) => p.id === id));
  });





  // Callback är den funktion som skickas med i händelsen från klienten
  socket.on("make_bid", (bid: Bid) => {


    let product = products.find((p) => p.id === bid.productId);
    if (product) {
   
      const existingBid = product.bids.find((p) => p.bidder === bid.bidder);

      if (existingBid) {
        
          product.bids.push({ ...bid, uniqUser: existingBid.uniqUser });
      } else {
    
          const length = product.bids.length + 1;
          const uniqUserName = `bidder ${length}`;
          product.bids.push({ ...bid, uniqUser: uniqUserName });
      }

      console.log(product.bids); 

     
      io.to(bid.productId).emit(
          "bid_accepted",
          product
      );
  } else {
      console.log("Product not found");
  }

   
     })














  


 
});



















server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
