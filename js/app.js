const API_URL = "https://script.google.com/macros/s/AKfycbzRwpT0EN4vAezG8qVhKXSaLsjskC_P6wy85xf9gYi89neuv6z7PNrUkyAcIQOCPkTyLA/exec";

function trackerApp(){

return{

openSholat:false,
openPuasa:false,

tahunFilter:new Date().getFullYear(),

sholatList:[],
puasaList:[],

totalSholat:0,
totalPuasa:0,

formSholat:{
tanggal:"",
nama:"Subuh"
},

formPuasa:{
tanggal:"",
nama:""
},

async loadData(){

let sholat = await fetch(API_URL+"?type=sholat");
let puasa = await fetch(API_URL+"?type=puasa");

this.sholatList = await sholat.json();
this.puasaList = await puasa.json();

this.totalSholat = this.sholatList.length-1;
this.totalPuasa = this.puasaList.length-1;

},

async saveSholat(){

await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
type:"sholat",
tanggal:this.formSholat.tanggal,
nama:this.formSholat.nama
})
});

this.openSholat=false;
this.loadData();

},

async savePuasa(){

await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
type:"puasa",
tanggal:this.formPuasa.tanggal,
nama:this.formPuasa.nama
})
});

this.openPuasa=false;
this.loadData();

}

}

}