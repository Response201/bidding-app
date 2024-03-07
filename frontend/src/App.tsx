import  { useEffect, useState } from "react"; 
import "./App.css";
import { Socket, io } from "socket.io-client";
import { Product } from "./models/Product";
import { DisplayProduct } from "./components/DisplayProduct";
import moment from 'moment-timezone';
import 'moment/dist/locale/sv';




function App() {
  moment.tz.setDefault('Europe/Stockholm');
  moment.locale('sv');

  const [socket, setSocket] = useState<Socket>();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [userName, setUserName] = useState("");
  const [currentBid, setCurrentBid] = useState(0);
  const [message, setMessage] = useState<string>("")
  const [highestBidUser, setHighestBidUser] = useState<string>("")
  const [highestBid, setHighestBid] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<string>('')
 
  




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
  }, [setSocket, socket, timeLeft]);



  const handleClick = (id: string) => {
    socket?.emit("join_room", id, (product: Product) => {
      setSelectedProduct(product);
setTimeLeft(moment(product.ending, "YYYY-MM-DD HH:mm:ss").fromNow())


    });

    socket?.on('time_update', () => {
      socket?.emit('time', id, (data:string)  => {
      
       
        if(timeLeft !== data){
        setTimeLeft(data)
  
         }
        




      });
  })

  };


  




  const makeBid = () => {
   
     if( highestBidUser === userName ){
      setMessage('du har redan det högsta budet')
setTimeout(() => {
  setMessage('')
}, 3000);
    }else if(  highestBid > currentBid || highestBid === currentBid){
 
      setMessage('du har anget ett för lågt belopp')
      setTimeout(() => {
        setMessage('')
      }, 3000);}
    else if( highestBid < currentBid ){

      socket?.emit("make_bid", {
        amount: currentBid,
        productId: selectedProduct?.id,
        bidder: userName,
        time:moment().format("YYYY-MM-DD HH:mm:ss"),
        uniqUser:""
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

      {selectedProduct && <DisplayProduct highestBidUser={highestBidUser}   timeLeft={timeLeft} 
 highestBid={highestBid} message={message} setHighestBid={setHighestBid} setHighestBidUser={setHighestBidUser} userName={userName} setUserName={setUserName} currentBid={currentBid} setCurrentBid={setCurrentBid} makeBid={makeBid} selectedProduct={selectedProduct} />}
      </>
  )
   }


export default App;
