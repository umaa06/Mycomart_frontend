"use client";
import EditShop from "./admin/EditShop";
import Login from "./login/Login";


export default function Home() {
  const isTest =true;
  if(isTest){
    return (
      <div>
       <EditShop/>
       </div>)
       }
  return (
   <div>
    <Login/>
   </div>
  );
}
