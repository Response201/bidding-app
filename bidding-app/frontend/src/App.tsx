import React, { useEffect, useState } from "react";
import "./App.css";
import { Socket, io } from "socket.io-client";
import { Product } from "./models/Product";
import { DisplayProduct } from "./components/DisplayProduct";
import moment from 'moment';
import 'moment/dist/locale/sv';



function App() {
  moment.locale('sv');
  const [socket, setSocket] = useState<Socket>();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [userName, setUserName] = useState("");
  const [currentBid, setCurrentBid] = useState(0);
  const [message, setMessage] = useState<string>("")
  const [highestBidUser, setHighestBidUser] = useState<string>("")
  const [highestBid, setHighestBid] = useState<number>(0)





  useEffect(() => {
    if (socket) return;

    const s = io("http://localhost:3000");

    s.on("product_list", (products: Product[]) => {
      setProducts(products);
    });

    s.on("bid_accepted", (product: Product) => {
      setSelectedProduct(product);
    });


    setSocket(s);
  }, [setSocket, socket]);



  const handleClick = (id: string) => {
    socket?.emit("join_room", id, (product: Product) => {
      console.log("Joined room: ", product);
      setSelectedProduct(product);
    });
  };

  const makeBid = () => {
   if(  highestBid > currentBid ){
    setMessage('du har anget ett för lågt belopp')
    setTimeout(() => {
      setMessage('')
    }, 3000);}
    else if( highestBidUser === userName ){
      setMessage('du har redan det högsta budet')
setTimeout(() => {
  setMessage('')
}, 3000);
    }
    else if( highestBid < currentBid && highestBidUser !== userName){

      socket?.emit("make_bid", {
        amount: currentBid,
        productId: selectedProduct?.id,
        bidder: userName,
        time:moment().format("MMMM Do")
      });
      setUserName('')
      setCurrentBid(0)



    }

  };

  return (
    <>
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => {
            handleClick(product.id);
          }}
        >
          {product.name}
        </div>
      ))}

      {selectedProduct && <DisplayProduct highestBidUser={highestBidUser}
 highestBid={highestBid} message={message} setHighestBid={setHighestBid} setHighestBidUser={setHighestBidUser} userName={userName} setUserName={setUserName} currentBid={currentBid} setCurrentBid={setCurrentBid} makeBid={makeBid} selectedProduct={selectedProduct} />}
      </>
  )
   }


export default App;
