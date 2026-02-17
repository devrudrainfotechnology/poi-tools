let map;
let streetView;
let displayMode=false;
let buildingMode=false;
let pois=[];

let leafletMap;
let kmlLayers = [];

document.getElementById("kmlFile").addEventListener("change", function(e) {

    const files = e.target.files;

    files.forEach(file => {

        const reader = new FileReader();

        reader.onload = function(event) {

            const kmlText = event.target.result;

            const parser = new DOMParser();
            const kmlDoc = parser.parseFromString(kmlText, "text/xml");

            const kmlLayer = new google.maps.KmlLayer({
                url: URL.createObjectURL(new Blob([kmlText], {type: 'application/vnd.google-earth.kml+xml'})),
                map: map,
                preserveViewport: false,
                suppressInfoWindows: false
            });

            kmlLayers.push(kmlLayer);

        };

        reader.readAsText(file);

    });

});

map.setStreetView(streetView);

map.addListener("click",function(e)
{
const lat=e.latLng.lat();
const lng=e.latLng.lng();

streetView.setPosition({lat,lng});

if(displayMode)
{
document.getElementById("displayLat").value=lat;
document.getElementById("displayLng").value=lng;
}

if(buildingMode)
{
document.getElementById("buildingLat").value=lat;
document.getElementById("buildingLng").value=lng;
}
});

// initialize Leaflet overlay
initLeafletOverlay();

loadKML();
}

function initLeafletOverlay()
{
leafletMap=L.map('map',{zoomControl:false,attributionControl:false});
leafletMap.setView([31.6340,74.8723],13);

L.tileLayer('',{}).addTo(leafletMap);
}

function loadKML()
{
document.getElementById("kmlFile").addEventListener("change",function(e)
{
for(let file of e.target.files)
{
let reader=new FileReader();

reader.onload=function(event)
{
let kmlLayer=omnivore.kml.parse(event.target.result);

kmlLayer.setStyle({
color:"red",
weight:4,
opacity:1,
fillColor:"yellow",
fillOpacity:0.5
});

kmlLayer.addTo(leafletMap);

kmlLayers.push(kmlLayer);

leafletMap.fitBounds(kmlLayer.getBounds());
};

reader.readAsText(file);
}
});
}

function setDisplayMode()
{
displayMode=true;
buildingMode=false;
}

function setBuildingMode()
{
displayMode=false;
buildingMode=true;
}

function savePOI()
{
let poi={
name:name.value,
category:category.value,
subcategory:subcategory.value,
displayLat:displayLat.value,
displayLng:displayLng.value,
buildingLat:buildingLat.value,
buildingLng:buildingLng.value
};

pois.push(poi);

updateTable();
}

function updateTable()
{
let table=document.getElementById("poiTable");

table.innerHTML=`
<tr>
<th>Name</th>
<th>Category</th>
<th>SubCategory</th>
<th>Display Lat</th>
<th>Display Lng</th>
<th>Building Lat</th>
<th>Building Lng</th>
<th>Delete</th>
</tr>
`;

pois.forEach((poi,index)=>
{
let row=table.insertRow();

row.insertCell(0).innerText=poi.name;
row.insertCell(1).innerText=poi.category;
row.insertCell(2).innerText=poi.subcategory;
row.insertCell(3).innerText=poi.displayLat;
row.insertCell(4).innerText=poi.displayLng;
row.insertCell(5).innerText=poi.buildingLat;
row.insertCell(6).innerText=poi.buildingLng;

let del=row.insertCell(7);
del.innerHTML=`<button onclick="deletePOI(${index})">Delete</button>`;
});
}

function deletePOI(index)
{
pois.splice(index,1);
updateTable();
}

