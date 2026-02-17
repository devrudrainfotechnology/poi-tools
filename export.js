function exportCSV()
{

let csv="Name,Category,SubCategory,DisplayLat,DisplayLng,BuildingLat,BuildingLng\n";

poiData.forEach(p=>
{

csv+=`${p.name},${p.category},${p.subcategory},${p.displayLat},${p.displayLng},${p.buildingLat},${p.buildingLng}\n`;

});

let blob=new Blob([csv]);

let a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="poi.csv";

a.click();

}

function exportKML()
{

let kml='<?xml version="1.0"?><kml><Document>';

poiData.forEach(p=>
{

kml+=`
<Placemark>
<name>${p.name}</name>
<Point>
<coordinates>${p.displayLng},${p.displayLat}</coordinates>
</Point>
</Placemark>`;

});

kml+='</Document></kml>';

let blob=new Blob([kml]);

let a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="poi.kml";

a.click();

}
