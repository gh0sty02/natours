/* eslint-disable */
const mapElement = document.getElementById('map');

if (mapElement) {
  const locations = JSON.parse(mapElement.dataset.locations);

  mapboxgl.accessToken =
    'pk.eyJ1IjoiZ2hvc3R5MDIiLCJhIjoiY2tvYTBnZXpsMDk1YjJvcW03OHR0NXp3ciJ9.Ros4tBhSNN2HpdjArt_Y2Q';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ghosty02/ckoawbhnd0gyd17qnxkc6hzcq',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
}
