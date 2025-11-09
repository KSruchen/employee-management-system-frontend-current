import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './EmployeeForm.css';

function EmployeeForm() {
  const { control, register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    mode: 'onChange'
  });

  const [lastData, setLastData] = useState(null);
  const [directorates, setDirectorates] = useState([]);
  const [divisions, setDivisions] = useState([]);

  const selectedDirectorate = watch("directorate");
  const fromDateVal = watch("fromDate");
  const toDateVal = watch("toDate");
  const [fromDate, setFromDate] = useState(fromDateVal ? new Date(fromDateVal) : null);
  const [toDate, setToDate] = useState(toDateVal ? new Date(toDateVal) : null);

  useEffect(() => {
    fetch('http://localhost:8080/api/directorates')
      .then(res => res.json())
      .then(data => setDirectorates(data))
      .catch(() => toast.error('Failed to fetch directorates'));
  }, []);

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

  function isAllCapsLen(min, max) {
    return value => {
      if (!value) return "This field is required";
      if (value.length < min) return `At least ${min} characters`;
      if (value.length > max) return `Must be under or equal to ${max} characters`;
      if (!/^[A-Z ]+$/.test(value)) return "Only CAPITAL LETTERS and spaces are allowed";
      return true;
    };
  }

  function isAddressValid(value) {
    if (!value) return "Address is required";
    if (value.length < 5) return "At least 5 characters";
    if (value.length > 60) return "Must be under or equal to 60 characters";
    if (!/^[A-Z0-9 ,.\-\/]+$/.test(value))
      return "Only CAPITAL LETTERS, numbers, spaces, comma, dot, hyphen, and slash allowed";
    return true;
  }

  const onSubmit = (data) => {
    const payload = {
      empId: data.empId,
      empName: data.empName,
      phone: data.phone,
      address: data.address,
      age: parseInt(data.age, 10),
      gender: data.gender,
      roleName: data.roleName,
      roleNumber: data.roleNumber,
      fromDate: data.fromDate,
      toDate: data.toDate,
      naFlag: data.naFlag,
      directorate: data.directorate,
      division: data.division,
      email: data.email || null
    };
    fetch('http://localhost:8080/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) {
          toast.success('Employee data submitted successfully!');
          setLastData(payload);
        } else {
          toast.error('Failed to save employee.');
        }
      })
      .catch(() => toast.error('Network error'));
  };

  // Custom header with inline arrows
  const renderHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled
  }) => (
    <div style={{
      display: "flex",
      alignItems: "center", 
      justifyContent: "center",
      gap: "1.4em"
    }}>
      <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} aria-label="Previous month"
        style={{
          background: "none", border: "none", fontSize: "1.5em", cursor: "pointer", padding: "0 10px", color: "#4173c1"
        }}>
        &#8592;
      </button>
      <span style={{ fontWeight: 600, fontSize: "1.14em", color: "#22356a", minWidth: 110 }}>
        {date.toLocaleString("default", { month: "long", year: "numeric" })}
      </span>
      <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} aria-label="Next month"
        style={{
          background: "none", border: "none", fontSize: "1.5em", cursor: "pointer", padding: "0 10px", color: "#4173c1"
        }}>
        &#8594;
      </button>
    </div>
  );

  return (
    <>
      <form className="employee-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-section">Personal Details</div>
        <div className="field-grid">
          <div>
            <label>Employee ID</label>
            <input
              {...register("empId", {
                required: "Employee ID is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Employee ID must be exactly 6 digits, numbers only",
                },
              })}
              placeholder="Employee ID"
              maxLength={6}
            />
            <span>{errors.empId?.message}</span>
          </div>
          <div>
            <label>Employee Name</label>
            <input
              {...register("empName", {
                validate: isAllCapsLen(2, 40),
              })}
              placeholder="EMPLOYEE NAME"
              maxLength={40}
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
              placeholder="Phone"
              maxLength={10}
            />
            <span>{errors.phone?.message}</span>
          </div>
          <div>
            <label>Address</label>
            <input
              {...register("address", {
                validate: isAddressValid,
              })}
              placeholder="ADDRESS"
              maxLength={60}
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
      max: { value: 80, message: "Maximum age is 80" }
    })}
    placeholder="Age"
    minLength={1}
    maxLength={3}
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
              })}
              placeholder="ROLE NAME"
              maxLength={20}
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
              placeholder="Role Number"
              maxLength={6}
            />
            <span>{errors.roleNumber?.message}</span>
          </div>
          <div>
            <label>From Date</label>
            <Controller
              control={control}
              name="fromDate"
              rules={{ required: "From Date selection is required" }}
              render={({ field }) => (
                <DatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={date => {
                    field.onChange(date ? date.toISOString().split('T')[0] : '');
                    setFromDate(date);
                    if (toDate && date && toDate < date) {
                      setToDate(null);
                      setValue('toDate', '');
                    }
                  }}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select from date"
                  maxDate={toDate}
                  renderCustomHeader={renderHeader}
                  autoComplete="off"
                />
              )}
            />
            <span>{errors.fromDate?.message}</span>
          </div>
          <div>
            <label>To Date</label>
            <Controller
              control={control}
              name="toDate"
              rules={{
                validate: value =>
                  !value || !watch("fromDate") || value >= watch("fromDate") || "To Date cannot be before From Date"
              }}
              render={({ field }) => (
                <DatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={date => {
                    field.onChange(date ? date.toISOString().split('T')[0] : '');
                    setToDate(date);
                  }}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select to date"
                  minDate={fromDate}
                  renderCustomHeader={renderHeader}
                  autoComplete="off"
                />
              )}
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
              placeholder="Email"
              autoComplete="email"
            />
            <span>{errors.email?.message}</span>
          </div>
        </div>
        <button type="submit">Add Employee</button>
      </form>
    </>
  );
}

export default EmployeeForm;
