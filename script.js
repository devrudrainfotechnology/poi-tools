
var map = L.map('map').setView([31.6340,74.8723],13);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom:22
}).addTo(map);


var displayMarker=null;
var buildMarker=null;

var mode=null;



// MODE SELECT

function setDisplayMode(){

mode="display";

alert("Click display location on map");

}

function setBuildMode(){

mode="build";

alert("Click building location on map");

}



// MAP CLICK

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



// STREET VIEW LOAD

function loadStreetView(lat,lon){

document.getElementById("streetview").innerHTML=

'<iframe width="100%" height="100%" frameborder="0" '+

'src="https://www.google.com/maps?q=&layer=c&cbll='+

lat+','+lon+

'&cbp=11,0,0,0,0&output=svembed">'+

'</iframe>';

}



// KML LOAD WITH STRONG HIGHLIGHT

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


var layer=L.geoJSON(geojson,{

style:{
color:"#000000",
weight:5,
fillColor:"#ff0000",
fillOpacity:0.2
},

pointToLayer:function(feature,latlng){

return L.circleMarker(latlng,{
radius:7,
color:"#000000",
fillColor:"#ff0000",
fillOpacity:1
});

}

}).addTo(map);


map.fitBounds(layer.getBounds());

};

reader.readAsText(file);

}

});

let markers = [];

function addMarker(lat, lng, type) {

    let marker = L.marker([lat, lng], { draggable: true }).addTo(map);

    marker.on("contextmenu", function () {

        if(confirm("Delete this point?")) {

            map.removeLayer(marker);

            markers = markers.filter(m => m !== marker);
        }
    });

    markers.push(marker);
}

let mode = "";

function setDisplayMode() {
    mode = "display";
}

function setBuildMode() {
    mode = "building";
}

map.on("click", function(e) {

    if(mode === "display") {

        document.getElementById("displayLat").value = e.latlng.lat;
        document.getElementById("displayLng").value = e.latlng.lng;

        addMarker(e.latlng.lat, e.latlng.lng);

    }

    if(mode === "building") {

        document.getElementById("buildingLat").value = e.latlng.lat;
        document.getElementById("buildingLng").value = e.latlng.lng;

        addMarker(e.latlng.lat, e.latlng.lng);

    }

});

function savePOI() {

    let data = {

        name: document.getElementById("poiName").value,

        category: document.getElementById("poiCategory").value,

        subcategory: document.getElementById("poiSubCategory").value,

        displayLat: document.getElementById("displayLat").value,

        displayLng: document.getElementById("displayLng").value,

        buildingLat: document.getElementById("buildingLat").value,

        buildingLng: document.getElementById("buildingLng").value
    };

    console.log(data);

    alert("POI saved successfully");
}

