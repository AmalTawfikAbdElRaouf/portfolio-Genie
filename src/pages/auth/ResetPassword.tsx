import React, { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { FiLock, FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthCard from "../../components/ui/AuthCard";
import InputField from "../../components/ui/InputField";
import { supabase } from "../../services/supabaseClient";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { password?: string; confirmPassword?: string } = {};
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      Swal.fire({ title: "Error!", text: error.message, icon: "error", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff" });
      return;
    }

    Swal.fire({ title: "Password Updated! 🎉", text: "Your password has been changed successfully.", icon: "success", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff", timer: 2000, showConfirmButton: false });
    setTimeout(() => navigate("/login"), 2100);
  };

  return (
    <div className="auth-page d-flex flex-column min-vh-100">
      <div className="d-flex align-items-center justify-content-center flex-grow-1 px-3 py-5">
        <Container>
          <div className="text-center mb-4">
            <div className="auth-icon-badge mx-auto mb-3">
              <FiCheckCircle size={22} />
            </div>
            <h1 className="auth-heading">Set new password</h1>
            <p className="auth-subheading">Enter your new password below</p>
          </div>
          <AuthCard centered>
            <Form noValidate onSubmit={handleSubmit}>
              <InputField label="New Password" name="password" type="password" placeholder="Enter new password" value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                error={errors.password} icon={FiLock} showPass={showPass} onTogglePass={() => setShowPass((p) => !p)} />
              <InputField label="Confirm Password" name="confirmPassword" type="password" placeholder="Confirm new password" value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: "" })); }}
                error={errors.confirmPassword} icon={FiLock} showPass={showConfirm} onTogglePass={() => setShowConfirm((p) => !p)} />
              <Button type="submit" className="btn-submit w-100 rounded-3 py-3 mb-3 fw-semibold mt-2" disabled={loading}>
                {loading ? <span className="d-flex align-items-center justify-content-center gap-2"><span className="auth-spinner" /> Updating…</span> : "Update Password →"}
              </Button>
            </Form>
          </AuthCard>
        </Container>
      </div>
    </div>
  );
};

export default ResetPassword;