// src/components/ChangePassword.jsx
import React, { useState } from "react";

const ChangePassword = ({ onClose }) => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg]         = useState("");

  const token = localStorage.getItem("token") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPass !== confirm) {
      setMsg("Passwords do not match"); return;
    }

    try {
      const res = await fetch("/v1/users/password", {
        method:  "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: current,
          newPassword:     newPass,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      setMsg("Password changed ✅");
      setTimeout(onClose, 1500);
    } catch (err) {
      setMsg(err.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e293b] p-6 rounded-lg w-80 text-white space-y-4"
      >
        <h2 className="text-xl font-bold mb-2">Change Password</h2>

        <input
          type="password"
          placeholder="Current password"
          className="form-input w-full"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New password"
          className="form-input w-full"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          className="form-input w-full"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        {msg && <p className="text-center text-sm">{msg}</p>}

        <div className="flex justify-between pt-2">
          <button type="submit" className="form-button">Save</button>
          <button type="button" onClick={onClose} className="form-button bg-gray-500 hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
