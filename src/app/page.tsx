"use client";
import DeliveryHistory from "./delivery/DeliveryHistory";
import Login from "./login/Login";


export default function Home() {
  const isTest =true;
  if(isTest){
    return (
      <div>
       <DeliveryHistory/>
       </div>)
       }
  return (
   <div>
    <Login/>
   </div>
  );
}
