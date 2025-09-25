// ScrollHeatmap.jsx
import React, { useEffect, useRef, useState } from "react";
import "./ScrollHeatmap.css";
import sampleData from "./sample-heat.json";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";

// Fix for default markers in Leaflet
const createLeafletIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Function to determine priority based on value
const getPriority = (value) => {
  if (value >= 150) return "High";
  if (value >= 100) return "Medium";
  return "Low";
};

// Function to get color based on priority
const getColor = (priority) => {
  switch (priority) {
    case "High":
      return "#FF3B30";
    case "Medium":
      return "#FFCC00";
    case "Low":
      return "#34C759";
    default:
      return "#34C759";
  }
};

const ScrollHeatmap = () => {
  const mapRef = useRef(null);
  const heatLayerRef = useRef(null);
  const markersRef = useRef([]);
  const pulseLayerRef = useRef([]);
  const containerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [Leaflet, setLeaflet] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [mapStyle, setMapStyle] = useState("standard");

  // Add priority to data points
  const data = sampleData.points.map((point) => ({
    ...point,
    priority: getPriority(point.value),
    color: getColor(getPriority(point.value)),
  }));

  const scrollpoints = sampleData.scrollpoints;

  // ✅ Dynamically load Leaflet + heat plugin
  useEffect(() => {
    let cancelled = false;
    async function loadLibraries() {
      try {
        if (!cancelled) {
          createLeafletIcon();
          setLeaflet(L);
          setTimeout(() => setMapLoaded(true), 100);
        }
      } catch (error) {
        console.error("Failed to load libraries:", error);
      }
    }
    loadLibraries();
    return () => (cancelled = true);
  }, []);

  // Get heatmap color based on severity
  const getHeatColor = (priority) => {
    switch (priority) {
      case "High":
        return { 0.4: "#FF3B30", 0.7: "#FF6B60", 1.0: "#FF3B30" };
      case "Medium":
        return { 0.4: "#FFCC00", 0.7: "#FFDD66", 1.0: "#FFCC00" };
      case "Low":
        return { 0.4: "#34C759", 0.7: "#66D98F", 1.0: "#34C759" };
      default:
        return { 0.4: "#34C759", 0.7: "#66D98F", 1.0: "#34C759" };
    }
  };

  // Map style configurations
  const mapStyles = {
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  };

  const mapAttributions = {
    standard: "&copy; OpenStreetMap contributors",
    dark: "&copy; OpenStreetMap contributors, &copy; CARTO",
    satellite: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  };

  // ✅ Initialize map once Leaflet is ready
  useEffect(() => {
    if (!Leaflet || mapRef.current) return;

    const map = L.map("map", {
      center: [23.5, 85.0],
      zoom: 7,
      minZoom: 5,
      maxZoom: 15,
      preferCanvas: true,
      zoomControl: false,
      attributionControl: false
    });

    // Add initial tile layer
    L.tileLayer(mapStyles.standard, {
      attribution: mapAttributions.standard,
      maxZoom: 19,
    }).addTo(map);

    // Add custom zoom control
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Add custom attribution
    L.control.attribution({
      position: 'bottomleft',
      prefix: `<a href="https://leafletjs.com/" target="_blank">Leaflet</a> | `
    }).addTo(map);

    // Configure heatmap with larger radius and blur for area effect
    const heat = L.heatLayer([], {
      radius: 35, // Increased for area coverage
      blur: 25,   // Increased for smoother transitions
      maxZoom: 15,
      gradient: {
        0.3: "#34C759",
        0.6: "#FFCC00",
        1.0: "#FF3B30",
      }
    }).addTo(map);

    mapRef.current = map;
    heatLayerRef.current = heat;

    // Add scale control
    L.control.scale({metric: true, imperial: false, position: 'bottomleft'}).addTo(map);

    // Add a subtle watermark
    const watermark = L.control({position: 'topright'});
    watermark.onAdd = function(map) {
      const div = L.DomUtil.create('div', 'watermark');
      div.innerHTML = 'Heatmap Visualization';
      return div;
    };
    watermark.addTo(map);
  }, [Leaflet]);

  // ✅ Add initial heatmap
  useEffect(() => {
    if (!Leaflet || !mapRef.current) return;
    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    pulseLayerRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];
    pulseLayerRef.current = [];

    // ✅ Set initial global heatmap
    const arr = data.map((p) => [p.lat, p.lng, p.value]);
    heatLayerRef.current.setLatLngs(arr);
  }, [Leaflet, data]);

  // ✅ IntersectionObserver for scroll-based zooming
  useEffect(() => {
    const scroller = containerRef.current;
    if (!scroller) return;

    const options = { root: scroller, threshold: 0.55 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.dataset.id;
        if (entry.isIntersecting) {
          setActiveId(id);
        }
      });
    }, options);

    const els = scroller.querySelectorAll(".scrollpoint");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ✅ Fly to region + highlight hotspots based on priority
  useEffect(() => {
    if (!activeId || !Leaflet || !mapRef.current || !heatLayerRef.current)
      return;
    const map = mapRef.current;
    const heat = heatLayerRef.current;

    const sp = scrollpoints.find((s) => s.id === activeId);
    if (!sp) return;

    // First card - show all heatmap data
    if (activeId === "sp-ranchi") {
      const arr = data.map((p) => [p.lat, p.lng, p.value]);
      heat.setLatLngs(arr);
      heat.setOptions({
        radius: 35,
        blur: 25,
        gradient: {
          0.3: "#34C759",
          0.6: "#FFCC00",
          1.0: "#FF3B30",
        },
      });
    }

    // Get data within the bounding box
    const [southWest, northEast] = sp.bbox;
    let filteredData = data.filter((p) => {
      return (
        p.lat >= southWest[0] &&
        p.lat <= northEast[0] &&
        p.lng >= southWest[1] &&
        p.lng <= northEast[1]
      );
    });

    // If no data in bbox, use proximity filter
    if (filteredData.length === 0) {
      const [cLat, cLng] = sp.center;
      filteredData = data.filter((p) => {
        const dLat = (p.lat - cLat) * 111;
        const dLng = (p.lng - cLng) * (111 * Math.cos((cLat * Math.PI) / 180));
        const km = Math.sqrt(dLat * dLat + dLng * dLng);
        return km < 200;
      });
    }

    // Second card - focus on high priority areas
    if (activeId === "sp-dhanbad") {
      const highPriorityData = filteredData.filter(
        (p) => p.priority === "High"
      );
      const heatArr = highPriorityData.map((p) => [p.lat, p.lng, p.value]);
      heat.setLatLngs(
        heatArr.length > 0 ? heatArr : [[sp.center[0], sp.center[1], 50]]
      );
      heat.setOptions({
        radius: 40,
        blur: 30,
        gradient: getHeatColor("High")
      });
    }
    // Third card - focus on medium priority areas
    else if (activeId === "sp-jamshedpur") {
      const mediumPriorityData = filteredData.filter(
        (p) => p.priority === "Medium"
      );
      const heatArr = mediumPriorityData.map((p) => [p.lat, p.lng, p.value]);
      heat.setLatLngs(
        heatArr.length > 0 ? heatArr : [[sp.center[0], sp.center[1], 50]]
      );
      heat.setOptions({
        radius: 40,
        blur: 30,
        gradient: getHeatColor("Medium")
      });
    }
    // Fourth card - focus on low priority areas
    else if (activeId === "sp-deoghar") {
      const lowPriorityData = filteredData.filter((p) => p.priority === "Low");
      const heatArr = lowPriorityData.map((p) => [p.lat, p.lng, p.value]);
      heat.setLatLngs(
        heatArr.length > 0 ? heatArr : [[sp.center[0], sp.center[1], 50]]
      );
      heat.setOptions({
        radius: 40,
        blur: 30,
        gradient: getHeatColor("Low")
      });
    }
    // For other cards, show all priorities in the region
    else {
      const heatArr = filteredData.map((p) => [p.lat, p.lng, p.value]);
      heat.setLatLngs(
        heatArr.length > 0 ? heatArr : [[sp.center[0], sp.center[1], 50]]
      );
      heat.setOptions({
        radius: 35,
        blur: 25,
        gradient: {
          0.3: "#34C759",
          0.6: "#FFCC00",
          1.0: "#FF3B30",
        },
      });
    }

    map.flyTo(sp.center, sp.zoom, { duration: 1.2, easeLinearity: 0.25 });

    // Add pulse effect to highlight the focused area
    pulseLayerRef.current.forEach((x) => map.removeLayer(x));
    pulseLayerRef.current = [];

    // Add pulse marker for the center of the focused area
    const div = L.divIcon({
      className: "",
      html: `<div class="pulse" title="${sp.title}"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
    const m = L.marker(sp.center, {
      icon: div,
      interactive: false,
    }).addTo(map);
    pulseLayerRef.current.push(m);
  }, [activeId, Leaflet, data, scrollpoints]);

  // Change map style
  const changeMapStyle = (style) => {
    if (!Leaflet || !mapRef.current) return;
    const map = mapRef.current;
    
    // Remove existing tile layers
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });
    
    // Add new tile layer
    L.tileLayer(mapStyles[style], {
      attribution: mapAttributions[style],
      maxZoom: 19,
    }).addTo(map);
    
    // Re-add heat layer
    heatLayerRef.current.addTo(map);
    
    setMapStyle(style);
  };

  // Timeline dots
  const timelineDots = scrollpoints.map((sp) => (
    <div
      key={sp.id}
      className={`dot ${activeId === sp.id ? "active" : ""}`}
      title={sp.title}
    />
  ));

  return (
    <div className="scrollheat-container">
      <div className="scroll-col" ref={containerRef}>
        {scrollpoints.map((sp) => (
          <section
            key={sp.id}
            className="scrollpoint"
            data-id={sp.id}
            id={sp.id}
            style={{
              border:
                activeId === sp.id ? "1px solid rgba(255,255,255,0.3)" : "none",
            }}
          >
            <h2>{sp.title}</h2>
            <p>
              {sp.id === "sp-ranchi"
                ? "Overview of all activity across Jharkhand with priority markers."
                : sp.id === "sp-dhanbad"
                ? "Focusing on high priority areas with the most critical issues."
                : sp.id === "sp-jamshedpur"
                ? "Focusing on medium priority areas that need attention."
                : sp.id === "sp-deoghar"
                ? "Focusing on low priority areas for monitoring."
                : "Showing all activity in this region."}
            </p>
            <div style={{ marginTop: "1rem", opacity: 0.85 }}>
              <small>
                Region center: {sp.center[0].toFixed(3)},{" "}
                {sp.center[1].toFixed(3)}
              </small>
            </div>
          </section>
        ))}
      </div>

      <div className="map-col">
        <div id="map" style={{ height: "100%" }}></div>
        
        {/* Map style selector */}
        <div className="style-selector">
          <button 
            className={mapStyle === "standard" ? "active" : ""}
            onClick={() => changeMapStyle("standard")}
            title="Standard Map"
          >
            Standard
          </button>
          <button 
            className={mapStyle === "dark" ? "active" : ""}
            onClick={() => changeMapStyle("dark")}
            title="Dark Map"
          >
            Dark
          </button>
          <button 
            className={mapStyle === "satellite" ? "active" : ""}
            onClick={() => changeMapStyle("satellite")}
            title="Satellite View"
          >
            Satellite
          </button>
        </div>

        <div className="legend">
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            Activity Intensity
          </div>
          <div className="bar" />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
            }}
          >
            <span style={{ fontSize: 11 }}>Low</span>
            <span style={{ fontSize: 11 }}>High</span>
          </div>
        </div>

        <div className="priority-legend">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Priority
          </div>
          <div className="priority-item">
            <div
              className="priority-dot"
              style={{ backgroundColor: "#FF3B30" }}
            ></div>
            <span>High (&gt;= 150)</span>
          </div>
          <div className="priority-item">
            <div
              className="priority-dot"
              style={{ backgroundColor: "#FFCC00" }}
            ></div>
            <span>Medium (100-149)</span>
          </div>
          <div className="priority-item">
            <div
              className="priority-dot"
              style={{ backgroundColor: "#34C759" }}
            ></div>
            <span>Low (&lt; 100)</span>
          </div>
        </div>

        <div className="timeline" aria-hidden>
          {timelineDots}
        </div>
        
        {/* Loading indicator */}
        {!mapLoaded && (
          <div className="map-loading">
            <div className="loading-spinner"></div>
            <span>Loading map...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrollHeatmap;