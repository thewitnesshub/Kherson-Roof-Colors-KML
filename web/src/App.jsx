import React, { useState, useEffect } from "react";
import { parseKml } from "./kmlUtils";
import { loadKmlFiles, loadKmlFile } from "./kmlLoader";
import { findRoofGroups, groupsToKml } from "./roofGroups";

function App() {
  const [colorCounts, setColorCounts] = useState({ blue: 0, turquoise: 0, solar: 0 });
  const [radius, setRadius] = useState(50);
  const [resultKml, setResultKml] = useState(null);
  const [parsedRoofs, setParsedRoofs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load and parse KMLs on mount
  useEffect(() => {
    Promise.all([
      loadKmlFile('/Blue Kherson.kml'),
      loadKmlFile('/Turquoise Kherson.kml'),
      loadKmlFile('/Solar Panels.kml')
    ]).then(([blueRoofs, turquoiseRoofs, solarRoofs]) => {
      const allRoofs = [...blueRoofs, ...turquoiseRoofs, ...solarRoofs];
      setParsedRoofs(allRoofs);
      setLoading(false);
    }).catch(error => {
      console.error('Error loading KML files:', error);
      setLoading(false);
    });
  }, []);

  // Handle color count change
  function handleColorChange(color, value) {
    setColorCounts({ ...colorCounts, [color]: Number(value) });
  }

  // Handle radius change
  function handleRadiusChange(e) {
    setRadius(Number(e.target.value));
  }

  // Find groups and generate KML
  function handleFindCombinations() {
    if (!parsedRoofs.length) return;
    const groups = findRoofGroups(parsedRoofs, colorCounts, radius);
    setResultKml(groupsToKml(groups));
  }

  // Download KML function
  function downloadKml() {
    if (!resultKml) return;
    const blob = new Blob([resultKml], { type: "application/vnd.google-earth.kml+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roof-groups.kml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ 
      maxWidth: 800, 
      margin: "auto", 
      padding: 32,
      fontFamily: "system-ui, -apple-system, sans-serif",
      lineHeight: 1.6
    }}>
      <h1 style={{
        color: "#2d3748",
        marginBottom: 8,
        fontSize: "2rem"
      }}>Roof Color Distance Tool</h1>
      <p style={{
        color: "#4a5568",
        marginBottom: 32,
        fontSize: "1.1rem"
      }}>Find groups of colored roofs within a specified distance</p>
      
      <div style={{
        background: "#f7fafc",
        padding: 24,
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        marginBottom: 24
      }}>
        <div style={{ marginBottom: 16 }}>
          <strong style={{ color: "#2d3748" }}>KML files loaded: Blue, Turquoise/Green & Solar Panels</strong>
        </div>
        
        <div style={{ 
          display: "flex", 
          gap: 24, 
          flexWrap: "wrap",
          marginBottom: 20
        }}>
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: 4, 
              fontWeight: "500",
              color: "#2d3748"
            }}>Blue roofs:</label>
            <input 
              type="number" 
              min={0} 
              value={colorCounts.blue} 
              onChange={e => handleColorChange("blue", e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                fontSize: "1rem",
                width: 80
              }}
            />
          </div>
          
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: 4, 
              fontWeight: "500",
              color: "#2d3748"
            }}>Turquoise/Green roofs:</label>
            <input 
              type="number" 
              min={0} 
              value={colorCounts.turquoise} 
              onChange={e => handleColorChange("turquoise", e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                fontSize: "1rem",
                width: 80
              }}
            />
          </div>
          
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: 4, 
              fontWeight: "500",
              color: "#2d3748"
            }}>Solar panels:</label>
            <input 
              type="number" 
              min={0} 
              value={colorCounts.solar} 
              onChange={e => handleColorChange("solar", e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                fontSize: "1rem",
                width: 80
              }}
            />
          </div>
          
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: 4, 
              fontWeight: "500",
              color: "#2d3748"
            }}>Radius (meters):</label>
            <input 
              type="number" 
              min={1} 
              value={radius} 
              onChange={handleRadiusChange}
              style={{
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                fontSize: "1rem",
                width: 100
              }}
            />
          </div>
        </div>
        
        <button 
          onClick={handleFindCombinations}
          disabled={loading || !parsedRoofs.length}
          style={{
            background: loading || !parsedRoofs.length ? "#9ca3af" : "#3b82f6",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: 8,
            fontSize: "1rem",
            fontWeight: "500",
            cursor: loading || !parsedRoofs.length ? "not-allowed" : "pointer",
            transition: "background-color 0.2s"
          }}
        >
          Find Combinations & Generate KML
        </button>
      </div>
      {loading ? (
        <div style={{ 
          textAlign: "center", 
          padding: 32,
          color: "#4a5568"
        }}>
          Loading KML files...
        </div>
      ) : parsedRoofs.length > 0 && (
        <div style={{
          background: "#f8fafc",
          padding: 20,
          borderRadius: 8,
          border: "1px solid #e2e8f0",
          marginBottom: 24
        }}>
          <h3 style={{ 
            color: "#2d3748", 
            marginTop: 0, 
            marginBottom: 12 
          }}>Parsed Roofs ({parsedRoofs.length} total)</h3>
          <div style={{ 
            fontSize: "0.9rem",
            color: "#4a5568"
          }}>
            Blue: {parsedRoofs.filter(r => r.color === "blue").length} | 
            Turquoise/Green: {parsedRoofs.filter(r => r.color === "turquoise").length} | 
            Solar: {parsedRoofs.filter(r => r.color === "solar").length}
          </div>
        </div>
      )}
      
      {resultKml && (
        <div style={{
          background: "#f0fff4",
          border: "1px solid #9ae6b4",
          borderRadius: 8,
          padding: 20
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16
          }}>
            <h3 style={{ 
              color: "#2d3748", 
              margin: 0 
            }}>Result KML Generated</h3>
            <button
              onClick={downloadKml}
              style={{
                background: "#10b981",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: 6,
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              Download KML
            </button>
          </div>
          <textarea 
            rows={8} 
            style={{ 
              width: "100%", 
              padding: 12,
              border: "1px solid #d1d5db",
              borderRadius: 6,
              fontSize: "0.85rem",
              fontFamily: "monospace",
              resize: "vertical"
            }} 
            value={resultKml} 
            readOnly 
          />
        </div>
      )}
    </div>
  );
}

export default App;
