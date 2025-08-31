// Utility to parse KML and extract roof placemarks with color
export function parseKml(kmlText) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(kmlText, "text/xml");
  const placemarks = Array.from(xml.getElementsByTagName("Placemark"));
  const roofs = placemarks.map(pm => {
    // Get name or description for color
    const name = pm.getElementsByTagName("name")[0]?.textContent || "";
    const desc = pm.getElementsByTagName("description")[0]?.textContent || "";
    // Get coordinates
    const coordsTag = pm.getElementsByTagName("coordinates")[0];
    let coords = null;
    if (coordsTag) {
      const [lon, lat] = coordsTag.textContent.trim().split(",");
      coords = { lat: parseFloat(lat), lon: parseFloat(lon) };
    }
    // Guess color from name/desc
    let color = "unknown";
    if (/blue/i.test(name) || /blue/i.test(desc)) color = "blue";
    else if (/turquoise/i.test(name) || /turquoise/i.test(desc) || /green/i.test(name) || /green/i.test(desc)) color = "turquoise";
    else if (/solar/i.test(name) || /solar/i.test(desc) || /panel/i.test(name) || /panel/i.test(desc)) color = "solar";
    else if (/red/i.test(name) || /red/i.test(desc)) color = "red";
    return { color, coords };
  }).filter(r => r.coords);
  return roofs;
}
