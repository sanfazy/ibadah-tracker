const API_URL = "https://script.google.com/macros/s/AKfycbzRwpT0EN4vAezG8qVhKXSaLsjskC_P6wy85xf9gYi89neuv6z7PNrUkyAcIQOCPkTyLA/exec";

function trackerApp(){

return{

menu:'dashboard',

openMenu:false,
openSholat:false,
openPuasa:false,
openModalQodo:false,

sholatList:[],
puasaList:[],

hutangSholat:0,
hutangPuasa:0,

tahunFilter:"",
tahunList:[],

formSholat:{
tanggal:"",
nama:"Subuh"
},

formPuasa:{
tanggal:"",
nama:""
},

formQodo:{
id:"",
type:"",
tanggal_qodo:""
},

get sholatBelum(){

return this.sholatList.filter(i => 
i[4]=='' && i[3]==this.tahunFilter
)

},

get puasaBelum(){

return this.puasaList.filter(i => 
i[4]=='' && i[3]==this.tahunFilter
)

},

get sholatSudah(){

return this.sholatList.filter(i => 
i[4] != '' && i[3]==this.tahunFilter
)

},

get puasaSudah(){

return this.puasaList.filter(i => 
i[4] != '' && i[3]==this.tahunFilter
)

},

async loadData(){

let s = await fetch(API_URL+"?type=sholat")
let p = await fetch(API_URL+"?type=puasa")

this.sholatList = await s.json()
this.puasaList = await p.json()

this.generateTahun()

this.hitungStat()

},

async saveSholat(){

await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
action:"add",
type:"sholat",
tanggal:this.formSholat.tanggal,
nama:this.formSholat.nama
})
})

this.openSholat=false
this.loadData()

},

async savePuasa(){

await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
action:"add",
type:"puasa",
tanggal:this.formPuasa.tanggal,
nama:this.formPuasa.nama
})
})

this.openPuasa=false
this.loadData()

},

openQodo(item,type){

this.formQodo.id=item[0]
this.formQodo.type=type

this.openModalQodo=true

},

async saveQodo(){

await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
action:"qodo",
type:this.formQodo.type,
id:this.formQodo.id,
tanggal_qodo:this.formQodo.tanggal_qodo
})
})

this.openModalQodo=false
this.loadData()

},

generateTahun(){

let tahun = []

this.sholatList.forEach(i=>{
if(i[3]) tahun.push(i[3])
})

this.puasaList.forEach(i=>{
if(i[3]) tahun.push(i[3])
})

tahun = [...new Set(tahun)]

tahun.sort((a,b)=>b-a)

this.tahunList = tahun

if(!this.tahunFilter){
this.tahunFilter = tahun[0]
}

},

hitungStat(){

this.hutangSholat = this.sholatBelum.length
this.hutangPuasa = this.puasaBelum.length

},

$watch('tahunFilter', () => {
this.hitungStat()
})

}

}