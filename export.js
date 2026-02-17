let poiList = [];

function savePOI() {

    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const subcategory = document.getElementById("subcategory").value;
    const dlat = document.getElementById("display_lat").value;
    const dlng = document.getElementById("display_lng").value;
    const blat = document.getElementById("building_lat").value;
    const blng = document.getElementById("building_lng").value;

    if(!name) {
        alert("Enter name");
        return;
    }

    const poi = {
        id: Date.now(),
        name,
        category,
        subcategory,
        dlat,
        dlng,
        blat,
        blng
    };

    poiList.push(poi);

    renderPOIList();
}

function renderPOIList() {

    let html = "";

    poiList.forEach(poi => {

        html += `
        <tr>
            <td>${poi.name}</td>
            <td>${poi.category}</td>
            <td>${poi.subcategory}</td>
            <td>${poi.dlat}</td>
            <td>${poi.dlng}</td>
            <td>${poi.blat}</td>
            <td>${poi.blng}</td>
            <td>
                <button onclick="deletePOI(${poi.id})">🗑 Delete</button>
            </td>
        </tr>
        `;
    });

    document.getElementById("poiTableBody").innerHTML = html;
}

function deletePOI(id) {

    poiList = poiList.filter(p => p.id !== id);

    renderPOIList();
}

function exportCSV() {

    let csv =
"Name,Category,SubCategory,DisplayLat,DisplayLng,BuildingLat,BuildingLng\n";

    poiList.forEach(p => {

        csv += `${p.name},${p.category},${p.subcategory},${p.dlat},${p.dlng},${p.blat},${p.blng}\n`;

    });

    const blob = new Blob([csv]);

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "POI.csv";

    a.click();
}


