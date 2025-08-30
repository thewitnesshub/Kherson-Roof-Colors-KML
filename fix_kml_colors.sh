#!/bin/bash

# Create Blue KML with proper blue styling
cat > "Blue Kherson Fixed.kml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
	<name>Blue Kherson</name>
	<Style id="blueStyle">
		<IconStyle>
			<scale>1.2</scale>
			<color>ffff0000</color>
			<Icon>
				<href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href>
			</Icon>
		</IconStyle>
	</Style>
EOF

# Extract coordinates from original Blue KML and add them with blue styling
grep -E "<coordinates>" "Blue Kherson.kml" | sed -n '1~1p' | head -100 > temp_blue_coords.txt

# Add placemarks with coordinates
counter=1
while IFS= read -r line; do
    coords=$(echo "$line" | sed 's/<coordinates>//g' | sed 's/<\/coordinates>//g' | tr -d '\t ')
    cat >> "Blue Kherson Fixed.kml" << EOF
	<Placemark>
		<name>Blue Roof $counter</name>
		<styleUrl>#blueStyle</styleUrl>
		<Point>
			<coordinates>$coords</coordinates>
		</Point>
	</Placemark>
EOF
    counter=$((counter+1))
done < temp_blue_coords.txt

echo "</Document></kml>" >> "Blue Kherson Fixed.kml"

# Create Turquoise KML with proper turquoise styling
cat > "Turquoise Kherson Fixed.kml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
	<name>Turquoise Kherson</name>
	<Style id="turquoiseStyle">
		<IconStyle>
			<scale>1.2</scale>
			<color>ff00ffff</color>
			<Icon>
				<href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href>
			</Icon>
		</IconStyle>
	</Style>
EOF

# Extract coordinates from original Turquoise KML and add them with turquoise styling
grep -E "<coordinates>" "Turquoise Kherson.kml" | sed -n '1~1p' | head -100 > temp_turquoise_coords.txt

# Add placemarks with coordinates
counter=1
while IFS= read -r line; do
    coords=$(echo "$line" | sed 's/<coordinates>//g' | sed 's/<\/coordinates>//g' | tr -d '\t ')
    cat >> "Turquoise Kherson Fixed.kml" << EOF
	<Placemark>
		<name>Turquoise Roof $counter</name>
		<styleUrl>#turquoiseStyle</styleUrl>
		<Point>
			<coordinates>$coords</coordinates>
		</Point>
	</Placemark>
EOF
    counter=$((counter+1))
done < temp_turquoise_coords.txt

echo "</Document></kml>" >> "Turquoise Kherson Fixed.kml"

# Clean up temp files
rm temp_blue_coords.txt temp_turquoise_coords.txt

echo "Fixed KML files created!"
echo "Blue Kherson Fixed.kml - Pure blue icons"
echo "Turquoise Kherson Fixed.kml - Pure turquoise/cyan icons"
