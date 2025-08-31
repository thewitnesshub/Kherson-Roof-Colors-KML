import re
import xml.etree.ElementTree as ET

def extract_coordinates_from_kml(filename):
    """Extract coordinates from KML file"""
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all coordinate patterns
    coord_pattern = r'<coordinates>([^<]+)</coordinates>'
    coordinates = re.findall(coord_pattern, content)
    
    return [coord.strip() for coord in coordinates if coord.strip()]

def create_styled_kml(coords, name, style_id, icon_url, output_file):
    """Create a properly styled KML file"""
    kml_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
    <name>{name}</name>
    <Style id="{style_id}">
        <IconStyle>
            <scale>1.2</scale>
            <Icon>
                <href>{icon_url}</href>
            </Icon>
        </IconStyle>
    </Style>
'''
    
    for i, coord in enumerate(coords, 1):  # Use all coordinates
        kml_content += f'''    <Placemark>
        <name>{name.split()[0]} Roof {i}</name>
        <styleUrl>#{style_id}</styleUrl>
        <Point>
            <coordinates>{coord}</coordinates>
        </Point>
    </Placemark>
'''
    
    kml_content += '''</Document>
</kml>'''
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(kml_content)
    
    return len(coords)

# Extract coordinates from both files
print("Extracting coordinates from Blue KML...")
blue_coords = extract_coordinates_from_kml("Blue Kherson.kml")
print(f"Found {len(blue_coords)} blue roof coordinates")

print("Extracting coordinates from Turquoise KML...")
turquoise_coords = extract_coordinates_from_kml("Turquoise Kherson.kml")
print(f"Found {len(turquoise_coords)} turquoise roof coordinates")

print("Extracting coordinates from Solar Panels KML...")
solar_coords = extract_coordinates_from_kml("Solar Panels.kml")
print(f"Found {len(solar_coords)} solar panel coordinates")

# Create fixed KML files with proper pushpin icons
blue_count = create_styled_kml(
    blue_coords, 
    "Blue Kherson", 
    "blueStyle", 
    "http://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png",
    "Blue Kherson Fixed.kml"
)

turquoise_count = create_styled_kml(
    turquoise_coords, 
    "Turquoise Kherson", 
    "turquoiseStyle", 
    "http://maps.google.com/mapfiles/kml/pushpin/grn-pushpin.png",  # Using green as closest to turquoise
    "Turquoise Kherson Fixed.kml"
)

solar_count = create_styled_kml(
    solar_coords, 
    "Solar Panels", 
    "solarStyle", 
    "http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png",  # Using yellow for solar panels
    "Solar Kherson Fixed.kml"
)

print(f"\nFixed KML files created!")
print(f"Blue Kherson Fixed.kml - {blue_count} blue pushpins")
print(f"Turquoise Kherson Fixed.kml - {turquoise_count} green pushpins (closest to turquoise)")
print(f"Solar Kherson Fixed.kml - {solar_count} yellow pushpins")
print("\nThese files should display with proper pushpin colors in both Google Earth Web and Pro!")
