// Loads KML text from static files
export async function loadKmlFiles() {
  const blueRes = await fetch("/Blue Kherson.kml");
  const turquoiseRes = await fetch("/Turquoise Kherson.kml");
  const blueKml = await blueRes.text();
  const turquoiseKml = await turquoiseRes.text();
  return { blueKml, turquoiseKml };
}
