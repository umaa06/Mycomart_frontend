"use client";
import Login from "./login/Login";
import ShopDashboard from "./shops/ShopDashboard";
import DeliveryDashboardPage from "./delivery/delivery-dashboard/page";
import DeliveryHistoryPage from "./delivery/DeliveryHistory";

export default function Home() {
  const isTest =false;
  if(isTest){
    return (
      <div>
       <ShopDashboard/>
       </div>)
       }
  return (
   <div>
    <Login/>
   </div>
  );
}
