function exportExcel()
{
    if(pois.length === 0)
    {
        alert("No data to export");
        return;
    }

    let ws_data = [
        [
            "Name",
            "Category",
            "SubCategory",
            "Landline",
            "Mobile",
            "Mobile1",
            "Display Lat",
            "Display Lng",
            "Building Lat",
            "Building Lng"
        ]
    ];

    pois.forEach(p =>
    {
        ws_data.push([
            p.name,
            p.category,
            p.subcategory,
            p.landline,
            p.mobile,
            p.mobile1,
            p.displayLat,
            p.displayLng,
            p.buildingLat,
            p.buildingLng
        ]);
    });

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(ws_data);

    XLSX.utils.book_append_sheet(wb, ws, "POI");

    XLSX.writeFile(wb, "POI_Data.xlsx");
}
