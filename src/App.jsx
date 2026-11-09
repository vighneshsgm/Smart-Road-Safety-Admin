
import React, { useState } from "react";
import {
  LayoutDashboard, Camera, Car, AlertTriangle,
  Gauge, Map, Bell, FileText, Settings,
  Menu, Activity, ShieldCheck, Radio,
  Eye, Clock, CheckCircle, Construction,
  MapPin, Wifi, WifiOff, Search, X,
  Droplets, RefreshCw
} from "lucide-react";

import "./App.css";

// SIDEBAR MENU
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

// DASHBOARD STATISTICS
const stats = [
  {
    title: "Total Cameras",
    value: "24",
    note: "Registered cameras",
    icon: Camera
  },
  {
    title: "Active Cameras",
    value: "18",
    note: "Currently connected",
    icon: Eye
  },
  {
    title: "Vehicles Detected",
    value: "1,284",
    note: "Demo count today",
    icon: Car
  },
  {
    title: "Accident Alerts",
    value: "03",
    note: "Demo incidents",
    icon: AlertTriangle
  }
];

// AI DETECTION MODULES
const detectionItems = [
  "Road Obstruction",
  "Accident Detection",
  "Vehicle Detection",
  "Speed Detection"
];

// CAMERA SAMPLE DATA
const cameraData = [
  {
    id: "CAM-001",
    location: "Main Road Junction",
    status: "Online",
    type: "Demo Feed"
  },
  {
    id: "CAM-002",
    location: "Bridge Monitoring",
    status: "Online",
    type: "Demo Feed"
  },
  {
    id: "CAM-003",
    location: "College Road",
    status: "Offline",
    type: "No Signal"
  },
  {
    id: "CAM-004",
    location: "City Main Road",
    status: "Online",
    type: "Demo Feed"
  }
];

// ROAD OBSTRUCTION SAMPLE DATA
const initialAlerts = [
  {
    id: 1,
    type: "Road Closed",
    location: "Main Road Junction",
    severity: "High",
    time: "10:30 AM",
    status: "Pending"
  },
  {
    id: 2,
    type: "Under Construction",
    location: "College Road",
    severity: "Medium",
    time: "11:15 AM",
    status: "Verified"
  },
  {
    id: 3,
    type: "Water Flow",
    location: "Bridge Monitoring",
    severity: "Critical",
    time: "12:05 PM",
    status: "Pending"
  },
  {
    id: 4,
    type: "Bridge Overflow",
    location: "River Bridge",
    severity: "Critical",
    time: "01:20 PM",
    status: "Pending"
  }
];

// ALERT ICON
function getAlertIcon(type) {
  if (type === "Water Flow" || type === "Bridge Overflow") {
    return Droplets;
  }

  if (type === "Road Closed") {
    return AlertTriangle;
  }

  return Construction;
}

function App() {

  const [active, setActive] = useState("Overview");
  const [mobileMenu, setMobileMenu] = useState(false);

  const [cameras] = useState(cameraData);

  const [alerts, setAlerts] = useState(initialAlerts);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedCamera, setSelectedCamera] = useState(null);

  // VERIFY ALERT
  const verifyAlert = (id) => {
    setAlerts((previous) =>
      previous.map((alert) =>
        alert.id === id
          ? { ...alert, status: "Verified" }
          : alert
      )
    );
  };

  // RESOLVE ALERT
  const resolveAlert = (id) => {
    setAlerts((previous) =>
      previous.map((alert) =>
        alert.id === id
          ? { ...alert, status: "Resolved" }
          : alert
      )
    );
  };

  // FILTER ALERTS
  const filteredAlerts = alerts.filter((alert) => {

    const matchesSearch =
      alert.type.toLowerCase().includes(search.toLowerCase()) ||
      alert.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || alert.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // CAMERA COUNTS
  const onlineCameras = cameras.filter(
    (camera) => camera.status === "Online"
  ).length;

  // REUSABLE ALERT TABLE
  const AlertManagement = () => (
    <div className="panel">

      <div className="panel-heading">
        <h3>
          <Construction size={19} />
          Road Obstruction Records
        </h3>

        <span>{filteredAlerts.length} Records</span>
      </div>

      <div className="alert-controls">

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search location or obstruction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Verified">Verified</option>
          <option value="Resolved">Resolved</option>
        </select>

      </div>

      <div className="table-wrapper">

        <table className="alert-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Obstruction</th>
              <th>Location</th>
              <th>Severity</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredAlerts.map((alert) => {

              const Icon = getAlertIcon(alert.type);

              return (
                <tr key={alert.id}>

                  <td>#{alert.id}</td>

                  <td>
                    <span className="alert-type">
                      <Icon size={17} />
                      {alert.type}
                    </span>
                  </td>

                  <td>
                    <span className="location-text">
                      <MapPin size={15} />
                      {alert.location}
                    </span>
                  </td>

                  <td>
                    <span className={`severity ${alert.severity.toLowerCase()}`}>
                      {alert.severity}
                    </span>
                  </td>

                  <td>{alert.time}</td>

                  <td>
                    <span className={`status-badge ${alert.status.toLowerCase()}`}>
                      {alert.status}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">

                      {alert.status === "Pending" && (
                        <button
                          className="verify-btn"
                          onClick={() => verifyAlert(alert.id)}
                        >
                          Verify
                        </button>
                      )}

                      {alert.status !== "Resolved" && (
                        <button
                          className="resolve-btn"
                          onClick={() => resolveAlert(alert.id)}
                        >
                          Resolve
                        </button>
                      )}

                      {alert.status === "Resolved" && (
                        <CheckCircle size={19} className="green" />
                      )}

                    </div>
                  </td>

                </tr>
              );
            })}

            {filteredAlerts.length === 0 && (
              <tr>
                <td colSpan="7" className="empty-state">
                  No matching alerts found.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>
    </div>
  );

  // CCTV MONITORING COMPONENT
  const CameraMonitoring = () => (
    <div className="panel">

      <div className="panel-heading">

        <h3>
          <Camera size={19} />
          CCTV Camera Monitoring
        </h3>

        <span>
          {onlineCameras} / {cameras.length} Online
        </span>

      </div>

      <div className="camera-grid">

        {cameras.map((camera) => (

          <div className="camera-card" key={camera.id}>

            <div className="camera-box">

              <div className="camera-overlay">

                <span>
                  {camera.status === "Online" ? (
                    <Wifi size={15} />
                  ) : (
                    <WifiOff size={15} />
                  )}

                  {camera.id}
                </span>

                <span>
                  {camera.status.toUpperCase()}
                </span>

              </div>

              {camera.status === "Online" ? (
                <Camera size={42} />
              ) : (
                <WifiOff size={42} />
              )}

              <p>
                {camera.status === "Online"
                  ? "Demo Feed - No Live Video"
                  : "Camera Offline - No Signal"}
              </p>

            </div>

            <div className="camera-info">

              <h4>{camera.location}</h4>

              <p>
                <MapPin size={14} />
                {camera.id}
              </p>

              <div className="camera-footer">

                <span className={`status-badge ${camera.status.toLowerCase()}`}>
                  {camera.status}
                </span>

                <button
                  className="verify-btn"
                  onClick={() => setSelectedCamera(camera)}
                >
                  <Eye size={15} /> View Details
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {selectedCamera && (
        <div className="camera-detail">

          <button
            className="close-detail"
            onClick={() => setSelectedCamera(null)}
          >
            <X size={18} />
          </button>

          <h3>Camera Details</h3>

          <p>Camera ID: {selectedCamera.id}</p>
          <p>Location: {selectedCamera.location}</p>
          <p>Status: {selectedCamera.status}</p>
          <p>Feed Type: {selectedCamera.type}</p>

          <small>
            This is sample camera information.
            Actual CCTV integration is pending.
          </small>

        </div>
      )}

    </div>
  );

  return (

    <div className="app">

      {/* SIDEBAR */}

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
                  setSearch("");
                  setStatusFilter("All");
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

      {/* MAIN CONTENT */}

      <main className="main">

        {/* TOPBAR */}

        <header className="topbar">

          <button
            className="mobile-toggle"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <Menu />
          </button>

          <div>
            <h2>{active}</h2>
            <p>Smart City Road Safety & Accident Detection</p>
          </div>

          <div className="top-actions">

            <span className="system-status">
              <i /> System Demo
            </span>

            <button className="notification">
              <Bell size={20} />
            </button>

            <div className="profile">AD</div>

          </div>

        </header>

        {/* DASHBOARD BODY */}

        <section className="content">

          <div className="welcome">

            <div>
              <h1>Welcome, Administrator</h1>
              <p>Monitor road safety activities from one place.</p>
            </div>

            <span className="date">
              <Clock size={16} />
              Live Dashboard
            </span>

          </div>

          {/* OVERVIEW */}

          {active === "Overview" && (

            <>

              <div className="stats-grid">

                {stats.map((item) => {

                  const Icon = item.icon;

                  return (

                    <div className="stat-card" key={item.title}>

                      <div className="stat-top">

                        <span>{item.title}</span>

                        <div className="stat-icon">
                          <Icon size={21} />
                        </div>

                      </div>

                      <h2>{item.value}</h2>
                      <small>{item.note}</small>

                    </div>

                  );

                })}

              </div>

              <div className="section-heading">

                <h2>Monitoring Center</h2>

                <span className="live">
                  <i /> DEMO VIEW
                </span>

              </div>

              <div className="monitor-grid">

                <div className="panel camera-panel">

                  <div className="panel-heading">

                    <h3>
                      <Camera size={19} />
                      CCTV Camera Feeds
                    </h3>

                    <span>{cameras.length} Sample Cameras</span>

                  </div>

                  <div className="camera-grid">

                    {cameras.slice(0, 2).map((camera) => (

                      <div className="camera-box" key={camera.id}>

                        <div className="camera-overlay">

                          <span>
                            <i /> {camera.id}
                          </span>

                          <span>{camera.status}</span>

                        </div>

                        <Camera size={42} />

                        <p>{camera.location}</p>

                      </div>

                    ))}

                  </div>

                  <button
                    className="verify-btn"
                    onClick={() => setActive("CCTV Monitoring")}
                  >
                    View All Cameras
                  </button>

                </div>

                <div className="panel detection-panel">

                  <div className="panel-heading">

                    <h3>
                      <Activity size={19} />
                      AI Detection Status
                    </h3>

                  </div>

                  {detectionItems.map((item) => (

                    <div className="detection-item" key={item}>

                      <span>{item}</span>

                      <b className="green">Ready for integration</b>

                    </div>

                  ))}

                  <div className="system-box">

                    <Radio size={20} />

                    <div>
                      <strong>AI Processing Module</strong>
                      <p>Waiting for backend connection</p>
                    </div>

                  </div>

                </div>

              </div>

              <div className="bottom-grid">

                <div className="panel">

                  <div className="panel-heading">

                    <h3>
                      <Construction size={19} />
                      Road Obstruction Monitoring
                    </h3>

                    <span>Sample Records</span>

                  </div>

                  <div className="map-placeholder">

                    <Map size={42} />

                    <strong>Road Status Monitoring</strong>

                    <p>
                      Road closed, construction and water alerts
                      will appear here.
                    </p>

                    <button
                      className="verify-btn"
                      onClick={() => setActive("Road Obstruction")}
                    >
                      Manage Obstructions
                    </button>

                  </div>

                </div>

                <div className="panel">

                  <div className="panel-heading">

                    <h3>
                      <Bell size={19} />
                      Recent Alerts
                    </h3>

                    <span>Sample Records</span>

                  </div>

                  {alerts.slice(0, 3).map((alert) => {

                    const Icon = getAlertIcon(alert.type);

                    return (

                      <div className="alert-item" key={alert.id}>

                        <Icon className="orange" size={20} />

                        <div>
                          <strong>{alert.type}</strong>
                          <small>
                            {alert.location} · {alert.status}
                          </small>
                        </div>

                      </div>

                    );

                  })}

                </div>

              </div>

            </>

          )}

          {/* CCTV MODULE */}

          {active === "CCTV Monitoring" && (

            <CameraMonitoring />

          )}

          {/* ROAD OBSTRUCTION MODULE */}

          {active === "Road Obstruction" && (

            <>

              <div className="stats-grid">

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Total Alerts</span>
                    <div className="stat-icon">
                      <AlertTriangle size={21} />
                    </div>
                  </div>
                  <h2>{alerts.length}</h2>
                  <small>Sample obstruction records</small>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Pending</span>
                    <div className="stat-icon">
                      <Clock size={21} />
                    </div>
                  </div>
                  <h2>
                    {alerts.filter(a => a.status === "Pending").length}
                  </h2>
                  <small>Awaiting verification</small>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Verified</span>
                    <div className="stat-icon">
                      <Eye size={21} />
                    </div>
                  </div>
                  <h2>
                    {alerts.filter(a => a.status === "Verified").length}
                  </h2>
                  <small>Verified records</small>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Resolved</span>
                    <div className="stat-icon">
                      <CheckCircle size={21} />
                    </div>
                  </div>
                  <h2>
                    {alerts.filter(a => a.status === "Resolved").length}
                  </h2>
                  <small>Resolved records</small>
                </div>

              </div>

              <div className="section-heading">
                <h2>Obstruction Management</h2>
                <span className="live">DEMO DATA</span>
              </div>

              <AlertManagement />

            </>

          )}

          {/* EMERGENCY ALERTS */}

          {active === "Emergency Alerts" && (

            <>

              <div className="section-heading">
                <h2>Emergency Alert Center</h2>
                <span className="live">SAMPLE RECORDS</span>
              </div>

              <AlertManagement />

            </>

          )}

          {/* OTHER MODULES */}

          {![
            "Overview",
            "CCTV Monitoring",
            "Road Obstruction",
            "Emergency Alerts"
          ].includes(active) && (

            <div className="panel module-page">

              <div className="module-icon">

                {React.createElement(
                  menu.find(m => m.name === active).icon,
                  { size: 35 }
                )}

              </div>

              <h2>{active}</h2>

              <p>
                This module is part of the Smart Road Safety System.
              </p>

              <p>
                Backend, database and AI integration will be
                added in the next development phase.
              </p>

              <span className="module-status">
                Frontend module planned
              </span>

            </div>

          )}

          <footer>
            Smart Road Safety System © 2026 | Admin Panel
          </footer>

        </section>

      </main>

    </div>

  );

}

export default App;
