"use client";
import Report from "./admin/Report";
import Login from "./login/Login";


export default function Home() {
  const isTest =true;
  if(isTest){
    return (
      <div>
       <Report/>
       </div>)
       }
  return (
   <div>
    <Login/>
   </div>
  );
}
