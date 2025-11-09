import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

function UpdateEmployee() {
  const { empId } = useParams();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    mode: 'onChange',
  });

  const [directorates, setDirectorates] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const selectedDirectorate = watch("directorate");
  const fromDateVal = watch("fromDate");

  // Fetch directorates
  useEffect(() => {
    fetch('http://localhost:8080/api/directorates')
      .then(res => res.json())
      .then(data => setDirectorates(data))
      .catch(() => toast.error('Failed to fetch directorates'));
  }, []);

  // Fetch divisions when directorate changes
  useEffect(() => {
    if (selectedDirectorate) {
      fetch(`http://localhost:8080/api/divisions/by-directorate/${selectedDirectorate}`)
        .then(res => res.json())
        .then(data => setDivisions(data))
        .catch(() => toast.error('Failed to fetch divisions'));
      setValue('division', '');
    } else {
      setDivisions([]);
      setValue('division', '');
    }
  }, [selectedDirectorate, setValue]);

  // Fetch and set employee data for editing
  useEffect(() => {
    fetch(`http://localhost:8080/api/employees/${empId}`)
      .then(res => res.json())
      .then(data => {
        for (const [key, value] of Object.entries(data)) {
          setValue(key, value);
        }
      })
      .catch(() => toast.error('Failed to load employee data'));
  }, [empId, setValue]);

  // Validation helpers
  const isAllCapsLen = (min, max) => value => {
    if (!value) return "This field is required";
    if (value.length < min) return `At least ${min} characters`;
    if (value.length > max) return `Must be under or equal to ${max} characters`;
    if (!/^[A-Z ]+$/.test(value)) return "Only CAPITAL LETTERS and spaces are allowed";
    return true;
  };

  const isAddressValid = value => {
    if (!value) return "Address is required";
    if (value.length < 5) return "At least 5 characters";
    if (value.length > 60) return "Must be under or equal to 60 characters";
    if (!/^[A-Z0-9 ,.\-\/]+$/.test(value))
      return "Only CAPITAL LETTERS, numbers, spaces, comma, dot, hyphen, and slash allowed";
    return true;
  };

  const onSubmit = data => {
    fetch(`http://localhost:8080/api/employees/${empId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => {
      if (res.ok) {
        toast.success('Employee updated successfully!');
      } else {
        toast.error('Failed to update employee.');
      }
    }).catch(() => toast.error('Network error'));
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-section">Personal Details</div>
      <div className="field-grid">
        <div>
          <label>Employee ID</label>
          <input {...register("empId")} disabled />
        </div>
        <div>
          <label>Employee Name</label>
          <input
            {...register("empName", {
              validate: isAllCapsLen(2, 40),
              maxLength: 40
            })}
          />
          <span>{errors.empName?.message}</span>
        </div>
        <div>
          <label>Phone</label>
          <input
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: "Phone must be a valid 10-digit Indian number (starts with 6/7/8/9)",
              },
            })}
            maxLength={10}
          />
          <span>{errors.phone?.message}</span>
        </div>
        <div>
          <label>Address</label>
          <input
            {...register("address", {
              validate: isAddressValid,
              maxLength: 60
            })}
          />
          <span>{errors.address?.message}</span>
        </div>
        <div>
          <label>Age</label>
          <input
            {...register("age", {
              required: "Age is required",
              pattern: { value: /^\d+$/, message: "Age must be digits only" },
              min: { value: 18, message: "Minimum age is 18" },
              max: { value: 80, message: "Maximum age is 80" },
            })}
            placeholder="Age"
          />
          <span>{errors.age?.message}</span>
        </div>
        <div>
          <label>Gender</label>
          <select {...register("gender", { required: "Gender selection is required" })}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <span>{errors.gender?.message}</span>
        </div>
      </div>
      <div className="form-section">Role Details</div>
      <div className="field-grid">
        <div>
          <label>Role Name</label>
          <input
            {...register("roleName", {
              validate: isAllCapsLen(2, 20),
              maxLength: 20
            })}
          />
          <span>{errors.roleName?.message}</span>
        </div>
        <div>
          <label>Role Number</label>
          <input
            {...register("roleNumber", {
              required: "Role Number is required",
              pattern: { value: /^\d+$/, message: "Role Number must contain digits only" },
            })}
            maxLength={6}
          />
          <span>{errors.roleNumber?.message}</span>
        </div>
        <div>
          <label>From Date</label>
          <input
            {...register("fromDate", { required: "From Date selection is required" })}
            type="date"
          />
          <span>{errors.fromDate?.message}</span>
        </div>
        <div>
          <label>To Date</label>
          <input
            {...register("toDate", {
              validate: value =>
                !value || !fromDateVal || value >= fromDateVal || "To Date cannot be before From Date",
            })}
            type="date"
          />
          <span>{errors.toDate?.message}</span>
        </div>
        <div>
          <label>NA Flag</label>
          <select {...register("naFlag", { required: "NA Flag selection is required" })}>
            <option value="">Select</option>
            <option value="Y">Y</option>
            <option value="N">N</option>
          </select>
          <span>{errors.naFlag?.message}</span>
        </div>
        <div>
          <label>Directorate</label>
          <select {...register("directorate", { required: "Directorate selection is required" })}>
            <option value="">Select</option>
            {directorates.map(directorate => (
              <option key={directorate.directorateId} value={directorate.directorateId}>
                {directorate.name}
              </option>
            ))}
          </select>
          <span>{errors.directorate?.message}</span>
        </div>
        <div>
          <label>Division</label>
          <select {...register("division", { required: "Division selection is required" })}>
            <option value="">Select</option>
            {divisions.map(division => (
              <option key={division.divisionId} value={division.divisionId}>
                {division.name}
              </option>
            ))}
          </select>
          <span>{errors.division?.message}</span>
        </div>
        <div>
          <label>Email (optional)</label>
          <input
            {...register("email", {
              maxLength: { value: 100, message: "Email must be under 100 characters" },
              pattern: {
                value: /^[^@]+@[^@]+\.[^@]+$/,
                message: "Invalid email format",
              }
            })}
            autoComplete="email"
          />
          <span>{errors.email?.message}</span>
        </div>
      </div>
      <button type="submit">Update Employee</button>
    </form>
  );
}

export default UpdateEmployee;
