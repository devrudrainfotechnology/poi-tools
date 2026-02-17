let map = L.map('map').setView([31.6340, 74.8723], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
.addTo(map);

let panorama = new google.maps.StreetViewPanorama(
document.getElementById("streetview"),
{
position:{lat:31.6340,lng:74.8723},
pov:{heading:0,pitch:0},
zoom:1
});

let mode = "";

let markers = [];

let poiData = [];

function setDisplayMode()
{
mode="display";
alert("Click map to set DISPLAY location");
}

function setBuildingMode()
{
mode="building";
alert("Click map to set BUILDING location");
}

map.on("click",function(e)
{

if(mode==="display")
{
document.getElementById("displayLat").value=e.latlng.lat;
document.getElementById("displayLng").value=e.latlng.lng;

panorama.setPosition({
lat:e.latlng.lat,
lng:e.latlng.lng
});

addMarker(e.latlng,"display");

}

if(mode==="building")
{
document.getElementById("buildingLat").value=e.latlng.lat;
document.getElementById("buildingLng").value=e.latlng.lng;

addMarker(e.latlng,"building");

}

});

function addMarker(latlng,type)
{

let marker=L.marker(latlng,{draggable:true}).addTo(map);

marker.on("dragend",function(e)
{

let pos=e.target.getLatLng();

if(type==="display")
{
document.getElementById("displayLat").value=pos.lat;
document.getElementById("displayLng").value=pos.lng;
}

if(type==="building")
{
document.getElementById("buildingLat").value=pos.lat;
document.getElementById("buildingLng").value=pos.lng;
}

});

marker.on("contextmenu",function()
{

if(confirm("Delete marker?"))
{
map.removeLayer(marker);
}

});

markers.push(marker);

}

document.getElementById("kmlUpload")
.addEventListener("change",function(e)
{

for(let file of e.target.files)
{

let reader=new FileReader();

reader.onload=function(x)
{

let kml=new DOMParser()
.parseFromString(x.target.result,"text/xml");

let layer=new L.KML(kml);

map.addLayer(layer);

map.fitBounds(layer.getBounds());

};

reader.readAsText(file);

}

});

function savePOI()
{

let obj=
{

name:document.getElementById("name").value,
category:document.getElementById("category").value,
subcategory:document.getElementById("subcategory").value,
displayLat:document.getElementById("displayLat").value,
displayLng:document.getElementById("displayLng").value,
buildingLat:document.getElementById("buildingLat").value,
buildingLng:document.getElementById("buildingLng").value

};

poiData.push(obj);

alert("Saved");

}
