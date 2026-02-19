let map;
let streetView;
let geoParser;
let pois = [];

let displayMode = false;
let buildingMode = false;

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

    geoParser = new geoXML3.parser({map:map,zoom:true});

    map.addListener("click",(event)=>handleClick(event.latLng));
    map.data.addListener("click",(event)=>handleClick(event.latLng));

    document.getElementById("fileInput")
        .addEventListener("change",loadFiles);

    const saved = localStorage.getItem("pois");
    if(saved)
    {
        pois = JSON.parse(saved);
        updateTable();
    }
};


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


// LOAD FILES
function loadFiles(event)
{
    const files = event.target.files;

    for(let file of files)
    {
        const reader = new FileReader();

        reader.onload = function(e)
        {
            if(file.name.endsWith(".kml"))
            {
                geoParser.parseKmlString(e.target.result);
            }
            else
            {
                const geojson = JSON.parse(e.target.result);
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

    const poi = {
        name, category, subcategory,
        landline, mobile, mobile1,
        displayLat, displayLng,
        buildingLat, buildingLng
    };

    pois.push(poi);
    localStorage.setItem("pois", JSON.stringify(pois));

    updateTable();
    clearForm();
}


// UPDATE TABLE
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

async function scanText()
{
    const svElement = document.getElementById("streetview");

    const canvas = await html2canvas(svElement);
    const imageData = canvas.toDataURL("image/png");

    const { data: { text } } = await Tesseract.recognize(
        imageData,
        'pan+hin+eng',
        { logger: m => console.log(m) }
    );

    if(!text.trim()) {
        alert("No text detected.");
        return;
    }

    translateText(text);
}
async function translateText(originalText)
{
    try {
        const response = await fetch("https://libretranslate.de/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                q: originalText,
                source: "auto",
                target: "en",
                format: "text"
            })
        });

        const data = await response.json();

        alert("Detected Text:\n\n" + originalText +
              "\n\nTranslated:\n\n" + data.translatedText);

    } catch (error) {
        console.error(error);
        alert("Translation failed.");
    }
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

