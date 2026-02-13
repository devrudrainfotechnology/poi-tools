var map = L.map('map').setView([31.1471, 75.3412], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '© OpenStreetMap'
}).addTo(map);


// YOUR GITHUB USERNAME HERE
var base =
"https://devrudrainfotechnology.github.io/poi-tool/KML/";


var kmlFiles = [

"11.kml",
"12.kml",
"13.kml",
"14.kml",
"15.kml",
"16.kml",
"17.kml",
"18.kml",
"19.kml",

"110.kml",
"111.kml",
"112.kml",
"113.kml",
"114.kml",
"115.kml",
"116.kml",
"117.kml",
"118.kml",
"119.kml",

"120.kml",
"121.kml",
"122.kml",
"123.kml",
"124.kml",
"125.kml",
"126.kml",
"127.kml",
"128.kml",
"129.kml",
"130.kml",
"131.kml",

"Grid.kml",
"Punjab.kml"

];



kmlFiles.forEach(function(file){

fetch(base + file)
.then(res => res.text())
.then(kmltext => {

var parser = new DOMParser();
var kml = parser.parseFromString(kmltext,"text/xml");

var geojson = toGeoJSON.kml(kml);

var layer = L.geoJSON(geojson,{
color:'red'
}).addTo(map);


var checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.checked = true;

checkbox.onchange = function(){
if(this.checked)
map.addLayer(layer);
else
map.removeLayer(layer);
}

var label = document.createElement("label");
label.appendChild(checkbox);
label.appendChild(document.createTextNode(" " + file));

document.getElementById("layerList").appendChild(label);
document.getElementById("layerList").appendChild(document.createElement("br"));

});

});


var script = document.createElement('script');
script.src =
'https://cdnjs.cloudflare.com/ajax/libs/togeojson/0.16.0/togeojson.min.js';
document.head.appendChild(script);
