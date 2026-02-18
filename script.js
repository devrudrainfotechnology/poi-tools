let map;
let streetView;

let displayMode = false;
let buildingMode = false;

let pois = [];

function initMap()
{
    const center = { lat: 31.1471, lng: 75.3412 };

    map = new google.maps.Map(
        document.getElementById("map"),
        {
            zoom: 7,
            center: center,
            mapTypeId: "roadmap"
        }
    );

    streetView = new google.maps.StreetViewPanorama(
        document.getElementById("streetview"),
        {
            position: center,
            pov: { heading: 0, pitch: 0 },
            zoom: 1
        }
    );

    map.setStreetView(streetView);

    // CLICK EVENT
    map.addListener("click", function(event)
    {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        console.log("Clicked:", lat, lng);

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
    });
}

function setDisplayMode()
{
    displayMode = true;
    buildingMode = false;

    alert("Click map to set DISPLAY location");
}

function setBuildingMode()
{
    displayMode = false;
    buildingMode = true;

    alert("Click map to set BUILDING location");
}

function savePOI()
{
    const poi =
    {
        name: name.value,
        category: category.value,
        subcategory: subcategory.value,
        displayLat: displayLat.value,
        displayLng: displayLng.value,
        buildingLat: buildingLat.value,
        buildingLng: buildingLng.value
    };

    pois.push(poi);

    updateTable();
}

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

    table.innerHTML = html;
}

function deletePOI(index)
{
    pois.splice(index,1);
    updateTable();
}
