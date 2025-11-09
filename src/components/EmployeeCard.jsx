import React from "react";
import './EmployeeCard.css';

const EmployeeCard = ({ employee, onEdit, onDelete }) => (
  <div className="employee-card">
    <h3>{employee.empName} ({employee.empId})</h3>
    <p>Role: {employee.roleName} - {employee.roleNumber}</p>
    <p>Directorate: {employee.directorate} Division: {employee.division}</p>
    <p>Phone: {employee.phone} | Age: {employee.age} | Gender: {employee.gender}</p>
    <p>From: {employee.fromDate} To: {employee.toDate || "Current"}</p>
    <p>Address: {employee.address}</p>
    <p>NA Flag: {employee.naFlag}</p>
    <button className="btn-edit" onClick={() => onEdit(employee)}>Edit</button>
    <button className="btn-delete" onClick={() => onDelete(employee.empId)}>Delete</button>
  </div>
);

export default EmployeeCard;
