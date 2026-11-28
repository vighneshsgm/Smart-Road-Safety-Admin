
import { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  ShieldCheck,
  Bell,
  Camera,
  Database,
  Activity,
  Info,
  Save,
  RotateCcw,
  Lock,
  Mail,
  Globe,
  Clock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Server,
  Cpu,
  Monitor,
  LogOut,
  ChevronRight
} from "lucide-react";
import "./Settings.css";

const sections = [
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "profile", label: "Admin Profile", icon: User },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "cameras", label: "Camera & AI", icon: Camera },
  { id: "system", label: "System Health", icon: Activity },
  { id: "database", label: "Database", icon: Database },
  { id: "activity", label: "Activity Logs", icon: Monitor },
  { id: "about", label: "About System", icon: Info }
];

const initialSettings = {
  systemName: "Smart Road Safety System",
  organization: "Smart Road Safety Administration",
  language: "English",
  timezone: "Asia/Kolkata",
  adminName: "System Administrator",
  email: "admin@smartroadsafety.com",
  phone: "",
  twoFactor: false,
  sessionTimeout: "30",
  loginAlerts: true,
  roadAlerts: true,
  bridgeAlerts: true,
  trafficAlerts: true,
  emergencyAlerts: true,
  cameraAlerts: true,
  emailNotifications: true,
  soundNotifications: true,
  aiDetection: true,
  autoRefresh: true
};

function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(initialSettings);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [logs] = useState([
    { action: "Admin opened Settings", time: "Current session", type: "info" },
    { action: "Notification preferences loaded", time: "Current session", type: "success" },
    { action: "System configuration viewed", time: "Current session", type: "info" }
  ]);

  const update = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setMessage("");
  };

  const saveSettings = () => {
    localStorage.setItem("roadSafetySettings", JSON.stringify(settings));
    setMessage("Settings saved successfully on this browser.");
  };

  const resetSettings = () => {
    setSettings(initialSettings);
    setMessage("Settings restored to default values.");
  };

  const changePassword = () => {
    if (!password || password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setMessage("Password form validated. Connect the backend to update your account password.");
  };

  const Toggle = ({ label, description, value, onChange }) => (
    <div className="setting-toggle-row">
      <div className="setting-toggle-info">
        <strong>{label}</strong>
        <span>{description}</span>
      </div>
      <button
        type="button"
        className={`setting-switch ${value ? "active" : ""}`}
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        aria-label={label}
      >
        <span />
      </button>
    </div>
  );

  const Field = ({ label, value, onChange, placeholder, type = "text" }) => (
    <label className="setting-field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder || ""}
        onChange={e => onChange(e.target.value)}
      />
    </label>
  );

  const SelectField = ({ label, value, onChange, options }) => (
    <label className="setting-field">
      <span>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );

  const SectionHeading = ({ title, description }) => (
    <div className="settings-section-heading">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );

  const StatusCard = ({ icon: Icon, title, status, description, state = "pending" }) => (
    <div className="settings-status-card">
      <div className="settings-status-icon"><Icon size={21} /></div>
      <div className="settings-status-content">
        <strong>{title}</strong>
        <span>{description}</span>
        <small className={`settings-status-label ${state}`}>
          <span /> {status}
        </small>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <>
            <SectionHeading title="General Settings" description="Manage your application information and regional preferences." />
            <div className="settings-card">
              <h3><Globe size={18} /> Application Information</h3>
              <div className="settings-form-grid">
                <Field label="System Name" value={settings.systemName} onChange={v => update("systemName", v)} />
                <Field label="Organization Name" value={settings.organization} onChange={v => update("organization", v)} />
                <SelectField label="Language" value={settings.language} onChange={v => update("language", v)} options={[{ value: "English", label: "English" }, { value: "Marathi", label: "Marathi" }, { value: "Hindi", label: "Hindi" }]} />
                <SelectField label="Time Zone" value={settings.timezone} onChange={v => update("timezone", v)} options={[{ value: "Asia/Kolkata", label: "India Standard Time (IST)" }, { value: "UTC", label: "UTC" }]} />
              </div>
            </div>
            <div className="settings-card">
              <h3><Clock size={18} /> Dashboard Preferences</h3>
              <Toggle label="Automatic Dashboard Refresh" description="Allow dashboard information to refresh automatically." value={settings.autoRefresh} onChange={v => update("autoRefresh", v)} />
            </div>
          </>
        );

      case "profile":
        return (
          <>
            <SectionHeading title="Admin Profile" description="Manage your administrator account information." />
            <div className="settings-card">
              <div className="settings-profile-header">
                <div className="settings-avatar">SA</div>
                <div>
                  <h3>{settings.adminName}</h3>
                  <span>System Administrator</span>
                </div>
              </div>
              <div className="settings-form-grid">
                <Field label="Full Name" value={settings.adminName} onChange={v => update("adminName", v)} />
                <Field label="Email Address" type="email" value={settings.email} onChange={v => update("email", v)} />
                <Field label="Phone Number" value={settings.phone} placeholder="Enter phone number" onChange={v => update("phone", v)} />
                <Field label="Account Role" value="Administrator" onChange={() => {}} />
              </div>
            </div>
            <div className="settings-card">
              <h3><Lock size={18} /> Change Password</h3>
              <div className="settings-form-grid">
                <label className="setting-field">
                  <span>New Password</span>
                  <div className="settings-password">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 8 characters" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>
                <Field label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Re-enter password" />
              </div>
              <button className="settings-secondary-btn" onClick={changePassword}>Update Password</button>
            </div>
          </>
        );

      case "security":
        return (
          <>
            <SectionHeading title="Security Settings" description="Protect your administrator account and manage access security." />
            <div className="settings-card">
              <h3><ShieldCheck size={18} /> Account Protection</h3>
              <Toggle label="Two-Factor Authentication" description="Enable an additional authentication step for administrator login." value={settings.twoFactor} onChange={v => update("twoFactor", v)} />
              <Toggle label="Login Notifications" description="Receive notifications about administrator login activity." value={settings.loginAlerts} onChange={v => update("loginAlerts", v)} />
              <div className="settings-divider" />
              <div className="settings-form-grid">
                <SelectField label="Session Timeout" value={settings.sessionTimeout} onChange={v => update("sessionTimeout", v)} options={[{ value: "15", label: "15 Minutes" }, { value: "30", label: "30 Minutes" }, { value: "60", label: "1 Hour" }, { value: "120", label: "2 Hours" }]} />
              </div>
              <p className="settings-note"><AlertCircle size={16} /> Security preferences require backend authentication integration to enforce them.</p>
            </div>
          </>
        );

      case "notifications":
        return (
          <>
            <SectionHeading title="Notification Settings" description="Control alerts generated by the road safety monitoring system." />
            <div className="settings-card">
              <h3><Bell size={18} /> Detection Alerts</h3>
              <Toggle label="Road Obstruction Alerts" description="Notifications for road blockages and road closures." value={settings.roadAlerts} onChange={v => update("roadAlerts", v)} />
              <Toggle label="Bridge Overflow Alerts" description="Notifications for water flowing over bridges." value={settings.bridgeAlerts} onChange={v => update("bridgeAlerts", v)} />
              <Toggle label="Traffic Alerts" description="Notifications for traffic congestion and unusual traffic activity." value={settings.trafficAlerts} onChange={v => update("trafficAlerts", v)} />
              <Toggle label="Emergency Alerts" description="Important emergency and incident notifications." value={settings.emergencyAlerts} onChange={v => update("emergencyAlerts", v)} />
              <Toggle label="Camera Alerts" description="Notifications for camera disconnection and feed interruptions." value={settings.cameraAlerts} onChange={v => update("cameraAlerts", v)} />
            </div>
            <div className="settings-card">
              <h3><Mail size={18} /> Notification Channels</h3>
              <Toggle label="Email Notifications" description="Receive supported alerts through email." value={settings.emailNotifications} onChange={v => update("emailNotifications", v)} />
              <Toggle label="Sound Notifications" description="Play an alert sound for important events." value={settings.soundNotifications} onChange={v => update("soundNotifications", v)} />
            </div>
          </>
        );

      case "cameras":
        return (
          <>
            <SectionHeading title="Camera & AI Configuration" description="Manage monitoring preferences and detection settings." />
            <div className="settings-card">
              <h3><Camera size={18} /> Camera Monitoring</h3>
              <Toggle label="Camera Monitoring Alerts" description="Enable camera-related notification preferences." value={settings.cameraAlerts} onChange={v => update("cameraAlerts", v)} />
              <div className="settings-divider" />
              <StatusCard icon={Camera} title="Camera Integration" status="Not verified" description="Live camera connection requires backend verification." />
            </div>
            <div className="settings-card">
              <h3><Cpu size={18} /> AI Detection Configuration</h3>
              <Toggle label="AI Detection Preference" description="Enable the dashboard preference for AI detection." value={settings.aiDetection} onChange={v => update("aiDetection", v)} />
              <StatusCard icon={Cpu} title="AI Detection Service" status="Not connected" description="YOLO / OpenCV detection service integration pending." />
              <p className="settings-note"><AlertCircle size={16} /> Changing this preference does not start or stop the actual AI detection service.</p>
            </div>
          </>
        );

      case "system":
        return (
          <>
            <SectionHeading title="System Health" description="View the integration status of your road safety platform." />
            <div className="settings-status-grid">
              <StatusCard icon={Server} title="Backend API" status="Not verified" description="Flask API connection has not been checked here." />
              <StatusCard icon={Database} title="Database" status="Not verified" description="MySQL connection has not been checked here." />
              <StatusCard icon={Cpu} title="AI Detection" status="Not connected" description="Detection service status unavailable." />
              <StatusCard icon={Camera} title="CCTV Monitoring" status="Not verified" description="Live camera feeds have not been checked here." />
            </div>
            <div className="settings-card">
              <h3><Activity size={18} /> System Information</h3>
              <div className="settings-info-row"><span>Application</span><strong>Smart Road Safety System</strong></div>
              <div className="settings-info-row"><span>Frontend</span><strong>React + Vite</strong></div>
              <div className="settings-info-row"><span>Backend</span><strong>Python Flask</strong></div>
              <div className="settings-info-row"><span>Database</span><strong>MySQL</strong></div>
              <div className="settings-info-row"><span>AI Framework</span><strong>YOLO + OpenCV</strong></div>
            </div>
          </>
        );

      case "database":
        return (
          <>
            <SectionHeading title="Database Configuration" description="Database integration and connection information." />
            <div className="settings-card">
              <h3><Database size={18} /> Database Overview</h3>
              <div className="settings-info-row"><span>Database Engine</span><strong>MySQL</strong></div>
              <div className="settings-info-row"><span>Database Name</span><strong>smart_road_safety</strong></div>
              <div className="settings-info-row"><span>Connection Status</span><strong className="settings-muted">Not verified</strong></div>
              <div className="settings-info-row"><span>Connection Test</span><strong>Backend integration required</strong></div>
              <p className="settings-note"><AlertCircle size={16} /> Database credentials are intentionally not displayed in the dashboard.</p>
            </div>
            <div className="settings-card">
              <h3><ShieldCheck size={18} /> Data Security</h3>
              <p className="settings-description">Database credentials should remain in backend environment variables. Do not expose passwords or secret keys in frontend code.</p>
            </div>
          </>
        );

      case "activity":
        return (
          <>
            <SectionHeading title="Activity Logs" description="Review the activity recorded during this settings page session." />
            <div className="settings-card">
              <h3><Activity size={18} /> Recent Activity</h3>
              {logs.map((log, index) => (
                <div className="settings-log-row" key={index}>
                  <div className={`settings-log-icon ${log.type}`}><Activity size={17} /></div>
                  <div><strong>{log.action}</strong><span>{log.time}</span></div>
                </div>
              ))}
              <p className="settings-note"><AlertCircle size={16} /> These are session-level sample entries, not permanent audit logs. Connect the backend to retrieve actual admin activity.</p>
            </div>
          </>
        );

      case "about":
        return (
          <>
            <SectionHeading title="About System" description="Application information and project details." />
            <div className="settings-about">
              <div className="settings-about-logo"><ShieldCheck size={42} /></div>
              <h2>Smart Road Safety System</h2>
              <p>Intelligent Road Monitoring & Safety Administration Platform</p>
              <span className="settings-version">Version 1.0.0</span>
            </div>
            <div className="settings-card">
              <h3><Info size={18} /> Project Information</h3>
              <div className="settings-info-row"><span>Application</span><strong>Smart Road Safety System</strong></div>
              <div className="settings-info-row"><span>Panel</span><strong>Administrator Dashboard</strong></div>
              <div className="settings-info-row"><span>Technology</span><strong>React, Flask, MySQL, YOLO</strong></div>
              <div className="settings-info-row"><span>Purpose</span><strong>Road Safety Monitoring</strong></div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-topbar">
        <div>
          <div className="settings-breadcrumb">Dashboard <ChevronRight size={14} /> Settings</div>
          <h1>Settings</h1>
          <p>Manage your system preferences, security and configurations.</p>
        </div>
        <div className="settings-top-actions">
          <button className="settings-reset-btn" onClick={resetSettings}><RotateCcw size={16} /> Reset</button>
          <button className="settings-save-btn" onClick={saveSettings}><Save size={16} /> Save Changes</button>
        </div>
      </div>

      {message && (
        <div className="settings-message">
          <CheckCircle2 size={17} /> {message}
        </div>
      )}

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <div className="settings-sidebar-heading">PREFERENCES</div>
          {sections.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`settings-nav-item ${activeTab === item.id ? "selected" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                <ChevronRight size={15} />
              </button>
            );
          })}
          <div className="settings-sidebar-footer">
            <ShieldCheck size={17} />
            <span>Administrator Access</span>
          </div>
        </aside>

        <main className="settings-main">
          {renderContent()}
          <div className="settings-bottom-actions">
            <span>Make sure to save your changes.</span>
            <button className="settings-save-btn" onClick={saveSettings}><Save size={16} /> Save Changes</button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;
