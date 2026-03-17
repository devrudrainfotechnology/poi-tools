let map, streetView, geoParser;
let pois = [];

let displayMode = false;
let buildingMode = false;

// INIT MAP
function initMap()
{
    const center = {lat:31.1471, lng:75.3412};

    map = new google.maps.Map(document.getElementById("map"), {
        center,
        zoom: 7
    });

    streetView = new google.maps.StreetViewPanorama(
        document.getElementById("streetview"),
        {
            position: center,
            pov: {heading:0, pitch:0},
            zoom:1
        }
    );

    map.setStreetView(streetView);

    // Capture Street View Date
    const service = new google.maps.StreetViewService();

    streetView.addListener("pano_changed", function () {
        service.getPanorama({ pano: streetView.getPano() }, function (data, status) {
            if (status === "OK" && data.imageDate) {
                document.getElementById("svDate").value = data.imageDate;
            }
        });
    });

    geoParser = new geoXML3.parser({map:map});

    map.addListener("click",(e)=>handleClick(e.latLng));

    document.getElementById("fileInput")
        .addEventListener("change",loadFiles);

    const saved = localStorage.getItem("pois");
    if(saved)
    {
        pois = JSON.parse(saved);
        updateTable();
    }
}

// HANDLE CLICK
function handleClick(latLng)
{
    streetView.setPosition(latLng);

    if(displayMode)
    {
        document.getElementById("displayLat").value = latLng.lat().toFixed(6);
        document.getElementById("displayLng").value = latLng.lng().toFixed(6);
    }

    if(buildingMode)
    {
        document.getElementById("buildingLat").value = latLng.lat().toFixed(6);
        document.getElementById("buildingLng").value = latLng.lng().toFixed(6);
    }
}

// LOAD FILE
function loadFiles(e)
{
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(evt)
    {
        if(file.name.endsWith(".kml"))
        {
            geoParser.parseKmlString(evt.target.result);
        }
        else
        {
            map.data.addGeoJson(JSON.parse(evt.target.result));
        }
    };

    reader.readAsText(file);
}

// SAVE POI
function savePOI()
{
    const poi = {
        name: name.value,
        category: category.value,
        subcategory: subcategory.value,
        landline: landline.value,
        mobile: mobile.value,
        mobile1: mobile1.value,
        displayLat: displayLat.value,
        displayLng: displayLng.value,
        buildingLat: buildingLat.value,
        buildingLng: buildingLng.value
    };

    pois.push(poi);
    localStorage.setItem("pois", JSON.stringify(pois));

    updateTable();
}

// TABLE
function updateTable()
{
    let html = "<tr><th>Name</th><th>Category</th><th>Delete</th></tr>";

    pois.forEach((p,i)=>{
        html += `<tr>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td><button onclick="deletePOI(${i})">❌</button></td>
        </tr>`;
    });

    poiTable.innerHTML = html;
}

function deletePOI(i)
{
    pois.splice(i,1);
    localStorage.setItem("pois", JSON.stringify(pois));
    updateTable();
}

// ================= SMART TEXT DETECTION =================

async function detectText()
{
    const canvas = document.querySelector("#streetview canvas");

    if (!canvas) {
        alert("Street View not ready");
        return;
    }

    const image = canvas.toDataURL("image/png");

    alert("Detecting signboards...");

    const result = await Tesseract.recognize(image, 'eng', {
        tessedit_pageseg_mode: 6
    });

    drawBoxesImproved(result.data);
}

function drawBoxesImproved(data)
{
    const canvasSV = document.querySelector("#streetview canvas");
    const overlay = document.getElementById("overlayCanvas");

    overlay.width = canvasSV.width;
    overlay.height = canvasSV.height;

    const ctx = overlay.getContext("2d");
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    ctx.strokeStyle = "lime";
    ctx.lineWidth = 3;
    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "yellow";

    data.words.forEach(word => {

        const text = word.text.trim();
        const conf = word.confidence;

        const { x0, y0, x1, y1 } = word.bbox;
        const w = x1 - x0;
        const h = y1 - y0;

        if (w < 40 || h < 15) return;

        const ratio = w / h;
        if (ratio < 2) return;

        if (!/^[A-Za-z0-9 &.-]+$/.test(text)) return;

        const ignore = ["STOP","SLOW","SCHOOL","TURN","LEFT","RIGHT"];
        if (ignore.includes(text.toUpperCase())) return;

        if (conf < 60) return;

        ctx.strokeRect(x0, y0, w, h);
        ctx.fillText(`${text} (${Math.round(conf)}%)`, x0, y0 - 5);
    });
}
