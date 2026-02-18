let map;
let streetView;

let displayMode=false;
let buildingMode=false;

let pois=[];

let geoParser;

function initMap()
{

map=new google.maps.Map(document.getElementById("map"),
{
center:{lat:31.1471,lng:75.3412},
zoom:7,
mapTypeId:"roadmap"
});

streetView=new google.maps.StreetViewPanorama(
document.getElementById("streetview"),
{
position:{lat:31.1471,lng:75.3412},
pov:{heading:0,pitch:0},
zoom:1
});

map.setStreetView(streetView);

map.addListener("click",function(e)
{

let lat=e.latLng.lat();
let lng=e.latLng.lng();

streetView.setPosition({lat,lng});

if(displayMode)
{
displayLat.value=lat;
displayLng.value=lng;
}

if(buildingMode)
{
buildingLat.value=lat;
buildingLng.value=lng;
}

});

geoParser=new geoXML3.parser(
{
map:map,
zoom:true,
singleInfoWindow:true,
afterParse:function(doc)
{

doc.forEach(layer=>
{

if(layer.gpolygons)
{
layer.gpolygons.forEach(poly=>
{
poly.setOptions(
{
fillColor:"#ff0000",
strokeColor:"#ff0000",
strokeWeight:2,
fillOpacity:0.2
});
});
}

});

}
});

}

document.getElementById("kmlFile").addEventListener("change",function(e)
{

for(let file of e.target.files)
{

let reader=new FileReader();

reader.onload=function(event)
{
geoParser.parseKmlString(event.target.result);
};

reader.readAsText(file);

}

});

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

let poi=
{
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

table.innerHTML=
`
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

window.onload=initMap;
