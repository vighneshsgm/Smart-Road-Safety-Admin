
import React, { useState } from "react";
import {
  LayoutDashboard, Camera, Car, AlertTriangle,
  Gauge, Map, Bell, FileText, Settings,
  Menu, Activity, ShieldCheck,
  Radio, Eye, Clock, CheckCircle, Construction
} from "lucide-react";
import "./App.css";

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

const stats = [
  { title: "Total Cameras", value: "24", note: "Registered cameras", icon: Camera },
  { title: "Active Cameras", value: "18", note: "Currently connected", icon: Eye },
  { title: "Vehicles Detected", value: "1,284", note: "Demo count today", icon: Car },
  { title: "Accident Alerts", value: "03", note: "Demo incidents", icon: AlertTriangle }
];

const detectionItems = [
  "Road Obstruction",
  "Accident Detection",
  "Vehicle Detection",
  "Speed Detection"
];

function App() {
  const [active, setActive] = useState("Overview");
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="app">
      <aside className={`sidebar ${mobileMenu ? "show" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><ShieldCheck size={25}/></div>
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
                className={`nav-item ${active === item.name ? "selected" : ""}`}
                onClick={() => {
                  setActive(item.name);
                  setMobileMenu(false);
                }}
              >
                <Icon size={19}/>
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
          <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)}>
            <Menu/>
          </button>

          <div>
            <h2>{active}</h2>
            <p>Smart City Road Safety & Accident Detection</p>
          </div>

          <div className="top-actions">
            <span className="system-status">
              <i/> System Demo
            </span>
            <button className="notification"><Bell size={20}/></button>
            <div className="profile">AD</div>
          </div>
        </header>

        <section className="content">
          <div className="welcome">
            <div>
              <h1>Welcome, Administrator</h1>
              <p>Monitor road safety activities from one place.</p>
            </div>
            <span className="date"><Clock size={16}/> Live Dashboard</span>
          </div>

          {active === "Overview" ? (
            <>
              <div className="stats-grid">
                {stats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div className="stat-card" key={item.title}>
                      <div className="stat-top">
                        <span>{item.title}</span>
                        <div className="stat-icon"><Icon size={21}/></div>
                      </div>
                      <h2>{item.value}</h2>
                      <small>{item.note}</small>
                    </div>
                  );
                })}
              </div>

              <div className="section-heading">
                <h2>Monitoring Center</h2>
                <span className="live"><i/> DEMO VIEW</span>
              </div>

              <div className="monitor-grid">
                <div className="panel camera-panel">
                  <div className="panel-heading">
                    <h3><Camera size={19}/> CCTV Camera Feeds</h3>
                    <span>2 Sample Cameras</span>
                  </div>

                  <div className="camera-grid">
                    <div className="camera-box">
                      <div className="camera-overlay">
                        <span><i/> CAM 01</span>
                        <span>DEMO FEED</span>
                      </div>
                      <Camera size={42}/>
                      <p>Camera Feed Placeholder</p>
                    </div>

                    <div className="camera-box">
                      <div className="camera-overlay">
                        <span><i/> CAM 02</span>
                        <span>DEMO FEED</span>
                      </div>
                      <Camera size={42}/>
                      <p>Camera Feed Placeholder</p>
                    </div>
                  </div>
                </div>

                <div className="panel detection-panel">
                  <div className="panel-heading">
                    <h3><Activity size={19}/> AI Detection Status</h3>
                  </div>

                  {detectionItems.map((item) => (
                    <div className="detection-item" key={item}>
                      <span>{item}</span>
                      <b className="green">Ready for integration</b>
                    </div>
                  ))}

                  <div className="system-box">
                    <Radio size={20}/>
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
                    <h3><Construction size={19}/> Road Obstruction Monitoring</h3>
                    <span>Monitoring pending</span>
                  </div>
                  <div className="map-placeholder">
                    <Map size={42}/>
                    <strong>Road Status Monitoring</strong>
                    <p>Road closed, construction and water alerts will appear here.</p>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-heading">
                    <h3><Bell size={19}/> Recent Alerts</h3>
                    <span>Sample records</span>
                  </div>

                  <div className="alert-item">
                    <Construction className="orange" size={20}/>
                    <div>
                      <strong>Road Obstruction</strong>
                      <small>Sample record · Road Status</small>
                    </div>
                  </div>

                  <div className="alert-item">
                    <AlertTriangle className="red" size={20}/>
                    <div>
                      <strong>Accident Alert</strong>
                      <small>Sample incident · Camera 01</small>
                    </div>
                  </div>

                  <div className="alert-item">
                    <CheckCircle className="green" size={20}/>
                    <div>
                      <strong>System Status</strong>
                      <small>Dashboard running in demo mode</small>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="panel module-page">
              <div className="module-icon">
                {React.createElement(
                  menu.find(m => m.name === active).icon,
                  { size: 35 }
                )}
              </div>

              <h2>{active}</h2>

              <p>This module is part of the Smart Road Safety System.</p>

              <p>
                Backend, database and AI integration will be added
                in the next development phase.
              </p>

              <span className="module-status">Frontend module planned</span>
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
