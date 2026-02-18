let map;
let streetView;
let geoParser;

let displayMode=false;
let buildingMode=false;

let pois=[];


// INIT MAP
function initMap()
{
    const center={lat:31.1471,lng:75.3412};

    map=new google.maps.Map(
        document.getElementById("map"),
        {
            center:center,
            zoom:7
        }
    );

    streetView=new google.maps.StreetViewPanorama(
        document.getElementById("streetview"),
        {
            position:center,
            pov:{heading:0,pitch:0},
            zoom:1
        }
    );

    map.setStreetView(streetView);

    geoParser=new geoXML3.parser({
        map:map,
        zoom:true
    });

    map.addListener("click",function(event)
    {
        handleClick(event.latLng);
    });

    map.data.addListener("click",function(event)
    {
        handleClick(event.latLng);
    });

    document.getElementById("fileInput")
    .addEventListener("change",loadFiles);
}


// CLICK HANDLER
function handleClick(latLng)
{
    const lat=latLng.lat();
    const lng=latLng.lng();

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
}


// LOAD FILES
function loadFiles(event)
{
    const files=event.target.files;

    for(let file of files)
    {
        const reader=new FileReader();

        reader.onload=function(e)
        {
            if(file.name.endsWith(".kml"))
            {
                geoParser.parseKmlString(e.target.result);
            }
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


// SAVE POI
function savePOI()
{
    const poi={
        name:poi_name.value,
        category:category.value,
        subcat:subcat.value,
        landline:landline.value,
        mobile:mobile.value,
        mobile1:mobile1.value,
        displayLat:displayLat.value,
        displayLng:displayLng.value,
        buildingLat:buildingLat.value,
        buildingLng:buildingLng.value
    };

    pois.push(poi);

    updateTable();
}


// UPDATE TABLE
function updateTable()
{
    let html=`
<tr>
<th>Name</th>
<th>Category</th>
<th>SubCategory</th>
<th>Landline</th>
<th>Mobile</th>
<th>Mobile1</th>
<th>DisplayLat</th>
<th>DisplayLng</th>
<th>BuildingLat</th>
<th>BuildingLng</th>
</tr>
`;

    pois.forEach(p=>{
html+=`
<tr>
<td>${p.name}</td>
<td>${p.category}</td>
<td>${p.subcat}</td>
<td>${p.landline}</td>
<td>${p.mobile}</td>
<td>${p.mobile1}</td>
<td>${p.displayLat}</td>
<td>${p.displayLng}</td>
<td>${p.buildingLat}</td>
<td>${p.buildingLng}</td>
</tr>
`;
});

poiTable.innerHTML=html;
}
