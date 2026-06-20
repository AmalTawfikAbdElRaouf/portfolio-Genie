import React, { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { FiMail, FiLock, FiKey } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

import AuthCard from "../../components/ui/AuthCard";
import InputField from "../../components/ui/InputField";
import { loginSchema, type LoginForm } from "../../utils/validation";
import { setUserData } from "../../store/slices/userSlice";
import { supabase } from "../../services/supabaseClient";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginForm, string>>>({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof LoginForm]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const formattedErrors: any = {};
      result.error.issues.forEach((issue) => { formattedErrors[issue.path[0]] = issue.message; });
      setErrors(formattedErrors);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (error) {
      Swal.fire({ title: "Login Failed!", text: "Invalid email or password.", icon: "error", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff" });
      return;
    }
    const fullName = data.user?.user_metadata?.full_name || data.user?.email || "";
    dispatch(setUserData({ name: fullName, job: "", avatar: "" }));
    Swal.fire({ title: "Welcome back!", text: "You have logged in successfully.", icon: "success", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff", timer: 1500, showConfirmButton: false });
    setTimeout(() => navigate("/dashboard"), 1600);
  };

  return (
    <div className="auth-page d-flex flex-column min-vh-100">
      <div className="d-flex align-items-center justify-content-center flex-grow-1 px-3 py-5">
        <Container>
          <div className="text-center mb-4">
            <div className="auth-icon-badge mx-auto mb-3">
              <FiLock size={22} />
            </div>
            <h1 className="auth-heading">Welcome back</h1>
            <p className="auth-subheading">Sign in to your portfolioGenie account</p>
          </div>
          <AuthCard centered>
            <Form noValidate onSubmit={handleSubmit}>
              <InputField label="Email Address" name="email" type="email" placeholder="name@example.com" value={form.email} onChange={handleChange} error={errors.email} icon={FiMail} />
              <InputField label="Password" name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleChange} error={errors.password} icon={FiLock} showPass={showPass} onTogglePass={() => setShowPass((p) => !p)} />
              <div className="text-end mb-4 mt-1">
                <Link to="/forgot-password" className="forgot-link">
                  <FiKey size={13} className="me-1" /> Forgot password?
                </Link>
              </div>
              <Button type="submit" className="btn-submit w-100 rounded-3 py-3 mb-3 fw-semibold" disabled={loading}>
                {loading ? <span className="d-flex align-items-center justify-content-center gap-2"><span className="auth-spinner" /> Signing in…</span> : "Sign In →"}
              </Button>
              <div className="auth-divider my-3"><span>New to portfolioGenie?</span></div>
              <Link to="/signup" className="btn-auth-outline w-100 d-block text-center py-2 rounded-3">Create a free account</Link>
            </Form>
          </AuthCard>
        </Container>
      </div>
    </div>
  );
};

export default Login;