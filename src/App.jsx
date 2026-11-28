
import React, { useEffect, useState } from "react";
import {
  LayoutDashboard, Camera, Car, AlertTriangle, Gauge,
  Activity, Bell, FileText, Settings, Menu, ShieldCheck,
  RefreshCw, Radio, Construction, ChevronRight
} from "lucide-react";
import CameraManagement from "./CameraManagement";
import RoadObstruction from "./RoadObstruction";
import SettingsPage from "./Settings";
import "./App.css";

const API_URL = "http://127.0.0.1:5000/api";

const menu = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Road Obstruction", icon: Construction },
  { name: "Accident Detection", icon: AlertTriangle },
  { name: "Vehicle Detection", icon: Car },
  { name: "Speed Monitoring", icon: Gauge },
  { name: "Traffic Monitoring", icon: Activity },
  { name: "CCTV Monitoring", icon: Camera },
  { name: "Emergency Alerts", icon: Bell },
  { name: "Reports", icon: FileText },
  { name: "Settings", icon: Settings }
];

function App() {
  const [active, setActive] = useState("Overview");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cameras, setCameras] = useState([]);

  const [stats, setStats] = useState({
    total_cameras: 0,
    total_obstructions: 0,
    active_obstructions: 0,
    critical_obstructions: 0,
    total_detections: 0,
    unread_alerts: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      setError("");

      const [statsResponse, camerasResponse] = await Promise.all([
        fetch(`${API_URL}/dashboard/stats`),
        fetch(`${API_URL}/cameras`)
      ]);

      if (!statsResponse.ok || !camerasResponse.ok) {
        throw new Error("Unable to retrieve dashboard information.");
      }

      const statsData = await statsResponse.json();
      const camerasData = await camerasResponse.json();

      setStats({
        total_cameras: Number(statsData.total_cameras ?? 0),
        total_obstructions: Number(statsData.total_obstructions ?? 0),
        active_obstructions: Number(statsData.active_obstructions ?? 0),
        critical_obstructions: Number(statsData.critical_obstructions ?? 0),
        total_detections: Number(statsData.total_detections ?? 0),
        unread_alerts: Number(statsData.unread_alerts ?? 0)
      });

      setCameras(camerasData.cameras || []);
      setLastUpdated(new Date());

    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: "Total Cameras",
      value: stats.total_cameras,
      description: "Registered surveillance cameras",
      icon: Camera
    },
    {
      title: "Obstructions Defined",
      value: stats.total_obstructions,
      description: "Total recorded road obstructions",
      icon: Construction
    },
    {
      title: "Active Obstructions",
      value: stats.active_obstructions,
      description: "Currently reported obstructions",
      icon: AlertTriangle
    },
    {
      title: "Critical Obstructions",
      value: stats.critical_obstructions,
      description: "Critical active obstructions",
      icon: AlertTriangle
    },
    {
      title: "Total Detections",
      value: stats.total_detections,
      description: "Recorded detection events",
      icon: Activity
    },
    {
      title: "Unread Alerts",
      value: stats.unread_alerts,
      description: "Alerts requiring attention",
      icon: Bell
    }
  ];

  const renderEmpty = (title, description) => (
    <div className="empty-state">
      <div className="empty-icon">
        <Activity size={30} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );

  const renderOverview = () => (
    <>
      <div className="welcome">
        <div>
          <h1>Welcome, Administrator</h1>
          <p>
            Centralized monitoring and management of road safety operations.
          </p>
        </div>

        <button className="refresh-btn" onClick={fetchData}>
          <RefreshCw size={16} /> Refresh Data
        </button>
      </div>

      <div className="stats-grid">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <div className="stat-card" key={item.title}>
              <div className="stat-top">
                <span>{item.title}</span>
                <div className="stat-icon">
                  <Icon size={21} />
                </div>
              </div>

              <h2>{loading ? "—" : item.value}</h2>
              <small>{item.description}</small>
            </div>
          );
        })}
      </div>

      <div className="section-heading">
        <h2>System Monitoring</h2>

        <span className="system-indicator">
          <i />
          {error ? "Connection Issue" : loading ? "Connecting" : "Connected"}
        </span>
      </div>

      {error && (
        <div className="error-banner">
          <AlertTriangle size={18} />
          <span>{error}</span>
          <button onClick={fetchData}>Retry</button>
        </div>
      )}

      <div className="monitor-grid">
        <div className="panel">
          <div className="panel-heading">
            <h3>
              <Camera size={19} /> CCTV Camera Status
            </h3>

            <button
              className="text-btn"
              onClick={() => setActive("CCTV Monitoring")}
            >
              View All <ChevronRight size={15} />
            </button>
          </div>

          {loading ? (
            renderEmpty("Loading cameras", "Retrieving camera information.")
          ) : error ? (
            renderEmpty("Camera information unavailable", error)
          ) : cameras.length === 0 ? (
            renderEmpty(
              "No registered cameras",
              "Camera information will appear here when available."
            )
          ) : (
            <div className="overview-camera-list">
              {cameras.slice(0, 4).map((camera) => (
                <div className="overview-camera" key={camera.id}>
                  <div className="camera-small-icon">
                    <Camera size={19} />
                  </div>

                  <div className="overview-camera-info">
                    <strong>{camera.camera_name}</strong>
                    <small>{camera.location}</small>
                  </div>

                  <span
                    className={`camera-status ${
                      camera.status?.toLowerCase() === "online"
                        ? "online"
                        : "offline"
                    }`}
                  >
                    {camera.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-heading">
            <h3>
              <Activity size={19} /> Detection Modules
            </h3>
          </div>

          {[
            "Road Obstruction Detection",
            "Accident Detection",
            "Vehicle Detection",
            "Speed Monitoring",
            "Traffic Monitoring",
            "Bridge Overflow Detection"
          ].map((item) => (
            <div className="detection-item" key={item}>
              <span>{item}</span>
              <span className="not-connected">Not connected</span>
            </div>
          ))}

          <div className="system-box">
            <Radio size={20} />
            <div>
              <strong>Detection Processing</strong>
              <p>AI processing service status unavailable</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="panel">
          <div className="panel-heading">
            <h3>
              <Construction size={19} /> Road Obstruction Monitoring
            </h3>

            <button
              className="text-btn"
              onClick={() => setActive("Road Obstruction")}
            >
              View Details <ChevronRight size={15} />
            </button>
          </div>

          {renderEmpty(
            "Obstructions Defined: " + stats.total_obstructions,
            "Active: " + stats.active_obstructions +
            " | Critical: " + stats.critical_obstructions
          )}
        </div>

        <div className="panel">
          <div className="panel-heading">
            <h3>
              <Bell size={19} /> Emergency Alerts
            </h3>

            <button
              className="text-btn"
              onClick={() => setActive("Emergency Alerts")}
            >
              View Details <ChevronRight size={15} />
            </button>
          </div>

          {renderEmpty(
            "Unread Alerts: " + stats.unread_alerts,
            "Emergency alert records will appear here."
          )}
        </div>
      </div>
    </>
  );

  const renderModule = () => {
    const module = menu.find((item) => item.name === active);
    const Icon = module?.icon || Activity;

    const descriptions = {
      "Accident Detection":
        "Review accident detection events and incident locations.",
      "Vehicle Detection":
        "Monitor vehicles identified by the detection system.",
      "Speed Monitoring":
        "Review vehicle speed measurements and violations.",
      "Traffic Monitoring":
        "Monitor traffic density and road movement.",
      "Emergency Alerts":
        "Review and manage emergency notifications.",
      "Reports":
        "Access road safety reports and system summaries."
    };

    return (
      <div className="panel module-page">
        <div className="module-icon">
          <Icon size={34} />
        </div>

        <h2>{active}</h2>
        <p>{descriptions[active]}</p>

        {renderEmpty(
          "No information available",
          "This module will display information when its backend service is integrated."
        )}
      </div>
    );
  };

  return (
    <div className="app">
      <aside className={`sidebar ${mobileMenu ? "show" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h2>ROADSAFE</h2>
            <span>INTELLIGENT SYSTEM</span>
          </div>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav>
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  active === item.name ? "selected" : ""
                }`}
                onClick={() => {
                  setActive(item.name);
                  setMobileMenu(false);
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="admin-avatar">A</div>

          <div>
            <strong>Administrator</strong>
            <small>System Manager</small>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <Menu />
          </button>

          <div>
            <h2>{active}</h2>
            <p>Smart Road Safety Management System</p>
          </div>

          <div className="top-actions">
            <span className="system-status">
              <i />
              {error ? "Disconnected" : loading ? "Connecting" : "Connected"}
            </span>

            <button
              className="notification"
              onClick={() => setActive("Emergency Alerts")}
            >
              <Bell size={20} />
            </button>

            <div className="profile">AD</div>
          </div>
        </header>

        <section className="content">
          {active === "Overview" && renderOverview()}

          {active === "CCTV Monitoring" && (
            <CameraManagement />
          )}

          {active === "Road Obstruction" && (
            <RoadObstruction />
          )}

          {active === "Settings" && (
            <SettingsPage />
          )}

          {active !== "Overview" &&
            active !== "CCTV Monitoring" &&
            active !== "Road Obstruction" &&
            active !== "Settings" &&
            renderModule()}

          <footer className="footer">
            Smart Road Safety System © 2026 | Administration

            {lastUpdated && (
              <span>
                {" "}· Last updated{" "}
                {lastUpdated.toLocaleTimeString("en-IN")}
              </span>
            )}
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
