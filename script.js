// Initialize the map
const map = L.map('map').setView([51.4416, 5.4697], 13);

const cityCodes = ["5600", "5700", "5506"];

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.control.locate().addTo(map);

/* Sample parking data (replace with actual data from the backend)
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
*/

/*Add parking markers to the map
parkings.forEach((parking) => {
    // Create a marker for each parking location
    L.marker([parking.lat, parking.lng])
        .addTo(map)
        // Bind a popup to the marker with parking details
        .bindPopup(`
            <strong>${parking.name}</strong><br>
            Address: ${parking.address}<br>
            Capacity: ${parking.capacity}<br>
            Price: ${parking.price}<br>
            Opening hours: ${parking.openingHours}<br>
            Security: ${parking.security}
        `);
});
*/

async function loadParkings() {
    // Create a request for each city
    const requests = cityCodes.map(async (code) => {
        const response = await fetch(
            `https://remote.veiligstallen.nl/rest/v3/citycodes/${code}`
        );

        return response.json();
    });

    // Wait until all requests are completed
    const citiesData = await Promise.all(requests);

    // Combine locations from all cities into one array
    const locations = citiesData.flatMap(
        (cityData) => cityData.locations ?? []
    );

    // Convert API data into the format used by the application
    const apiParkings = locations.map((item) => ({
        name: item.name,
        address: item.address ?? "Unknown",
        capacity: item.capacity ?? "Unknown",
        price: "Unknown",
        openingHours: item.openinghours?.opennow
            ? "Open now"
            : "Closed",
        security: item.locationtype ?? "Unknown",
        lat: Number(item.lat),
        lng: Number(item.long)
    }));

    // Create a layer group for all parking markers
    const markerGroup = L.featureGroup().addTo(map);



    // Create a marker for each parking location
    apiParkings.forEach((parking) => {

        // Create a Google Maps directions URL for the parking location
        const googleMapsUrl =
        `https://www.google.com/maps/dir/?api=1` +
        `&destination=${parking.lat},${parking.lng}` +
        `&travelmode=bicycling`;

        L.marker([parking.lat, parking.lng])
            .addTo(markerGroup)
            .bindPopup(`
                <strong>${parking.name}</strong><br>
                Address: ${parking.address}<br>
                Capacity: ${parking.capacity}<br>
                Price: ${parking.price}<br>
                Opening hours: ${parking.openingHours}<br>
                Security: ${parking.security}

            <a
                class="route-button"
                href="${googleMapsUrl}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Get directions in Google Maps
            </a>
                
            `);
    });

    // Adjust the map so all markers are visible
    if (apiParkings.length > 0) {
        map.fitBounds(markerGroup.getBounds(), {
            padding: [30, 30]
        });
    }

    console.log(apiParkings);
}

loadParkings();