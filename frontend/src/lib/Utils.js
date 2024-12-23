export function formatMessageTime(date) {
   const d=new Date();
   const hours=d.getHours();
   const min=d.getMinutes();
   const sec=[d.getMilliseconds()]
   
  
   return hours+":"+min+":"+sec
   
  }