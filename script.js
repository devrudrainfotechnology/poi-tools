let map;
let streetView;

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


    // CLICK HANDLER
    map.addListener("click", function(event)
    {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        streetView.setPosition({lat,lng});

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
    });


    // FILE LOAD HANDLER (GeoJSON)
    document.getElementById("kmlFile")
    .addEventListener("change", loadGeoJSON);
}



// LOAD GEOJSON FILES (supports multiple)
function loadGeoJSON(event)
{
    const files = event.target.files;

    for(let file of files)
    {
        const reader = new FileReader();

        reader.onload = function(e)
        {
            try
            {
                const geojson = JSON.parse(e.target.result);

                map.data.addGeoJson(geojson);

                map.data.setStyle({
                    strokeColor:"#FF0000",
                    strokeWeight:2,
                    fillColor:"#FF0000",
                    fillOpacity:0.1
                });

                console.log("Loaded:", file.name);
            }
            catch(err)
            {
                alert("Invalid GeoJSON file");
            }
        };

        reader.readAsText(file);
    }
}



// MODE BUTTONS
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
        name: document.getElementById("name").value || "Unidentified",
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
        <td>
        <button onclick="deletePOI(${index})">
        Delete
        </button>
        </td>
        </tr>
        `;
    });

    document.getElementById("poiTable").innerHTML = html;
}



// DELETE
function deletePOI(index)
{
    pois.splice(index,1);
    updateTable();
}
