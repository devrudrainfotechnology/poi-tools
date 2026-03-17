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

    streetView.addListener("position_changed", function () {

    const service = new google.maps.StreetViewService();

    service.getPanorama({
        location: streetView.getPosition(),
        radius: 50
    }, function(data, status) {

        if (status === "OK") {

            if (data.imageDate) {

                document.getElementById("svDate").value = data.imageDate;

            } else {

                document.getElementById("svDate").value = "Date not available";

            }

        }

    });

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
streetView.addListener("pano_changed", function () {

    const pano = streetView.getPano();

    const service = new google.maps.StreetViewService();

    service.getPanorama({ pano: pano }, function (data, status) {

        if (status === "OK") {

            const date = data.imageDate;   // Example: "2023-05"

            if(date){
                document.getElementById("svDate").value = date;
            }

        }

    });

});

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

// ================= TEXT DETECTION =================

function captureStreetView()
{
    const svDiv = document.getElementById("streetview");
    const canvas = svDiv.querySelector("canvas");

    if(!canvas)
    {
        alert("Street View not ready");
        return null;
    }

    return canvas.toDataURL("image/png");
}

async function detectText()
{
    const canvas = document.querySelector("#streetview canvas");

    if (!canvas) {
        alert("Street View not ready");
        return;
    }

    // Use actual canvas resolution (IMPORTANT)
    const image = canvas.toDataURL("image/png");

    alert("Detecting text...");

    const result = await Tesseract.recognize(image, 'eng', {
        tessedit_pageseg_mode: "6" // better for signboards
    });

    drawBoxesImproved(result.data);
}
    ).then(({ data }) => {

        drawBoxes(data.words);

    }).catch(err => {
        console.error(err);
        alert("Detection failed");
    });
}

function drawBoxesImproved(data)
{
    const canvasSV = document.querySelector("#streetview canvas");
    const overlay = document.getElementById("overlayCanvas");

    // Match EXACT size of Street View canvas
    overlay.width = canvasSV.width;
    overlay.height = canvasSV.height;

    const ctx = overlay.getContext("2d");
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.font = "14px Arial";
    ctx.fillStyle = "yellow";

    data.words.forEach(word => {

        const text = word.text.trim();

        // 🔥 FILTER (VERY IMPORTANT)
        if (
            text.length > 3 &&
            /^[A-Za-z0-9 ]+$/.test(text)
        )
        {
            const { x0, y0, x1, y1 } = word.bbox;

            const w = x1 - x0;
            const h = y1 - y0;

            // Ignore tiny detections
            if (w > 30 && h > 15)
            {
                ctx.strokeRect(x0, y0, w, h);
                ctx.fillText(text, x0, y0 - 5);
            }
        }
    });
}

