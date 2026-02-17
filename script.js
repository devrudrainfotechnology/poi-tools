let map;
let streetView;
let displayMode = false;
let buildingMode = false;
let pois = [];

function initMap()
{
    const center = {lat:31.6340,lng:74.8723};

    map = new google.maps.Map(document.getElementById("map"),
    {
        zoom:13,
        center:center
    });

    streetView = new google.maps.StreetViewPanorama(
        document.getElementById("streetview"),
        {
            position:center,
            pov:{heading:0,pitch:0},
            zoom:1
        }
    );

    map.setStreetView(streetView);

    map.addListener("click", function(e)
    {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

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
    });

    loadKML();
}

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

function loadKML()
{
document.getElementById("kmlFile").addEventListener("change",function(e)
{
    for(let file of e.target.files)
    {
        let reader = new FileReader();

        reader.onload=function(event)
        {
            let parser = new DOMParser();
            let xml = parser.parseFromString(event.target.result,"text/xml");

            let kmlLayer = new google.maps.KmlLayer({
                url: URL.createObjectURL(file),
                map: map
            });
        }

        reader.readAsText(file);
    }
});
}

function savePOI()
{
let name=document.getElementById("name").value;
let category=document.getElementById("category").value;
let sub=document.getElementById("subcategory").value;

let dlat=document.getElementById("displayLat").value;
let dlng=document.getElementById("displayLng").value;

let blat=document.getElementById("buildingLat").value;
let blng=document.getElementById("buildingLng").value;

let poi={name,category,sub,dlat,dlng,blat,blng};

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
row.insertCell(2).innerText=poi.sub;
row.insertCell(3).innerText=poi.dlat;
row.insertCell(4).innerText=poi.dlng;
row.insertCell(5).innerText=poi.blat;
row.insertCell(6).innerText=poi.blng;

let del=row.insertCell(7);
del.innerHTML="<button onclick='deletePOI("+index+")'>Delete</button>";
});
}

function deletePOI(index)
{
pois.splice(index,1);
updateTable();
}
