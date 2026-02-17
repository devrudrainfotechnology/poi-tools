
let map;
let panorama;

let mode = "";

let displayMarker = null;
let buildingMarker = null;

let poiData = [];

initMap();

function initMap(){

let center = {lat:31.6340, lng:74.8723};

map = new google.maps.Map(document.getElementById("map"),{
zoom:13,
center:center
});

panorama = new google.maps.StreetViewPanorama(
document.getElementById("streetview"),
{
position:center,
pov:{heading:0,pitch:0}
});

map.addListener("click", function(e){

let lat = e.latLng.lat();
let lng = e.latLng.lng();

panorama.setPosition({lat:lat,lng:lng});

if(mode=="display"){

if(displayMarker) displayMarker.setMap(null);

displayMarker = new google.maps.Marker({
position:e.latLng,
map:map,
icon:"http://maps.google.com/mapfiles/ms/icons/red-dot.png"
});

document.getElementById("display_lat").value=lat;
document.getElementById("display_lng").value=lng;

}

if(mode=="building"){

if(buildingMarker) buildingMarker.setMap(null);

buildingMarker = new google.maps.Marker({
position:e.latLng,
map:map,
icon:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
});

document.getElementById("build_lat").value=lat;
document.getElementById("build_lng").value=lng;

}

});

document.getElementById("kmlFile").addEventListener("change",loadKML);

}

function setDisplayMode(){
mode="display";
alert("Click map to set DISPLAY location");
}

function setBuildingMode(){
mode="building";
alert("Click map to set BUILDING location");
}

function deleteLast(){

if(buildingMarker){
buildingMarker.setMap(null);
buildingMarker=null;
}

else if(displayMarker){
displayMarker.setMap(null);
displayMarker=null;
}

}

function savePOI(){

let poi={
name:poi_name.value,
category:category.value,
subcat:subcat.value,
landline:landline.value,
mobile:mobile.value,
mobile2:mobile2.value,
display_lat:display_lat.value,
display_lng:display_lng.value,
build_lat:build_lat.value,
build_lng:build_lng.value
};

poiData.push(poi);

alert("Saved");

}

function exportCSV(){

let csv="Name,Category,SubCat,Landline,Mobile,Mobile2,DisplayLat,DisplayLng,BuildLat,BuildLng\n";

poiData.forEach(p=>{

csv+=`${p.name},${p.category},${p.subcat},${p.landline},${p.mobile},${p.mobile2},${p.display_lat},${p.display_lng},${p.build_lat},${p.build_lng}\n`;

});

let blob=new Blob([csv]);

let a=document.createElement("a");
a.href=URL.createObjectURL(blob);
a.download="POI_Data.csv";
a.click();

}

function exportKML(){

let kml='<?xml version="1.0"?><kml><Document>';

poiData.forEach(p=>{

kml+=`<Placemark>
<name>${p.name}</name>
<Point>
<coordinates>${p.display_lng},${p.display_lat}</coordinates>
</Point>
</Placemark>`;

});

kml+='</Document></kml>';

let blob=new Blob([kml]);

let a=document.createElement("a");
a.href=URL.createObjectURL(blob);
a.download="POI_Data.kml";
a.click();

}

function loadKML(event){

let files=event.target.files;

for(let file of files){

let reader=new FileReader();

reader.onload=function(e){

let xml=new DOMParser().parseFromString(e.target.result,"text/xml");

let geojson=toGeoJSON.kml(xml);

geojson.features.forEach(f=>{

let coords=f.geometry.coordinates;

new google.maps.Marker({
position:{lat:coords[1],lng:coords[0]},
map:map,
icon:"http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
});

});

};

reader.readAsText(file);

}

}
