"use client";
import AdminDashboard from "./admin/AdminDashboard";
import Login from "./login/Login";
import ManageShops from "./admin/ManageShop";
import ViewAllOrders from "./admin/ViewAllOrders";


export default function Home() {
  const isTest =true;
  if(isTest){
    return (
      <div>
       <ManageShops/>
       </div>)
       }
  return (
   <div>
    <Login/>
   </div>
  );
}
