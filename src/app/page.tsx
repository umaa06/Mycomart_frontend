"use client";
import Login from "./login/Login";
import UpdateDailyAvailability from "./admin/update-daily-availability /page";

export default function Home() {
  const isTest =true;
  if(isTest){
    return (
      <div>
       <UpdateDailyAvailability/>
       </div>)
       }
  return (
   <div>
    <Login/>
   </div>
  );
}
