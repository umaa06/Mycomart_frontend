"use client";
import DeliveryDashboard from "./Delivery/DeliveryDashboard";
import Login from "./login/Login";


export default function Home() {
  const isTest =true;
  if(isTest){
    return (
      <div>
       <DeliveryDashboard/>
       </div>)
       }
  return (
   <div>
    <Login/>
   </div>
  );
}
