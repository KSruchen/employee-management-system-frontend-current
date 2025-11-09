import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const EditEmployeeModal = ({ employee, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

  useEffect(() => {
    reset(employee);
  }, [employee, reset]);

  function isAllCaps(value) {
    if (!value) return "This field is required";
    if (!/^[A-Z ]+$/.test(value)) return "Only CAPITAL LETTERS and spaces allowed";
    if (/([A-Z])\1{2,}/.test(value)) return "No more than two repeated letters in a row";
    return true;
  }
  function enforceAllCaps(e) {
    const caps = e.target.value.replace(/[^A-Z ]/g, '');
    if (e.target.value !== caps) e.target.value = caps;
  }

  const fromDateVal = watch("fromDate");

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Employee</h2>
        <form onSubmit={handleSubmit(onSave)} className="edit-form">
          <label>Employee ID (cannot change)</label>
          <input value={employee.empId} disabled style={{ background: "#eee" }} />

          <label>Employee Name</label>
          <input
            {...register("empName", { required: true, validate: isAllCaps })}
            onInput={enforceAllCaps}
          />
          <span>{errors.empName?.message}</span>

          <label>Address</label>
          <input
            {...register("address", { maxLength: 100, validate: value => !value || isAllCaps(value) })}
            onInput={enforceAllCaps}
          />
          <span>{errors.address?.message}</span>

          <label>Phone</label>
          <input
            {...register("phone", {
              required: true,
              pattern: { value: /^[6-9]\d{9}$/, message: "Valid 10-digit Indian number" }
            })}
            maxLength={10}
          />
          <span>{errors.phone?.message}</span>

          <label>Age</label>
          <input {...register("age", {
            required: true, min: 18, max: 80, pattern: { value: /^\d+$/, message: "Only digits" }
          })} />
          <span>{errors.age?.message}</span>

          <label>Gender</label>
          <select {...register("gender", { required: true })}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <span>{errors.gender?.message}</span>

          <label>Role Name</label>
          <input
            {...register("roleName", { required: true, validate: isAllCaps })}
            onInput={enforceAllCaps}
          />
          <span>{errors.roleName?.message}</span>

          <label>Role Number</label>
          <input
            {...register("roleNumber", {
              required: true,
              pattern: { value: /^\d+$/, message: "Only digits" }
            })}
          />
          <span>{errors.roleNumber?.message}</span>

          <label>From Date</label>
          <input type="date" {...register("fromDate", { required: true })} />
          <span>{errors.fromDate?.message}</span>

          <label>To Date</label>
          <input
            type="date"
            {...register("toDate", {
              validate: value => !value || !fromDateVal || value >= fromDateVal || "To Date cannot be before From Date"
            })}
          />
          <span>{errors.toDate?.message}</span>

          <label>NA Flag</label>
          <select {...register("naFlag", { required: true })}>
            <option value="">Select</option>
            <option value="Y">Y</option>
            <option value="N">N</option>
          </select>
          <span>{errors.naFlag?.message}</span>

          <label>Directorate</label>
          <select {...register("directorate", { required: true })}>
            <option value="">Select</option>
            <option value="DIT">DIT</option>
            <option value="DWST">DWST</option>
            <option value="DOVI">DOVI</option>
          </select>
          <span>{errors.directorate?.message}</span>

          <label>Division</label>
          <select {...register("division", { required: true })}>
            <option value="">Select</option>
            <option value="SDD">SDD</option>
            <option value="CND">CND</option>
            <option value="Network">Network</option>
          </select>
          <span>{errors.division?.message}</span>

          <label>Email (optional)</label>
          <input
            {...register("email", {
              maxLength: 100,
              pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: "Invalid email format" }
            })}
            autoComplete="email"
          />
          <span>{errors.email?.message}</span>

          <div className="modal-buttons">
            <button type="submit" className="btn-edit-modal">Save</button>
            <button type="button" onClick={onClose} className="btn-cancel-modal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
