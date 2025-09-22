"use client";
import Login from "./login/Login";
import ShopDashboard from "./shops/ShopDashboard";

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
