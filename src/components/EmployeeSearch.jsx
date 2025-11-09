import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from "./ConfirmDialog";
import './EmployeeSearch.css';

const EmployeeSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Added: Directorates and Divisions state
  const [directorates, setDirectorates] = useState([]);
  const [divisions, setDivisions] = useState([]);

  const navigate = useNavigate();

  // On mount, fetch all lookup data
  useEffect(() => {
    fetchDirectorates();
    fetchDivisions();
    fetchEmployees();
  }, []);

  // Fetch helpers for name lookup
  const fetchDirectorates = async () => {
    try {
      const resp = await axios.get("http://localhost:8080/api/directorates");
      setDirectorates(resp.data);
    } catch {
      toast.error("Failed to load directorates.");
    }
  };

  const fetchDivisions = async () => {
    try {
      const resp = await axios.get("http://localhost:8080/api/divisions");
      setDivisions(resp.data);
    } catch {
      toast.error("Failed to load divisions.");
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.get("http://localhost:8080/api/employees");
      setAllEmployees(resp.data);
      setResults(resp.data);
    } catch (err) {
      setError("Failed to load employees. Make sure backend is running.");
      setResults([]);
    }
    setLoading(false);
  };

  // Flexible search by ID (digits) or Name (text)
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults(allEmployees);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (/^\d+$/.test(query.trim())) {
        // Search by ID
        const resp = await axios.get(
          `http://localhost:8080/api/employees/${query.trim()}`
        );
        setResults(resp.data ? [resp.data] : []);
        if (!resp.data) setError("No employee found with that ID.");
      } else {
        // Search by name
        const resp = await axios.get(
          `http://localhost:8080/api/employees/search?name=${encodeURIComponent(query)}`
        );
        setResults(resp.data);
        if (resp.data.length === 0) setError("No employees found with that name.");
      }
    } catch (err) {
      setError("Search failed or employee not found.");
      setResults([]);
    }
    setLoading(false);
  };

  const clearSearch = () => {
    setQuery("");
    setResults(allEmployees);
    setError(null);
  };

  const handleEdit = (empId) => navigate(`/edit-employee/${empId}`);

  const handleDeleteClick = (empId) => {
    setDeletingId(empId);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setConfirmOpen(false);
    try {
      await axios.delete(`http://localhost:8080/api/employees/${deletingId}`);
      toast.success("Deleted!");
      fetchEmployees();
    } catch {
      toast.error("Failed to delete!");
    }
    setDeletingId(null);
  };

  // Lookup helpers
  const getDirectorateName = (id) => {
    const found = directorates.find(d => d.directorateId === id || d.directorateId === Number(id));
    return found ? found.name : id;
  };
  const getDivisionName = (id) => {
    const found = divisions.find(d => d.divisionId === id || d.divisionId === Number(id));
    return found ? found.name : id;
  };

  return (
    <div className="employee-search" style={{ maxWidth: 950, margin: "0 auto" }}>
      <h2 style={{ textAlign: 'center', margin: '1.5em 0 1em', color: '#2c2244', fontWeight: 700 }}>
        Search Employees
      </h2>
      <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 27 }}>
        <input
          type="text"
          placeholder="Enter employee name or ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "0.6em 1em", borderRadius: 8, border: '1.5px solid #AAA', minWidth: 270,
            fontSize: '1rem', fontFamily: 'inherit'
          }}
        />
        <button type="submit" disabled={loading}
          style={{
            background: "#6d44a8", color: "white", border: "none", padding: "0.55em 1.4em",
            borderRadius: 6, fontWeight: 600, cursor: "pointer"
          }}>
          {loading ? "Searching..." : "Search"}
        </button>
        {query && (
          <button type="button" onClick={clearSearch}
            style={{
              background: "white", color: "#6d44a8", border: "1.5px solid #6d44a8", padding: "0.54em 1.2em",
              borderRadius: 6, fontWeight: 600, cursor: "pointer"
            }}>
            Clear
          </button>
        )}
      </form>
      {error && <p style={{ color: '#d7263d', textAlign: 'center', fontWeight: 500 }}>{error}</p>}
      <div style={{ overflowX: "auto", marginTop: 18, borderRadius: 14, boxShadow: "0 8px 32px #aaa", background: "#fff" }}>
        <table style={{
          borderCollapse: "collapse", width: "100%", minWidth: 870, background: "#fff",
          fontSize: "1rem"
        }}>
          <thead>
            <tr style={{ background: "linear-gradient(90deg, #6d44a8 70%, #d6a4a4 100%)", color: "#fff" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Directorate</th>
              <th style={thStyle}>Division</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 && !loading && !error ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "1em" }}>No employees to display.</td></tr>
            ) : (
              results.map((emp, idx) => (
                <tr key={emp.empId}
                  style={{
                    background: idx % 2 === 0 ? "#f5f4fb" : "#fff",
                    transition: ".2s", cursor: "pointer"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#eee5fa"}
                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "#f5f4fb" : "#fff"}
                >
                  <td style={tdStyle}>{emp.empId}</td>
                  <td style={tdStyle}>{emp.empName}</td>
                  <td style={tdStyle}>{emp.phone}</td>
                  <td style={tdStyle}>{getDirectorateName(emp.directorate)}</td>
                  <td style={tdStyle}>{getDivisionName(emp.division)}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <button onClick={() => handleEdit(emp.empId)} style={editBtnStyle}>Update</button>
                    <button onClick={() => handleDeleteClick(emp.empId)} style={delBtnStyle}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Employee"
        message="Are you sure you want to delete this employee?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

const thStyle = {
  padding: "0.85em 1.5em",
  fontWeight: 600,
  fontSize: "1.01em"
};
const tdStyle = {
  padding: "0.7em 1.1em",
  border: "none",
  fontSize: "1em",
  color: "#232b3d",
};
const editBtnStyle = {
  background: "linear-gradient(90deg, #5be7c4 50%, #59c3e2 100%)",
  color: "#25344e",
  border: "none",
  borderRadius: 6,
  padding: "0.38em 1.2em",
  fontWeight: 600,
  marginRight: 8,
  cursor: "pointer"
};
const delBtnStyle = {
  background: "#eb3f31",
  color: "white",
  border: "none",
  borderRadius: 6,
  padding: "0.38em 1.2em",
  fontWeight: 600,
  cursor: "pointer"
};

export default EmployeeSearch;
