"use client";
import Login from "./login/Login";
import Profile from "./shops/Profile";

export default function Home() {
  const isTest =false;
  if(isTest){
    return (
      <div>
       <Profile/>
       </div>)
       }
  return (
   <div>
    <Login/>
   </div>
  );
}
