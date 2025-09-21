"use client";

import UpdateDailyAvailability from "./admin/UpdateDailyAvailability";
import Report from "./admin/Report";
import Login from "./login/Login";
import AdminDashboard from "./admin/AdminDashboard";
import ViewAllOrders from "./admin/ViewAllOrders";
import Settings from "./admin/Settings";
import AddDeliveryPersonform from "./admin/AddDeliveryPerson";
import AddShopForm from "./admin/AddShop";


export default function Home() {
  const isTest = true;
  if(isTest){
    return (
      <div>
       <AddShopForm/>
       </div>)
       }
  return (
   <div>
    <Login/>
   </div>
  );
}
