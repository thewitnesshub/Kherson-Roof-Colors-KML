import { parseKml } from "./kmlUtils";

// Loads KML text from static files
export async function loadKmlFiles() {
  const blueRes = await fetch("/Blue Kherson.kml");
  const turquoiseRes = await fetch("/Turquoise Kherson.kml");
  const solarRes = await fetch("/Solar Panels.kml");
  const blueKml = await blueRes.text();
  const turquoiseKml = await turquoiseRes.text();
  const solarKml = await solarRes.text();
  return { blueKml, turquoiseKml, solarKml };
}

// Loads and parses a single KML file
export async function loadKmlFile(filename) {
  const response = await fetch(filename);
  const kmlText = await response.text();
  return parseKml(kmlText);
}
