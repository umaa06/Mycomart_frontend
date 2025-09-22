"use client";
import DeliveryHistory from "./delivery/DeliveryHistory";
import Login from "./login/Login";
import ViewAllOrders from "./admin/ViewAllOrders";
import Settings from "./admin/Settings";
import AddDeliveryPersonform from "./admin/AddDeliveryPerson";
import ReportPage from "./admin/report/page";


export default function Home() {
  const isTest =true;
  if(isTest){
    return (
      <div>
       <Settings/>
       </div>)
       }
  return (
   <div>
    <Login/>
   </div>
  );
}
