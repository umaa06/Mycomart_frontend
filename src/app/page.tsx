"use client";
import AdminDashboard from "./admin/AdminDashboard";
import Login from "./login/Login";


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
