let map;
let streetView;
let displayMode = false;
let buildingMode = false;
let pois = [];
let kmlLayers = [];

// INIT GOOGLE MAP + STREET VIEW
function initMap()
{
    map = new google.maps.Map(document.getElementById("map"),
    {
        center: {lat: 31.6340, lng: 74.8723},
        zoom: 7,
        mapTypeId: "roadmap"
    });

    streetView = new google.maps.StreetViewPanorama(
        document.getElementById("streetview"),
        {
            position: {lat: 31.6340, lng: 74.8723},
            pov: {heading: 0, pitch: 0},
            zoom: 1
        }
    );

    map.setStreetView(streetView);

    // MAP CLICK EVENT
    map.addListener("click", function(e)
    {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        streetView.setPosition({lat, lng});

        if(displayMode)
        {
            document.getElementById("displayLat").value = lat;
            document.getElementById("displayLng").value = lng;
        }

        if(buildingMode)
        {
            document.getElementById("buildingLat").value = lat;
            document.getElementById("buildingLng").value = lng;
        }
    });

    // KML UPLOAD
    document.getElementById("kmlFile").addEventListener("change", loadKML);
}


// LOAD MULTIPLE KML FILES CORRECTLY
let geoXml;

document.getElementById("kmlFile").addEventListener("change", function(e)
{
    const files = e.target.files;

    for (let file of files)
    {
        const reader = new FileReader();

        reader.onload = function(event)
        {
            const kmlText = event.target.result;

           const parser = new geoXML3.parser({
    map: map,
    zoom: true,
    afterParse: function(doc)
    {
        doc.forEach(function(layer)
        {
            if(layer.gpolygons)
            {
                layer.gpolygons.forEach(function(poly)
                {
                    poly.setOptions({
                        fillColor: "#ff0000",
                        strokeColor: "#ff0000",
                        strokeWeight: 3,
                        fillOpacity: 0.3
                    });
                });
            }
        });
    }
});


        // AUTO ZOOM TO KML
        google.maps.event.addListenerOnce(kmlLayer, "defaultviewport_changed", function()
        {
            map.fitBounds(kmlLayer.getDefaultViewport());
        });

        kmlLayers.push(kmlLayer);
    }
}


// MODE SELECT
function setDisplayMode()
{
    displayMode = true;
    buildingMode = false;
}

function setBuildingMode()
{
    displayMode = false;
    buildingMode = true;
}


// SAVE POI
function savePOI()
{
    let poi =
    {
        name: document.getElementById("name").value,
        category: document.getElementById("category").value,
        subcategory: document.getElementById("subcategory").value,
        displayLat: document.getElementById("displayLat").value,
        displayLng: document.getElementById("displayLng").value,
        buildingLat: document.getElementById("buildingLat").value,
        buildingLng: document.getElementById("buildingLng").value
    };

    pois.push(poi);

    updateTable();
}


// UPDATE TABLE
function updateTable()
{
    let table = document.getElementById("poiTable");

    table.innerHTML =
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
        let row = table.insertRow();

        row.insertCell(0).innerText = poi.name;
        row.insertCell(1).innerText = poi.category;
        row.insertCell(2).innerText = poi.subcategory;
        row.insertCell(3).innerText = poi.displayLat;
        row.insertCell(4).innerText = poi.displayLng;
        row.insertCell(5).innerText = poi.buildingLat;
        row.insertCell(6).innerText = poi.buildingLng;

        let del = row.insertCell(7);

        del.innerHTML =
        `<button onclick="deletePOI(${index})">🗑 Delete</button>`;
    });
}


// DELETE POI
function deletePOI(index)
{
    pois.splice(index,1);
    updateTable();
}


// EXPORT CSV
function exportCSV()
{
    let csv = "Name,Category,SubCategory,DisplayLat,DisplayLng,BuildingLat,BuildingLng\n";

    pois.forEach(p =>
    {
        csv += `${p.name},${p.category},${p.subcategory},${p.displayLat},${p.displayLng},${p.buildingLat},${p.buildingLng}\n`;
    });

    const blob = new Blob([csv], {type:"text/csv"});
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "POI_Data.csv";

    link.click();
}


// EXPORT KML
function exportKML()
{
    let kml =
`<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>`;

    pois.forEach(p =>
    {
        kml +=
`
<Placemark>
<name>${p.name}</name>
<Point>
<coordinates>${p.displayLng},${p.displayLat},0</coordinates>
</Point>
</Placemark>`;
    });

    kml += "</Document></kml>";

    const blob = new Blob([kml], {type:"application/vnd.google-earth.kml+xml"});
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "POI_Data.kml";

    link.click();
}


