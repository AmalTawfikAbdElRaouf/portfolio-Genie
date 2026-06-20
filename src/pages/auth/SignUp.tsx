import React, { useState } from "react";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import { FiMail, FiLock, FiUser, FiUserPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

import AuthCard from "../../components/ui/AuthCard";
import InputField from "../../components/ui/InputField";
import { signupSchema, type SignupForm } from "../../utils/validation";
import { setUserData } from "../../store/slices/userSlice";
import { supabase } from "../../services/supabaseClient";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState<SignupForm>({ fullName: "", email: "", password: "", confirmPassword: "", agreed: false });
  const [errors, setErrors] = useState<Partial<Record<keyof SignupForm, string>>>({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name as keyof SignupForm]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = signupSchema.safeParse(form);
    if (!result.success) {
      const formattedErrors: any = {};
      result.error.issues.forEach((issue) => { formattedErrors[issue.path[0]] = issue.message; });
      setErrors(formattedErrors);
      return;
    }
    setLoading(true);
    const { data: -data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.fullName }
      }
    });
    setLoading(false);
    if (error) {
      Swal.fire({ title: "Error!", text: error.message, icon: "error", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff" });
      return;
    }
    dispatch(setUserData({ name: form.fullName, job: "", avatar: "" }));
    Swal.fire({ title: "Account Created!", text: "Welcome to portfolioGenie.", icon: "success", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff", timer: 2000, showConfirmButton: false });
    setTimeout(() => navigate("/dashboard"), 2100);
  };

  return (
    <div className="auth-page d-flex flex-column min-vh-100">
      <div className="d-flex align-items-center justify-content-center flex-grow-1 px-3 py-5">
        <Container>
          <div className="text-center mb-4">
            <div className="auth-icon-badge mx-auto mb-3">
              <FiUserPlus size={22} />
            </div>
            <h1 className="auth-heading">Build with <span className="hero-accent">portfolioGenie</span></h1>
            <p className="auth-subheading">AI-powered portfolios that showcase your professional story</p>
          </div>
          <AuthCard centered>
            <Form noValidate onSubmit={handleSubmit}>
              <InputField label="Full Name" name="fullName" type="text" placeholder="Your full name" value={form.fullName} onChange={handleChange} error={errors.fullName} icon={FiUser} />
              <InputField label="Email Address" name="email" type="email" placeholder="name@example.com" value={form.email} onChange={handleChange} error={errors.email} icon={FiMail} />
              <Row className="g-3">
                <Col xs={12} sm={6}>
                  <InputField label="Password" name="password" type="password" placeholder="Create a password" value={form.password} onChange={handleChange} error={errors.password} icon={FiLock} showPass={showPass} onTogglePass={() => setShowPass((p) => !p)} />
                </Col>
                <Col xs={12} sm={6}>
                  <InputField label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} icon={FiLock} showPass={showConfirm} onTogglePass={() => setShowConfirm((p) => !p)} />
                </Col>
              </Row>
              <Form.Group className="mb-4 mt-2">
                <div className="d-flex align-items-start gap-2">
                  <input type="checkbox" className="auth-checkbox mt-1" id="terms" name="agreed" checked={form.agreed} onChange={handleChange} />
                  <label htmlFor="terms" className="text-muted-custom small mb-0" style={{ lineHeight: 1.6 }}>
                    I agree to the <a href="#" className="link-purple">Terms of Service</a> and <a href="#" className="link-purple">Privacy Policy</a>
                  </label>
                </div>
                {errors.agreed && <div className="error-text text-danger small mt-1">⚠ {errors.agreed}</div>}
              </Form.Group>
              <Button type="submit" className="btn-submit w-100 rounded-3 py-3 mb-3 fw-semibold" disabled={loading}>
                {loading ? <span className="d-flex align-items-center justify-content-center gap-2"><span className="auth-spinner" /> Creating account…</span> : "Create Free Account →"}
              </Button>
              <div className="auth-divider my-3"><span>Already have an account?</span></div>
              <Link to="/login" className="btn-auth-outline w-100 d-block text-center py-2 rounded-3">Sign in instead</Link>
            </Form>
          </AuthCard>
        </Container>
      </div>
    </div>
  );
};

export default SignUp;
