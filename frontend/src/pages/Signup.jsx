import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  User,
  ArrowRight,
  HeartPulse,
  Shield,
} from "lucide-react";
import API from "../api/axios.js";
const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [inputValue, setInputValue] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("patient"); // 'patient' or 'admin'

  useEffect(() => {
    window.scrollTo(0, 0);
    // Check if role was passed via navigation state
    if (location.state && location.state.role) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRole(location.state.role);
    }
  }, [location]);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if(inputValue.password!=inputValue.confirmPassword){
        alert("Passwords do not match");
        return;
      }
      const userData = {
        ...inputValue,
        role,
      };
      const { data } = await API.post("/auth/signup", inputValue);
      if (data.success) {
        handleSuccess(data.message);
        setInputValue({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "patient",
        });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        handleError(data.message);
        if (data.message == "User already exists") {
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Something went wrong");
    }
  };
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000")',
        }}
      >
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent md:w-1/2"></div>
      </div>

      <div className="relative z-10 flex w-full max-w-7xl mx-auto">
        {/* Left Content */}
        <div className="hidden md:flex flex-col justify-between w-5/12 p-12 lg:p-20">
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 mb-16 hover:opacity-80 transition-opacity"
            >
              <div className="bg-blue-600 p-2 rounded-lg">
                <HeartPulse className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-blue-950 block leading-tight">
                  CareWell Hospital
                </span>
                <span className="text-xs text-gray-600 font-medium">
                  Management System
                </span>
              </div>
            </Link>

            <h1 className="text-5xl lg:text-6xl font-bold text-blue-950 mb-6 tracking-tight leading-[1.1]">
              Join CareWell Hospital
            </h1>
            <div className="w-16 h-1 bg-blue-600 mb-6"></div>
            <p className="text-gray-700 text-lg max-w-md">
              Create your account to access our healthcare services and manage
              appointments with ease.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm max-w-md flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600 shrink-0">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-blue-950 mb-1">
                Your data is safe with us
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                We use advanced security to protect your personal information.
              </p>
            </div>
          </div>
        </div>

        {/* Right Content - Form */}
        <div className="w-full md:w-7/12 flex items-center justify-center p-6 lg:py-12 lg:px-8">
          <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl p-8 sm:p-10 border border-gray-100 my-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-blue-950 mb-2">Sign Up</h2>
              <p className="text-gray-500">Create a new account</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={inputValue.username}
                    onChange={handleOnChange}
                    required
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-gray-700 bg-gray-50/50"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={inputValue.email}
                    onChange={handleOnChange}
                    required
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-gray-700 bg-gray-50/50"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={inputValue.password}
                    onChange={handleOnChange}
                    required
                    className="w-full pl-11 pr-12 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-gray-700 bg-gray-50/50"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={inputValue.confirmPassword}
                    onChange={handleOnChange}
                    required
                    className="w-full pl-11 pr-12 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-gray-700 bg-gray-50/50"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Register As
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`cursor-pointer border rounded-xl p-4 flex gap-3 transition-all ${
                      role === "patient"
                        ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="pt-0.5">
                      <input
                        type="radio"
                        name="role"
                        value="patient"
                        checked={role === "patient"}
                        onChange={() => {
                          setRole("patient");
                          setInputValue((prev) => ({
                            ...prev,
                            role: "patient",
                          }));
                        }}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-600 mt-1"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User
                          className={`h-4 w-4 ${role === "patient" ? "text-blue-600" : "text-gray-500"}`}
                        />
                        <span
                          className={`font-semibold text-sm ${role === "patient" ? "text-blue-900" : "text-gray-700"}`}
                        >
                          Patient
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-tight">
                        Book appointments and view doctors
                      </p>
                    </div>
                  </label>

                  <label
                    className={`cursor-pointer border rounded-xl p-4 flex gap-3 transition-all ${
                      role === "admin"
                        ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="pt-0.5">
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={role === "admin"}
                        onChange={() => {
                          setRole("admin");
                          setInputValue((prev) => ({
                            ...prev,
                            role: "admin",
                          }));
                        }}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-600 mt-1"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Shield
                          className={`h-4 w-4 ${role === "admin" ? "text-blue-600" : "text-gray-500"}`}
                        />
                        <span
                          className={`font-semibold text-sm ${role === "admin" ? "text-blue-900" : "text-gray-700"}`}
                        >
                          Admin
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-tight">
                        Manage doctors, appointments and hospital records
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {role === "admin" && (
                <div className="animate-in fade-in slide-in-from-top-2 pt-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Access Code (Admin Only)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-gray-700 bg-gray-50/50"
                      placeholder="Enter access code"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 mt-0.5"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0066FF] hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4"
              >
                <User className="h-5 w-5" />
                Create Account
              </button>

              <div className="pt-4">
                <Link
                  to="/login"
                  className="w-full bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  Login Instead
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
