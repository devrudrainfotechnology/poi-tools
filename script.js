
var map = L.map('map').setView([31.6340,74.8723],13);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom:19
}).addTo(map);


var mode = null;

var displayMarker = null;

var buildMarker = null;



// MODE FUNCTIONS

function setDisplayMode(){

mode = "display";

alert("Click on map to select DISPLAY location");

}

function setBuildMode(){

mode = "build";

alert("Click on map to select BUILDING location");

}



// MAP CLICK EVENT

map.on('click',function(e){

if(mode=="display"){

if(displayMarker)
map.removeLayer(displayMarker);

displayMarker = L.marker(e.latlng,{
icon:L.icon({
iconUrl:
"https://maps.google.com/mapfiles/ms/icons/red-dot.png",
iconSize:[32,32]
})
}).addTo(map);

document.getElementById("display_lat").value =
e.latlng.lat;

document.getElementById("display_lon").value =
e.latlng.lng;

loadStreetView(e.latlng.lat,e.latlng.lng);

}


if(mode=="build"){

if(buildMarker)
map.removeLayer(buildMarker);

buildMarker = L.marker(e.latlng,{
icon:L.icon({
iconUrl:
"https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
iconSize:[32,32]
})
}).addTo(map);

document.getElementById("build_lat").value =
e.latlng.lat;

document.getElementById("build_lon").value =
e.latlng.lng;

}

});



// STREET VIEW

function loadStreetView(lat,lon){

document.getElementById("streetview").innerHTML =
'<iframe width="100%" height="300" src="https://maps.google.com/maps?q='
+lat+','+lon+
'&layer=c&cbll='
+lat+','+lon+
'&cbp=11,0,0,0,0&output=svembed"></iframe>';

}



// KML UPLOAD

document.getElementById('kmlFile')
.addEventListener('change',function(e){

for(let file of e.target.files){

var reader = new FileReader();

reader.onload = function(event){

var parser = new DOMParser();

var kml = parser.parseFromString(
event.target.result,
"text/xml"
);

var geojson = toGeoJSON.kml(kml);

var layer = L.geoJSON(geojson,{

style:{
color:"green",
weight:2,
fillOpacity:0.2
},

pointToLayer:function(feature,latlng){

return L.circleMarker(latlng,{
radius:5,
color:"red"
});

},

onEachFeature:function(feature,layer){

if(feature.properties.name){

layer.bindPopup(
feature.properties.name
);

}

}

}).addTo(map);

map.fitBounds(layer.getBounds());

};

reader.readAsText(file);

}

});



// SAVE FUNCTION (for now local test)

function savePOI(){

alert("POI Saved (connect to save.php later)");

}



// EXPORT FUNCTION

function exportExcel(){

alert("Connect export.php later");

}
