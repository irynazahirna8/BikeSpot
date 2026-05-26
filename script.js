const map = L.map('map').setView([51.4416, 5.4697], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.control.locate().addTo(map);

const parkings = [
    {
        name: "Eindhoven Station Bicycle Parking",
        address: "Stationsplein, Eindhoven",
        capacity: "Unknown",
        price: "Unknown",
        openingHours: "Unknown",
        security: "Unknown",
        lat: 51.4433,
        lng: 5.4796
    },
    {
        name: "Bike parking city centre",
        address: "Eindhoven city centre",
        capacity: "Unknown",
        price: "Unknown",
        openingHours: "Unknown",
        security: "Unknown",
        lat: 51.4380,
        lng: 5.4780
    }
];

parkings.forEach((parking) => {
    L.marker([parking.lat, parking.lng])
        .addTo(map)
        .bindPopup(`
            <strong>${parking.name}</strong><br>
            Address: ${parking.address}<br>
            Capacity: ${parking.capacity}<br>
            Price: ${parking.price}<br>
            Opening hours: ${parking.openingHours}<br>
            Security: ${parking.security}
        `);
});
