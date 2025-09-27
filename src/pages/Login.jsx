import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, CheckCircle, Copy, Check } from "lucide-react";
import { login as authLogin } from "../store/authSlice";
import { loginUser, getCurrentUser } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  
  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        navigate(`/user/${userData._id}`, { replace: true });
      } catch (error) {
        // Clear corrupted data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    }

    // Trigger the animation after a tiny delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  const update = (k, v) => {
    // Clear error when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
    setForm((f) => ({ ...f, [k]: v }));
  };

  // Function to auto-fill demo credentials
  const fillDemoCredentials = () => {
    setForm({
      email: "deeptisharma@gmail.com",
      password: "deepti@3410"
    });
    setShowDemoCredentials(false);
  };

  // Function to copy credentials to clipboard
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // **Prevent default and stop propagation to avoid refresh**
    e.stopPropagation();
    
    // **Clear previous states**
    setError("");
    setSuccess("");
    setSubmitting(true);

    // Basic validation
    if (!form.email || !form.password) {
      setError("Email and password are required");
      setSubmitting(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      setSubmitting(false);
      return;
    }

    try {
      // **Call backend login endpoint**
      const session = await loginUser({
        email: form.email.trim().toLowerCase(),
        password: form.password
      });

      console.log("Login response:", session); // Debug log

      if (session?.data?.success) {
        const { user: userData, accessToken } = session.data.data;
        
        // **Store in localStorage first**
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("accessToken", accessToken);
        
        // **Update Redux store**
        dispatch(authLogin({ userData }));
        
        // **Show success message**
        setSuccess("Login successful! Redirecting...");
        
        // **Navigate after a short delay**
        setTimeout(() => {
          navigate(`/user/${userData._id}`, { replace: true });
        }, 1500);
        
      } else {
        setError("Invalid response from server");
        setSubmitting(false);
      }
    } catch (err) {
      console.error("Login error:", err); 
      setSubmitting(false);
      
      // **Handle different error scenarios WITHOUT causing refresh**
      let errorMessage = "Login failed. Please try again.";
      
      if (err.response?.status === 404) {
        errorMessage = "User not found. Please check your email address.";
      } else if (err.response?.status === 401) {
        errorMessage = "Incorrect password. Please try again.";
      } else if (err.response?.status === 400) {
        errorMessage = "Email and password are required.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message && !err.message.includes('Network Error')) {
        errorMessage = err.message;
      }
      
      // **Set error without causing any navigation or refresh**
      setError(errorMessage);
      
      // **Clear password field on auth error**
      if (err.response?.status === 401) {
        setForm(prev => ({ ...prev, password: "" }));
      }
    }
  };

  // **Prevent any accidental form refresh**
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !submitting) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background image with glassmorphism overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}images/dirtybglog.jpg)`,
          }}
        />

        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between">
        
        {/* Left side - Login form */}
        <motion.div 
          className="w-full lg:w-2/5 text-white mb-16 lg:mb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 1, delay: 0.1 }}
          >
            <h1 className="text-4xl lg:text-5xl font-light mb-3">Welcome to</h1>
            <h2 className="text-5xl lg:text-6xl font-bold text-white bg-clip-text">
              JanConnect
            </h2>
          </motion.div>

          {/* Demo Credentials Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-6"
          >
            <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-yellow-200 font-semibold text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Demo Credentials for Testing
                </h3>
                <button
                  onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                  className="text-yellow-200 hover:text-white transition-colors text-sm"
                >
                  {showDemoCredentials ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showDemoCredentials && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-yellow-400/10 rounded-lg px-3 py-2">
                    <div>
                      <span className="text-yellow-100 text-sm font-medium">Email:</span>
                      <span className="text-yellow-200 font-mono text-sm ml-2">deeptisharma@gmail.com</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("deeptisharma@gmail.com", "email")}
                      className="text-yellow-200 hover:text-white transition-colors p-1 rounded"
                    >
                      {copiedField === "email" ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center bg-yellow-400/10 rounded-lg px-3 py-2">
                    <div>
                      <span className="text-yellow-100 text-sm font-medium">Password:</span>
                      <span className="text-yellow-200 font-mono text-sm ml-2">deepti@3410</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("deepti@3410", "password")}
                      className="text-yellow-200 hover:text-white transition-colors p-1 rounded"
                    >
                      {copiedField === "password" ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  
                  <button
                    onClick={fillDemoCredentials}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <Copy size={16} className="mr-2" />
                    Auto-fill Demo Credentials
                  </button>
                </div>
              )}
              
              <p className="text-yellow-200/80 text-xs mt-2">
                💡 <strong>Note for Evaluators:</strong> Use these credentials to test the application without creating a new account.
              </p>
            </div>
          </motion.div>

          {/* **Fixed form with proper event handling** */}
          <form 
            onSubmit={onSubmit} 
            className="space-y-6"
            noValidate
            autoComplete="off"
          >
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <label className="block text-sm font-medium mb-2 opacity-90">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                onKeyDown={handleKeyDown}
                required
                disabled={submitting}
                className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 outline-none placeholder:text-white/60 shadow-lg disabled:opacity-50"
                autoComplete="username"
              />
            </motion.div>

            {/* Password Field with Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium opacity-90">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-300 hover:text-white transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  onKeyDown={handleKeyDown}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3.5 pr-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 outline-none placeholder:text-white/60 shadow-lg disabled:opacity-50"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={submitting}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-400/20 text-red-100 p-3 rounded-lg text-sm border border-red-400/30 backdrop-blur-md flex items-center gap-2"
                >
                  <AlertCircle size={16} className="flex-shrink-0" />
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
                  className="bg-green-400/20 text-green-100 p-3 rounded-lg text-sm border border-green-400/30 backdrop-blur-md flex items-center gap-2"
                >
                  <CheckCircle size={16} className="flex-shrink-0" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <button
                type="submit"
                disabled={submitting || !form.email || !form.password}
                className="w-full py-4 bg-white/90 text-gray-800 rounded-xl font-medium hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </motion.div>
          </form>

          {/* Sign up link */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <p className="text-white/80 text-sm">
              New here?{" "}
              <Link
                to="/signup"
                className="text-blue-300 font-medium hover:text-white transition-colors duration-200"
              >
                Create an account
              </Link>
            </p>
          </motion.div>

          {/* Admin login link */}
          <motion.div 
            className="mt-8 pt-6 border-t border-white/20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <p className="text-white/60 text-sm mb-2">Are you an admin?</p>
            <Link
              to="/admin/login"
              className="text-blue-300 text-sm font-medium hover:text-white transition-colors duration-200"
            >
              Admin login
            </Link>
          </motion.div>
        </motion.div>

        {/* Right side - Info box */}
        <motion.div 
          className="w-full lg:w-3/5 flex justify-center lg:justify-end mt-10 lg:mt-0 ml-auto"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 50 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="group relative w-full max-w-xl cursor-pointer">
            <div className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl">
              <img
                src={`${import.meta.env.BASE_URL}images/cleangb2.jpg`}
                alt="People connecting through JanConnect"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/70" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <p className="text-4xl font-light text-white mb-4 tracking-wide">
                  Report. Act. Transform.
                </p>
                <p className="text-4xl font-light text-white mb-4 tracking-wide">
                  Your voice can turn problems into progress.
                </p>
                <p className="text-xl text-white/90 font-medium">
                  #JanConnect
                </p>
              </div>

              <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-white/20 transition-all duration-500" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}