
// Initialize map

var map = L.map('map').setView([31.6340,74.8723],13);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom:22
}).addTo(map);


var mode=null;

var displayMarker=null;
var buildMarker=null;



// MODE

function setDisplayMode(){

mode="display";

alert("Click shop display location");

}

function setBuildMode(){

mode="build";

alert("Click building location");

}



// CLICK EVENT

map.on('click',function(e){

var lat=e.latlng.lat;
var lon=e.latlng.lng;


if(mode=="display"){

if(displayMarker)
map.removeLayer(displayMarker);

displayMarker=L.marker(e.latlng,{
icon:L.icon({
iconUrl:"https://maps.google.com/mapfiles/ms/icons/red-dot.png",
iconSize:[32,32]
})
}).addTo(map);

document.getElementById("display_lat").value=lat;
document.getElementById("display_lon").value=lon;

// LOAD STREET VIEW

loadStreetView(lat,lon);

}



if(mode=="build"){

if(buildMarker)
map.removeLayer(buildMarker);

buildMarker=L.marker(e.latlng,{
icon:L.icon({
iconUrl:"https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
iconSize:[32,32]
})
}).addTo(map);

document.getElementById("build_lat").value=lat;
document.getElementById("build_lon").value=lon;

}

});



// STREET VIEW (with timeline support)

function loadStreetView(lat,lon){

document.getElementById("streetview").innerHTML=

'<iframe width="100%" height="100%" frameborder="0" '+

'src="https://www.google.com/maps?q=&layer=c&cbll='

+lat+','+lon+

'&cbp=11,0,0,0,0&output=svembed">'+

'</iframe>';

}



// LOAD KML

document.getElementById('kmlFile')
.addEventListener('change',function(e){

for(let file of e.target.files){

var reader=new FileReader();

reader.onload=function(event){

var parser=new DOMParser();

var kml=parser.parseFromString(
event.target.result,
"text/xml"
);

var geojson=toGeoJSON.kml(kml);


// DARK AOI STYLE

var layer=L.geoJSON(geojson,{

style:{
color:"#000000",
weight:4,
fillColor:"#ff0000",
fillOpacity:0.1
},

pointToLayer:function(feature,latlng){

return L.circleMarker(latlng,{

radius:6,
color:"#000000",
fillColor:"#ff0000",
fillOpacity:1

});

}

}).addTo(map);


// ZOOM TO AOI

map.fitBounds(layer.getBounds());

};

reader.readAsText(file);

}

});
