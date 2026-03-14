async function load(){

   const res = await fetch(API_URL+"?action=list");
   const data = await res.json();

   let html="";

   data.forEach(d=>{

      html+=`
         <div>

         ${d.tanggal} - ${d.waktu}
         ${d.ket}

         <button onclick="qadha('${d.id}')">
            Qadha
         </button>

         </div>
      `;

   });

   document.getElementById("list").innerHTML = html;

}

load();