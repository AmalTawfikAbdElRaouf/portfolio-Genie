import React, { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { FiMail, FiArrowLeft, FiKey } from "react-icons/fi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import AuthCard from "../../components/ui/AuthCard";
import InputField from "../../components/ui/InputField";
import { supabase } from "../../services/supabaseClient";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!email.trim()) { setError("Email is required"); return; }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) { setError("Please enter a valid email address"); return; }
  
  setLoading(true);
  
  const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  setLoading(false);
  
  if (supabaseError) {
    Swal.fire({ title: "Error!", text: supabaseError.message, icon: "error", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff" });
    return;
  }
  
  Swal.fire({ title: "Check your email! 📧", text: "We've sent a password reset link to your email.", icon: "success", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff", timer: 4000, showConfirmButton: false });
};

  return (
    <div className="auth-page d-flex flex-column min-vh-100">
      <div className="d-flex align-items-center justify-content-center flex-grow-1 px-3 py-5">
        <Container>
          <div className="text-center mb-4">
            <div className="auth-icon-badge mx-auto mb-3">
              <FiKey size={22} />
            </div>
            <h1 className="auth-heading">Reset your password</h1>
            <p className="auth-subheading">Enter your email and we'll send you a reset link</p>
          </div>
          <AuthCard centered>
            <Form noValidate onSubmit={handleSubmit}>
              <InputField label="Email Address" name="email" type="email" placeholder="name@example.com" value={email} onChange={handleChange} error={error} icon={FiMail} />
              <Button type="submit" className="btn-submit w-100 rounded-3 py-3 mb-3 fw-semibold mt-2" disabled={loading}>
                {loading ? <span className="d-flex align-items-center justify-content-center gap-2"><span className="auth-spinner" /> Sending…</span> : "Send Reset Link →"}
              </Button>
              <p className="text-center text-muted-custom small mt-3 mb-0">
                <Link to="/login" className="forgot-link d-inline-flex"><FiArrowLeft className="me-1" /> Back to Sign In</Link>
              </p>
            </Form>
          </AuthCard>
        </Container>
      </div>
    </div>
  );
};

export default ForgotPassword;
