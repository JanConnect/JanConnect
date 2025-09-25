import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, CheckCircle, Upload, User, Mail, Phone, Lock, Camera, CreditCard } from "lucide-react";
import { registerUser } from "../api/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    aadhaar: "",
    password: "",
    avatar: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const isSubmittingRef = useRef(false);
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user._id) {
        navigate(`/user/${user._id}`, { replace: true });
        return;
      }
    }

    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, [navigate]);

  const update = useCallback((k, v) => {
    if (error) setError("");
    if (success) setSuccess("");
    setForm((f) => ({ ...f, [k]: v }));
  }, [error, success]);

  const validateAadhaar = (aadhaar) => {
    const cleanAadhaar = aadhaar.replace(/\s/g, '');
    return /^\d{12}$/.test(cleanAadhaar);
  };

  const formatAadhaar = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(' ');
    }
    return cleaned;
  };

  const handleAadhaarChange = (e) => {
    const formatted = formatAadhaar(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 12) {
      update("aadhaar", formatted);
    }
  };

  const handleFileChange = useCallback((file) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setForm(prev => ({ ...prev, avatar: file }));
      
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  }, [handleFileChange]);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmittingRef.current || submitting) {
      return;
    }

    isSubmittingRef.current = true;
    setSubmitting(true);
    setError("");
    setSuccess("");

    console.log("🚀 Signup attempt started");

    const { name, username, email, phone, aadhaar, password, avatar } = form;

    // Validation logic...
    if (!name?.trim()) {
      setError("Full name is required");
      isSubmittingRef.current = false;
      setSubmitting(false);
      return;
    }

    if (!username?.trim()) {
      setError("Username is required");
      isSubmittingRef.current = false;
      setSubmitting(false);
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      isSubmittingRef.current = false;
      setSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      isSubmittingRef.current = false;
      setSubmitting(false);
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid 10-digit Indian mobile number");
      isSubmittingRef.current = false;
      setSubmitting(false);
      return;
    }

    if (!validateAadhaar(aadhaar)) {
      setError("Please enter a valid 12-digit Aadhaar number");
      isSubmittingRef.current = false;
      setSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      isSubmittingRef.current = false;
      setSubmitting(false);
      return;
    }

    if (!avatar) {
      setError("Profile picture is required");
      isSubmittingRef.current = false;
      setSubmitting(false);
      return;
    }

    try {
      console.log("📡 Calling backend API...");
      
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("username", username.trim().toLowerCase());
      formData.append("email", email.trim().toLowerCase());
      formData.append("phone", phone.trim());
      formData.append("aadhaar", aadhaar.replace(/\s/g, ''));
      formData.append("password", password);
      formData.append("avatar", avatar);

      const response = await registerUser(formData);
      
      console.log("✅ Backend response:", response);

      if (response?.data?.success) {
        setSuccess("Registration successful! Redirecting to login...");
        
        setForm({
          name: "",
          username: "",
          email: "",
          phone: "",
          aadhaar: "",
          password: "",
          avatar: null,
        });
        setAvatarPreview(null);
        
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      } else {
        throw new Error("Registration failed");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      
      isSubmittingRef.current = false;
      setSubmitting(false);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message;
        
        switch (status) {
          case 400:
            errorMessage = message || "Please fill all required fields correctly.";
            break;
          case 409:
            errorMessage = "Username or email already exists. Please try different ones.";
            break;
          case 413:
            errorMessage = "File size is too large. Please upload a smaller image.";
            break;
          default:
            errorMessage = message || "Registration failed. Please try again.";
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return;
    }
    
    isSubmittingRef.current = false;
  }, [form, submitting, navigate]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !isSubmittingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      onSubmit(e);
    }
  }, [onSubmit]);

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSubmittingRef.current) {
      onSubmit(e);
    }
  }, [onSubmit]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: `url('${import.meta.env.BASE_URL}images/dirtybglog.jpg')` }}
/>

        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12 xl:gap-16">
        
          {/* Left side - Signup form */}
          <motion.div 
            className="w-full lg:w-5/12 xl:w-2/5 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div 
              className="mb-6 lg:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 1, delay: 0.1 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-2 lg:mb-3">Join</h1>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white bg-clip-text">
                JanConnect
              </h2>
            </motion.div>

            {/* **CORRECTED: All input fields keep same full width and dimensions** */}
            <form 
              ref={formRef}
              onSubmit={handleFormSubmit}
              className="space-y-5"
              noValidate
              autoComplete="on"
            >
              {/* Name Field - Full width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <label className="block text-sm font-medium mb-2 opacity-90">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  onKeyDown={handleKeyDown}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 outline-none placeholder:text-white/60 shadow-lg disabled:opacity-50"
                  autoComplete="name"
                />
              </motion.div>

              {/* Username Field - Full width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.35 }}
              >
                <label className="block text-sm font-medium mb-2 opacity-90">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a unique username"
                  value={form.username}
                  onChange={(e) => update("username", e.target.value.toLowerCase())}
                  onKeyDown={handleKeyDown}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 outline-none placeholder:text-white/60 shadow-lg disabled:opacity-50"
                  autoComplete="username"
                />
              </motion.div>

              {/* Email Field - Full width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <label className="block text-sm font-medium mb-2 opacity-90">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  onKeyDown={handleKeyDown}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 outline-none placeholder:text-white/60 shadow-lg disabled:opacity-50"
                  autoComplete="email"
                />
              </motion.div>

              {/* Phone Field - Full width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.45 }}
              >
                <label className="block text-sm font-medium mb-2 opacity-90">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter 10-digit mobile number"
                  value={form.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    update("phone", value);
                  }}
                  onKeyDown={handleKeyDown}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 outline-none placeholder:text-white/60 shadow-lg disabled:opacity-50"
                  autoComplete="tel"
                  maxLength="10"
                />
              </motion.div>

              {/* Aadhaar Field - Full width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <label className="block text-sm font-medium mb-2 opacity-90">
                  Aadhaar Number
                </label>
                <input
                  type="text"
                  name="aadhaar"
                  placeholder="Enter 12-digit Aadhaar number"
                  value={form.aadhaar}
                  onChange={handleAadhaarChange}
                  onKeyDown={handleKeyDown}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 outline-none placeholder:text-white/60 shadow-lg disabled:opacity-50"
                  maxLength="14"
                />
                <p className="text-xs text-white/50 mt-1">Format: 1234 5678 9012</p>
              </motion.div>

              {/* Password Field - Full width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.55 }}
              >
                <label className="block text-sm font-medium mb-2 opacity-90">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password (min 6 chars)"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    onKeyDown={handleKeyDown}
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3.5 pr-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 outline-none placeholder:text-white/60 shadow-lg disabled:opacity-50"
                    autoComplete="new-password"
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={submitting}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors disabled:opacity-50"
                    tabIndex={submitting ? -1 : 0}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Avatar Upload - Full width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <label className="block text-sm font-medium mb-2 opacity-90">
                  Profile Picture
                </label>
                <div
                  className={`relative w-full p-6 bg-white/10 backdrop-blur-md rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer hover:bg-white/15 ${
                    dragOver 
                      ? 'border-blue-400 bg-blue-400/10' 
                      : 'border-white/30'
                  } ${submitting ? 'opacity-50 pointer-events-none' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    className="hidden"
                    disabled={submitting}
                  />
                  
                  {avatarPreview ? (
                    <div className="flex items-center gap-4">
                      <img
  src={`${import.meta.env.BASE_URL}images/your-avatar.jpg`}
  alt="Preview"
  className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
/>

                      <div>
                        <p className="text-white font-medium">{form.avatar?.name}</p>
                        <p className="text-white/60 text-sm">Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-white/60 mb-2" />
                      <p className="text-white/80 text-sm">
                        Drag & drop or click to upload
                      </p>
                      <p className="text-white/50 text-xs mt-1">
                        JPG, PNG up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-red-400/20 text-red-100 p-3 rounded-lg text-sm border border-red-400/30 backdrop-blur-md flex items-start gap-2"
                  >
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-green-400/20 text-green-100 p-3 rounded-lg text-sm border border-green-400/30 backdrop-blur-md flex items-start gap-2"
                  >
                    <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button - Full width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.65 }}
                className="pt-2"
              >
                <button
                  type="submit"
                  disabled={submitting || !form.name || !form.username || !form.email || !form.phone || !form.aadhaar || !form.password || !form.avatar}
                  className="w-full py-4 bg-white/90 text-gray-800 rounded-xl font-medium hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </motion.div>
            </form>

            {/* Login link */}
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <p className="text-white/80 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-300 font-medium hover:text-white transition-colors duration-200"
                  tabIndex={submitting ? -1 : 0}
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </motion.div>

          {/* Right side - Info box */}
          <motion.div 
            className="w-full lg:w-7/12 xl:w-3/5 flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 50 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="group relative w-full max-w-lg xl:max-w-xl cursor-pointer">
              <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] w-full rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <img
  src={`${import.meta.env.BASE_URL}images/cleangb2.jpg`}
  alt="Join JanConnect community"
  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
/>

                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/70" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8 text-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-3 sm:mb-4 tracking-wide">
                    Report. Act. Transform.
                  </p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-3 sm:mb-4 tracking-wide">
                    Your voice can turn problems into progress.
                  </p>
                  <p className="text-lg sm:text-xl text-white/90 font-medium">
                    #JanConnect
                  </p>
                </div>

                <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-white/20 transition-all duration-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
