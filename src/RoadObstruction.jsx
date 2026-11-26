
import React, { useState } from "react";
import {
  Construction,
  Droplets,
  AlertTriangle,
  Ban,
  Search,
  RefreshCw,
  MapPin,
  Activity
} from "lucide-react";

const obstructionTypes = [
  { name: "Road Blockage", icon: Ban },
  { name: "Road Closed", icon: AlertTriangle },
  { name: "Under Construction", icon: Construction },
  { name: "Water Flowing", icon: Droplets },
  { name: "Bridge Overflow", icon: Activity }
];

function RoadObstruction() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  return (
    <div className="road-page">
      <div className="page-heading">
        <div>
          <h2>Road Obstruction Monitoring</h2>
          <p>Monitor road blockages, closures and bridge overflow.</p>
        </div>

        <span className="not-connected">Detection service not connected</span>
      </div>

      <div className="obstruction-summary">
        {obstructionTypes.map((item) => {
          const Icon = item.icon;

          return (
            <div className="summary-card" key={item.name}>
              <Icon size={27} />
              <div>
                <h3>—</h3>
                <p>{item.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel obstruction-panel">
        <div className="panel-heading">
          <h3>
            <Activity size={19} />
            Obstruction Records
          </h3>
          <span>Live records unavailable</span>
        </div>

        <div className="obstruction-toolbar">
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
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            {obstructionTypes.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <button
            className="refresh-btn"
            onClick={() => {
              setSearch("");
              setFilter("All");
            }}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>

        <div className="empty-state">
          <div className="empty-icon">
            <MapPin size={30} />
          </div>

          <h3>No obstruction records available</h3>

          <p>
            Road obstruction and bridge overflow records
            will appear here after backend and AI detection
            integration.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RoadObstruction;
