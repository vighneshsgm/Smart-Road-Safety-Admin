
import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Camera,
  X,
  RefreshCw,
  Wifi,
  WifiOff,
  MapPin
} from "lucide-react";
import "./CameraManagement.css";

const API_URL = "http://127.0.0.1:5000/api";

const emptyForm = {
  camera_name: "",
  camera_code: "",
  location: "",
  latitude: "",
  longitude: "",
  status: "offline"
};

export default function CameraManagement() {
  const [cameras, setCameras] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCameras = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/cameras`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load cameras");
      }

      setCameras(data.cameras || []);
    } catch (err) {
      setError(err.message || "Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (camera) => {
    setEditingId(camera.id);
    setForm({
      camera_name: camera.camera_name || "",
      camera_code: camera.camera_code || "",
      location: camera.location || "",
      latitude: camera.latitude ?? "",
      longitude: camera.longitude ?? "",
      status: camera.status || "offline"
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      latitude: form.latitude === "" ? null : Number(form.latitude),
      longitude: form.longitude === "" ? null : Number(form.longitude)
    };

    try {
      const response = await fetch(
        editingId
          ? `${API_URL}/cameras/${editingId}`
          : `${API_URL}/cameras`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Camera could not be saved");
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await fetchCameras();
    } catch (err) {
      setError(err.message || "Unable to save camera");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cameraId) => {
    if (!window.confirm("Are you sure you want to delete this camera?")) {
      return;
    }

    setError("");

    try {
      const response = await fetch(`${API_URL}/cameras/${cameraId}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Camera could not be deleted");
      }

      await fetchCameras();
    } catch (err) {
      setError(err.message || "Unable to delete camera");
    }
  };

  const filteredCameras = cameras.filter((camera) => {
    const searchMatch = [
      camera.camera_name,
      camera.camera_code,
      camera.location
    ].some((value) =>
      String(value || "").toLowerCase().includes(search.toLowerCase())
    );

    const statusMatch =
      filter === "all" || camera.status?.toLowerCase() === filter;

    return searchMatch && statusMatch;
  });

  const onlineCount = cameras.filter(
    (camera) => camera.status?.toLowerCase() === "online"
  ).length;

  const offlineCount = cameras.length - onlineCount;

  return (
    <section className="camera-management">
      <div className="cm-heading">
        <div>
          <h2>Camera Management</h2>
          <p>Manage and monitor registered CCTV cameras</p>
        </div>

        <div className="cm-heading-actions">
          <button className="cm-refresh" onClick={fetchCameras}>
            <RefreshCw size={16} />
            Refresh
          </button>

          <button className="cm-add" onClick={openAddForm}>
            <Plus size={17} />
            Add Camera
          </button>
        </div>
      </div>

      <div className="cm-stats">
        <div className="cm-stat">
          <Camera size={21} />
          <div>
            <span>Total Cameras</span>
            <strong>{cameras.length}</strong>
          </div>
        </div>

        <div className="cm-stat">
          <Wifi size={21} />
          <div>
            <span>Online Cameras</span>
            <strong>{onlineCount}</strong>
          </div>
        </div>

        <div className="cm-stat">
          <WifiOff size={21} />
          <div>
            <span>Offline Cameras</span>
            <strong>{offlineCount}</strong>
          </div>
        </div>
      </div>

      <div className="cm-toolbar">
        <div className="cm-search">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search camera, code or location..."
          />
        </div>

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Cameras</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {error && <div className="cm-error">{error}</div>}

      {loading ? (
        <div className="cm-empty">Loading cameras...</div>
      ) : filteredCameras.length === 0 ? (
        <div className="cm-empty">
          <Camera size={34} />
          <h3>No cameras found</h3>
          <p>No camera records match your search.</p>
        </div>
      ) : (
        <div className="cm-table-wrap">
          <table className="cm-table">
            <thead>
              <tr>
                <th>Camera</th>
                <th>Camera Code</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCameras.map((camera) => (
                <tr key={camera.id}>
                  <td>
                    <div className="cm-camera-name">
                      <span className="cm-camera-icon">
                        <Camera size={18} />
                      </span>
                      <strong>{camera.camera_name}</strong>
                    </div>
                  </td>

                  <td>{camera.camera_code}</td>

                  <td>
                    <span className="cm-location">
                      <MapPin size={14} />
                      {camera.location}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`cm-status ${
                        camera.status?.toLowerCase() === "online"
                          ? "online"
                          : "offline"
                      }`}
                    >
                      {camera.status || "Unknown"}
                    </span>
                  </td>

                  <td>
                    <div className="cm-actions">
                      <button
                        className="cm-edit"
                        title="Edit camera"
                        onClick={() => openEditForm(camera)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="cm-delete"
                        title="Delete camera"
                        onClick={() => handleDelete(camera.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="cm-modal-backdrop">
          <form className="cm-modal" onSubmit={handleSubmit}>
            <div className="cm-modal-heading">
              <div>
                <h3>{editingId ? "Edit Camera" : "Add New Camera"}</h3>
                <p>Enter camera details</p>
              </div>

              <button
                type="button"
                className="cm-close"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <label>Camera Name</label>
            <input
              name="camera_name"
              value={form.camera_name}
              onChange={handleChange}
              placeholder="Enter camera name"
              required
            />

            <label>Camera Code</label>
            <input
              name="camera_code"
              value={form.camera_code}
              onChange={handleChange}
              placeholder="Enter unique camera code"
              required
            />

            <label>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Enter camera location"
              required
            />

            <div className="cm-form-row">
              <div>
                <label>Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  placeholder="Latitude"
                />
              </div>

              <div>
                <label>Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  placeholder="Longitude"
                />
              </div>
            </div>

            <label>Camera Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>

            <div className="cm-modal-actions">
              <button
                type="button"
                className="cm-cancel"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button type="submit" className="cm-save" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Camera"
                  : "Save Camera"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
