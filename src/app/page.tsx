"use client";
import DeliveryHistory from "./delivery/DeliveryHistory";
import Login from "./login/Login";
import ViewAllOrders from "./admin/ViewAllOrders";
import Setting from "./admin/Setting";
import AddDeliveryPersonform from "./admin/AddDeliveryPerson";
import ReportPage from "./admin/report/page";
import UpdateDailyAvailability from "./admin/UpdateDailyAvailability";
import EditDeliveryPerson from "./admin/EditDeliveryPerson";
import AdminDashboard from "./admin/AdminDashboard";
import AddShopForm from "./admin/AddShop";


export default function Home() {
  const isTest =true;
  if(isTest){
    return (
      <div>
       <AdminDashboard/>
       </div>)
       }
  return (
   <div>
    <Login/>
   </div>
  );
}
