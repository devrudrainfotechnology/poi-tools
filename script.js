let map;
let streetView;
let geoParser;

let displayMode = false;
let buildingMode = false;

let pois = [];

function initMap()
{
    const center = { lat:31.1471, lng:75.3412 };

    map = new google.maps.Map(
        document.getElementById("map"),
        {
            center:center,
            zoom:7
        }
    );

    streetView = new google.maps.StreetViewPanorama(
        document.getElementById("streetview"),
        {
            position:center,
            pov:{heading:0,pitch:0},
            zoom:1
        }
    );

    map.setStreetView(streetView);

    geoParser = new geoXML3.parser({
        map: map,
        zoom: true
    });

    map.addListener("click", function(event)
    {
        handleClick(event.latLng);
    });

    map.data.addListener("click", function(event)
    {
        handleClick(event.latLng);
    });

    document.getElementById("fileInput")
        .addEventListener("change", loadFiles);
}

function handleClick(latLng)
{
    const lat = latLng.lat();
    const lng = latLng.lng();

    streetView.setPosition({lat,lng});

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
}

function loadFiles(event)
{
    const files = event.target.files;

    for(let file of files)
    {
        const reader = new FileReader();

        reader.onload = function(e)
        {
            const content = e.target.result;

            if(file.name.toLowerCase().endsWith(".kml"))
            {
                geoParser.parseKmlString(content);
            }
            else if(file.name.toLowerCase().endsWith(".geojson")
                 || file.name.toLowerCase().endsWith(".json"))
            {
                const geojson = JSON.parse(content);

                map.data.addGeoJson(geojson);

                map.data.setStyle({
                    clickable:true,
                    strokeColor:"#FF0000",
                    strokeWeight:2,
                    fillColor:"#FF0000",
                    fillOpacity:0.1
                });
            }
        };

        reader.readAsText(file);
    }
}

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

function savePOI()
{
    const poi =
    {
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
    let html =
    `
    <tr>
    <th>Display Lat</th>
    <th>Display Lng</th>
    <th>Building Lat</th>
    <th>Building Lng</th>
    </tr>
    `;

    pois.forEach(p =>
    {
        html += `
        <tr>
        <td>${p.displayLat}</td>
        <td>${p.displayLng}</td>
        <td>${p.buildingLat}</td>
        <td>${p.buildingLng}</td>
        </tr>
        `;
    });

    poiTable.innerHTML = html;
}
