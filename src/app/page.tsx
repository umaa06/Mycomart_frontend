"use client";
import Login from "./login/Login";
import ShopDashboard from "./shops/ShopDashboard";
import DeliveryDashboardPage from "./delivery/delivery-dashboard/page";
import DeliveryHistoryPage from "./delivery/DeliveryHistory";

export default function Home() {
  const isTest =true;
  if(isTest){
    return (
      <div>
       <DeliveryHistoryPage/>
       </div>)
       }
  return (
   <div>
    <Login/>
   </div>
  );
}
