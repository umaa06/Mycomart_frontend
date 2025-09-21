"use client";

import UpdateDailyAvailability from "./admin/UpdateDailyAvailability";
import Report from "./admin/Report";
import Login from "./login/Login";
import AdminDashboard from "./admin/AdminDashboard";
import ViewAllOrders from "./admin/ViewAllOrders";


export default function Home() {
  const isTest = false;
  if(isTest){
    return (
      <div>
       <ViewAllOrders/>
       </div>)
       }
  return (
   <div>
    <Login/>
   </div>
  );
}
