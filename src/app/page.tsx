"use client";
import Login from "./login/Login";
import ShopDashboard from "./shops/ShopDashboard";
import DeliveryDashboardPage from "./delivery/delivery-dashboard/page";


export default function Home() {
  const isTest =true;
  if(isTest){
    return (
      <div>
       <DeliveryDashboardPage/>
       </div>)
       }
  return (
   <div>
    <Login/>
   </div>
  );
}
