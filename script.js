let map;
let streetView;
let geoParser;

let displayMode = false;
let buildingMode = false;

let pois = [];


// INIT MAP
function initMap()
{
    const center = { lat:31.1471, lng:75.3412 };

    map = new google.maps.Map(
        document.getElementById("map"),
        {
            zoom:7,
            center:center,
            mapTypeId:"roadmap"
        }
    );

    streetView = new google.maps.StreetViewPanorama(
        document.getElementById("streetview"),
        {
            position:center,
            pov:{ heading:0, pitch:0 },
            zoom:1
        }
    );

    map.setStreetView(streetView);
    
function handleMapClick(latLng)
{
    const lat = latLng.lat();
    const lng = latLng.lng();

    streetView.setPosition({ lat, lng });

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


    // CLICK HANDLER (WORKING FEATURE - DO NOT CHANGE)
   map.addListener("click", function(event)
{
    handleMapClick(event.latLng);
});



    // INIT KML parser
    geoParser = new geoXML3.parser({
        map: map,
        zoom: true
    });


    // FILE LOADER (SUPPORTS BOTH KML AND GEOJSON)
    document.getElementById("kmlFile")
    .addEventListener("change", loadFiles);
}



// LOAD FILES FUNCTION
function loadFiles(event)
{
    const files = event.target.files;

    for(let file of files)
    {
        const reader = new FileReader();

        reader.onload = function(e)
        {
            const content = e.target.result;

            // Detect file type
            if(file.name.toLowerCase().endsWith(".kml"))
            {
                // Load KML
                geoParser.parseKmlString(content);
                console.log("KML loaded:", file.name);
            }
            else if(file.name.toLowerCase().endsWith(".geojson") ||
                    file.name.toLowerCase().endsWith(".json"))
            {
                // Load GeoJSON
                try
                {
                    const geojson = JSON.parse(content);

                    map.data.addGeoJson(geojson);
                    map.data.addListener("click", function(event)
{
    handleMapClick(event.latLng);
});

map.data.addGeoJson(geojson);
                    map.data.setStyle({
                        strokeColor:"#FF0000",
                        strokeWeight:2,
                        fillColor:"#FF0000",
                        fillOpacity:0.1
                    });

                    console.log("GeoJSON loaded:", file.name);
                }
                catch(err)
                {
                    alert("Invalid GeoJSON file");
                }
            }
            else
            {
                alert("Unsupported file type: " + file.name);
            }
        };

        reader.readAsText(file);
    }
}



// MODE BUTTONS (WORKING FEATURE)
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
    const poi =
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
    let html =
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
        html += `
        <tr>
        <td>${poi.name}</td>
        <td>${poi.category}</td>
        <td>${poi.subcategory}</td>
        <td>${poi.displayLat}</td>
        <td>${poi.displayLng}</td>
        <td>${poi.buildingLat}</td>
        <td>${poi.buildingLng}</td>
        <td><button onclick="deletePOI(${index})">Delete</button></td>
        </tr>
        `;
    });

    document.getElementById("poiTable").innerHTML = html;
}



// DELETE POI
function deletePOI(index)
{
    pois.splice(index,1);
    updateTable();
}


