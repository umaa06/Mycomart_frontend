"use client";
import AdminDashboard from "./admin/AdminDashboard";
import Login from "./login/Login";
import ManageDeliveryPeople from "./admin/ManageDeliveryPeople";


export default function Home() {
  const isTest =true;
  if(isTest){
    return (
      <div>
       <ManageDeliveryPeople/>
       </div>)
       }
  return (
   <div>
    <Login/>
   </div>
  );
}
