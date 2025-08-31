// Utility: Haversine distance in meters
export function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const toRad = x => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find all groups of roofs matching colorCounts within radius
export function findRoofGroups(roofs, colorCounts, radius) {
  // Only consider roofs with known color
  const validColors = Object.keys(colorCounts).filter(c => colorCounts[c] > 0);
  const filteredRoofs = roofs.filter(r => validColors.includes(r.color));
  // Generate all combinations
  function* combinations(arr, counts) {
    // arr: [{color, coords}]
    // counts: {blue: 2, turquoise: 1}
    if (Object.values(counts).reduce((a, b) => a + b, 0) === 0) yield [];
    else {
      for (let i = 0; i < arr.length; i++) {
        const color = arr[i].color;
        if (counts[color] > 0) {
          const nextCounts = { ...counts, [color]: counts[color] - 1 };
          for (const rest of combinations(arr.slice(i + 1), nextCounts)) {
            yield [arr[i], ...rest];
          }
        }
      }
    }
  }
  // Find valid groups
  const groups = [];
  for (const group of combinations(filteredRoofs, colorCounts)) {
    if (group.length === Object.values(colorCounts).reduce((a, b) => a + b, 0)) {
      // Check all pairwise distances
      let valid = true;
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          const d = haversine(group[i].coords.lat, group[i].coords.lon, group[j].coords.lat, group[j].coords.lon);
          if (d > radius) valid = false;
        }
      }
      if (valid) groups.push(group);
    }
  }
  return groups;
}

// Generate KML polygon for a group
export function groupToKmlPolygon(group, idx) {
  const coordsStr = group.map(r => `${r.coords.lon},${r.coords.lat},0`).join(" ");
  // Close the polygon by adding the first coordinate at the end
  const firstCoord = `${group[0].coords.lon},${group[0].coords.lat},0`;
  return `
<Placemark>
  <name>Group ${idx + 1} Boundary</name>
  <styleUrl>#polygonStyle</styleUrl>
  <Polygon>
    <outerBoundaryIs>
      <LinearRing>
        <coordinates>
          ${coordsStr} ${firstCoord}
        </coordinates>
      </LinearRing>
    </outerBoundaryIs>
  </Polygon>
</Placemark>
`;
}

// Generate full KML
export function groupsToKml(groups) {
  const styles = `
<Style id="blueStyle">
  <IconStyle>
    <scale>1.2</scale>
    <Icon>
      <href>http://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png</href>
    </Icon>
  </IconStyle>
</Style>
<Style id="turquoiseStyle">
  <IconStyle>
    <scale>1.2</scale>
    <Icon>
      <href>http://maps.google.com/mapfiles/kml/pushpin/grn-pushpin.png</href>
    </Icon>
  </IconStyle>
</Style>
<Style id="solarStyle">
  <IconStyle>
    <scale>1.2</scale>
    <Icon>
      <href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
    </Icon>
  </IconStyle>
</Style>
<Style id="polygonStyle">
  <PolyStyle>
    <color>7f00ff00</color>
    <outline>1</outline>
  </PolyStyle>
  <LineStyle>
    <color>ff00ff00</color>
    <width>2</width>
  </LineStyle>
</Style>`;
  
  const placemarksWithPoints = groups.map((group, idx) => {
    const points = group.map((roof, roofIdx) => `
<Placemark>
  <name>${roof.color} roof ${roofIdx + 1} (Group ${idx + 1})</name>
  <styleUrl>#${roof.color}Style</styleUrl>
  <Point>
    <coordinates>${roof.coords.lon},${roof.coords.lat},0</coordinates>
  </Point>
</Placemark>`).join('');
    
    const polygon = groupToKmlPolygon(group, idx);
    return points + polygon;
  }).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
<name>Roof Groups</name>
${styles}
${placemarksWithPoints}
</Document>
</kml>`;
}
