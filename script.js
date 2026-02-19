window.onload = function()
{
    const saved = localStorage.getItem("pois");

    if(saved)
    {
        pois = JSON.parse(saved);
        updateTable();
    }
}

let map;
let streetView;
let geoParser;

let displayMode=false;
let buildingMode=false;

let pois=[];


// INIT MAP
window.initMap = function()
{
    const center = {lat:31.1471, lng:75.3412};

    map = new google.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 7
    });

    streetView = new google.maps.StreetViewPanorama(
        document.getElementById("streetview"),
        {
            position: center,
            pov: {heading:0, pitch:0},
            zoom:1
        });

    map.setStreetView(streetView);
};


    map.setStreetView(streetView);

    geoParser=new geoXML3.parser({map:map,zoom:true});

    map.addListener("click",(event)=>handleClick(event.latLng));

    map.data.addListener("click",(event)=>handleClick(event.latLng));

    document.getElementById("fileInput")
        .addEventListener("change",loadFiles);
}


// HANDLE CLICK
function handleClick(latLng)
{
    const lat = latLng.lat();
    const lng = latLng.lng();

    streetView.setPosition({lat, lng});

    if(displayMode)
    {
        document.getElementById("displayLat").value = lat.toFixed(6);
        document.getElementById("displayLng").value = lng.toFixed(6);
    }

    if(buildingMode)
    {
        document.getElementById("buildingLat").value = lat.toFixed(6);
        document.getElementById("buildingLng").value = lng.toFixed(6);
    }
}

// LOAD KML / GEOJSON
function loadFiles(event)
{
    const files=event.target.files;

    for(let file of files)
    {
        const reader=new FileReader();

        reader.onload=function(e)
        {
            if(file.name.endsWith(".kml"))
                geoParser.parseKmlString(e.target.result);
            else
            {
                const geojson=JSON.parse(e.target.result);

                map.data.addGeoJson(geojson);

                map.data.setStyle({
                    clickable:true,
                    strokeColor:"#FF0000",
                    strokeWeight:2,
                    fillOpacity:0.1
                });
            }
        };

        reader.readAsText(file);
    }
}


// MODE
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


// SAVE
function savePOI()
{
    const name = document.getElementById("name").value.trim();
    const category = document.getElementById("category").value.trim();
    const subcategory = document.getElementById("subcategory").value.trim();
    const landline = document.getElementById("landline").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const mobile1 = document.getElementById("mobile1").value.trim();
    const displayLat = document.getElementById("displayLat").value;
    const displayLng = document.getElementById("displayLng").value;
    const buildingLat = document.getElementById("buildingLat").value;
    const buildingLng = document.getElementById("buildingLng").value;

    // ✅ Numeric Validation
    if (mobile && !/^\d{10}$/.test(mobile))
    {
        alert("Mobile number must be exactly 10 digits.");
        return;
    }

    if (mobile1 && !/^\d{10}$/.test(mobile1))
    {
        alert("Mobile1 number must be exactly 10 digits.");
        return;
    }

    if (landline && !/^\d+$/.test(landline))
    {
        alert("Landline must contain only numbers.");
        return;
    }

    const poi =
    {
        name,
        category,
        subcategory,
        landline,
        mobile,
        mobile1,
        displayLat,
        displayLng,
        buildingLat,
        buildingLng
    };

    pois.push(poi);
    localStorage.setItem("pois", JSON.stringify(pois));

    updateTable();
    clearForm();   // ✅ auto clear form after save
}

// UPDATE TABLE
function updateTable()
function updateTable()
{
    let html = `
<tr>
<th>Name</th>
<th>Category</th>
<th>SubCat</th>
<th>Landline</th>
<th>Mobile</th>
<th>Mobile1</th>
<th>DisplayLat</th>
<th>DisplayLng</th>
<th>BuildingLat</th>
<th>BuildingLng</th>
<th>Delete</th>
</tr>`;

    pois.forEach((p, index)=>{
        html += `
<tr>
<td>${p.name ?? ""}</td>
<td>${p.category ?? ""}</td>
<td>${p.subcategory ?? ""}</td>
<td>${p.landline ?? ""}</td>
<td>${p.mobile ?? ""}</td>
<td>${p.mobile1 ?? ""}</td>
<td>${p.displayLat ?? ""}</td>
<td>${p.displayLng ?? ""}</td>
<td>${p.buildingLat ?? ""}</td>
<td>${p.buildingLng ?? ""}</td>
<td><button onclick="deletePOI(${index})">❌</button></td>
</tr>`;
    });

    document.getElementById("poiTable").innerHTML = html;
}

function deletePOI(index)
{
    if(confirm("Are you sure you want to delete this POI?"))
    {
        pois.splice(index, 1);
        localStorage.setItem("pois", JSON.stringify(pois));
        updateTable();
    }
}

// EXPORT CSV (Excel)
function exportCSV()
{
    let csv=
"POI_NAME,CATEGORY,SUB_CAT,LANDLINE,MOBILE,MOBILE_1,DISPLAY_LAT,DISPLAY_LNG,BUILD_LAT,BUILD_LNG\n";

    pois.forEach(p=>{
csv+=`${p.name},${p.category},${p.subcat},${p.landline},${p.mobile},${p.mobile1},${p.displayLat},${p.displayLng},${p.buildingLat},${p.buildingLng}\n`;
});

    const blob=new Blob([csv],{type:"text/csv"});
    const link=document.createElement("a");

    link.href=URL.createObjectURL(blob);
    link.download="POI_Data.csv";

    link.click();
}

function clearForm()
{
    document.getElementById("name").value = "";
    document.getElementById("category").value = "";
    document.getElementById("subcategory").value = "";
    document.getElementById("landline").value = "";
    document.getElementById("mobile").value = "";
    document.getElementById("mobile1").value = "";
    document.getElementById("displayLat").value = "";
    document.getElementById("displayLng").value = "";
    document.getElementById("buildingLat").value = "";
    document.getElementById("buildingLng").value = "";
}


// EXPORT KML
function exportKML()
{
    let kml=
`<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>`;

    pois.forEach(p=>{
kml+=`
<Placemark>
<name>${p.name}</name>
<Point>
<coordinates>${p.displayLng},${p.displayLat},0</coordinates>
</Point>
</Placemark>`;
});

kml+=`</Document></kml>`;

    const blob=new Blob([kml],{type:"application/vnd.google-earth.kml+xml"});
    const link=document.createElement("a");

    link.href=URL.createObjectURL(blob);
    link.download="POI_Data.kml";

    link.click();
}






