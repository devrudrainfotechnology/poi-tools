// GLOBAL VARIABLES
let map;
let streetView;
let geoParser;

let displayMode = false;
let buildingMode = false;

let pois = [];


// INITIALIZE MAP
function initMap()
{
    const center = { lat: 31.1471, lng: 75.3412 };

    // CREATE MAP
    map = new google.maps.Map(
        document.getElementById("map"),
        {
            zoom: 7,
            center: center,
            mapTypeId: "roadmap"
        }
    );

    // CREATE STREET VIEW
    streetView = new google.maps.StreetViewPanorama(
        document.getElementById("streetview"),
        {
            position: center,
            pov:
            {
                heading: 0,
                pitch: 0
            },
            zoom: 1,
            addressControl: true,
            linksControl: true,
            panControl: true,
            enableCloseButton: true
        }
    );

    map.setStreetView(streetView);


    // MAP CLICK EVENT
    map.addListener("click", function(event)
    {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        console.log("Map clicked:", lat, lng);

        // MOVE STREET VIEW
        streetView.setPosition({ lat: lat, lng: lng });

        // SET DISPLAY LOCATION
        if(displayMode === true)
        {
            document.getElementById("displayLat").value = lat.toFixed(6);
            document.getElementById("displayLng").value = lng.toFixed(6);
        }

        // SET BUILDING LOCATION
        if(buildingMode === true)
        {
            document.getElementById("buildingLat").value = lat.toFixed(6);
            document.getElementById("buildingLng").value = lng.toFixed(6);
        }
    });


    // INITIALIZE KML PARSER
    geoParser = new geoXML3.parser(
    {
        map: map,
        zoom: true,
        singleInfoWindow: true,
        suppressInfoWindows: false,
        afterParse: function(doc)
        {
            console.log("KML loaded successfully");
        }
    });


    // KML FILE INPUT HANDLER
    const fileInput = document.getElementById("kmlFile");

    if(fileInput)
    {
        fileInput.addEventListener("change", loadKMLFiles);
    }

}



// LOAD MULTIPLE KML FILES
function loadKMLFiles(event)
{
    const files = event.target.files;

    if(!files.length)
    {
        alert("No KML selected");
        return;
    }

    for(let i = 0; i < files.length; i++)
    {
        const file = files[i];

        console.log("Loading:", file.name);

        const reader = new FileReader();

        reader.onload = function(e)
        {
            try
            {
                geoParser.parseKmlString(e.target.result);
            }
            catch(error)
            {
                console.error("KML parse error:", error);
            }
        };

        reader.readAsText(file);
    }
}



// DISPLAY MODE BUTTON
function setDisplayMode()
{
    displayMode = true;
    buildingMode = false;

    alert("Click map to capture DISPLAY location");
}



// BUILDING MODE BUTTON
function setBuildingMode()
{
    displayMode = false;
    buildingMode = true;

    alert("Click map to capture BUILDING location");
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

    console.log("POI saved:", poi);
}



// UPDATE TABLE
function updateTable()
{
    const table = document.getElementById("poiTable");

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
        html +=
        `
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

    table.innerHTML = html;
}



// DELETE POI
function deletePOI(index)
{
    pois.splice(index, 1);

    updateTable();

    console.log("POI deleted");
}
