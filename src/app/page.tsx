"use client";
import DeliveryHistory from "./delivery/DeliveryHistory";
import Login from "./login/Login";
import ViewAllOrders from "./admin/ViewAllOrders";
import Settings from "./admin/Settings";
import AddDeliveryPersonform from "./admin/AddDeliveryPerson";
import AddShopForm from "./admin/AddShop";


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
