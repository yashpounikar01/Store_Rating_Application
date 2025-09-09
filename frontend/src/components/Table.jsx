import React, { useState } from "react";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";

const Table = ({ columns, data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div style={{ overflowX: "auto", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
        <thead style={{ backgroundColor: "#1f2937", color: "#fff" }}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                style={{
                  cursor: "pointer",
                  padding: "12px",
                  textAlign: "left",
                  userSelect: "none",
                  fontWeight: 600,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  {col.label}
                  {sortConfig.key === col.key ? (
                    sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />
                  ) : (
                    <FaSort style={{ opacity: 0.4 }} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr
              key={idx}
              style={{
                borderBottom: "1px solid #e5e7eb",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              {columns.map((col) => (
                <td key={col.key} style={{ padding: "12px", color: "#111827" }}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
