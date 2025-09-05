import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin } from "../api/admin";  // Add this import

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Verify if user is admin by checking token
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'admin') {
          navigate("/admin/dashboard");
          return;
        }
      } catch (error) {
        // Invalid token, continue with login
        localStorage.removeItem('accessToken');
      }
    }

    // Trigger the animation after a tiny delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    
    try {
      const response = await adminLogin(form);
      const { user, admin, accessToken } = response.data.data;
      
      // Store token in localStorage (optional, since you're using cookies)
      localStorage.setItem('accessToken', accessToken);
      
      // Store admin info for frontend use
      localStorage.setItem('adminInfo', JSON.stringify({
        user,
        admin,
        loginTime: new Date().toISOString()
      }));

      console.log("Admin login successful:", { user, admin });
      navigate("/admin/dashboard");
      
    } catch (error) {
      console.error("Admin login failed:", error);
      
      // Handle specific error messages
      if (error.response?.status === 404) {
        setError("Admin account not found. Please contact your system administrator.");
      } else if (error.response?.status === 401) {
        setError("Invalid admin credentials. Please check your email and password.");
      } else if (error.response?.status === 403) {
        setError("Admin account is deactivated. Please contact your system administrator.");
      } else {
        setError("Admin login failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Rest of your component remains exactly the same
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background image with glassmorphism overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/dirtybglog.jpg')" }}
        ></div>
        {/* Enhanced glassmorphism overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between">
        
        {/* Left side - Admin Login form */}
        <div className={`w-full lg:w-2/5 text-white mb-16 lg:mb-0 transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="mb-10">
            <h1 className={`text-4xl lg:text-5xl font-light mb-3 transition-all duration-1000 delay-100 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>Admin Access</h1>
            <h2 className={`text-5xl lg:text-6xl font-bold text-white bg-clip-text transition-all duration-1000 delay-200 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              JanConnect
            </h2>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Form fields with staggered animations */}
            <div className={`transition-all duration-700 delay-300 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <label className="block text-sm font-medium mb-2 opacity-90">Admin Email</label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 outline-none placeholder:text-white/60 shadow-lg"
              />
            </div>

            <div className={`transition-all duration-700 delay-400 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium opacity-90">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-300 hover:text-white transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="Enter admin password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 outline-none placeholder:text-white/60 shadow-lg"
              />
            </div>

            {error && (
              <div className={`bg-red-400/20 text-red-100 p-3 rounded-lg text-sm border border-red-400/30 backdrop-blur-md transition-all duration-700 delay-500 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                {error}
              </div>
            )}

            <div className={`transition-all duration-700 delay-500 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-white/90 text-gray-800 rounded-xl font-medium hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-opacity-50 disabled:opacity-70"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login as Admin"
                )}
              </button>
            </div>
          </form>

          <div className={`mt-8 text-center transition-all duration-700 delay-600 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <p className="text-white/80 text-sm">
              Not an admin?{" "}
              <Link
                to="/login"
                className="text-blue-300 font-medium hover:text-white transition-colors duration-200"
              >
                Go to User Login
              </Link>
            </p>
          </div>
        </div>

        {/* Right side - Info box with enhanced design */}
        <div className={`w-full lg:w-3/5 flex justify-center lg:justify-end mt-10 lg:mt-0 ml-auto transition-all duration-1000 delay-300 ease-out ${
          isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
        }`}>
          <div className="group relative w-full max-w-xl cursor-pointer">
            <div className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl">
              <img 
                src="/images/cleangb2.jpg" 
                alt="Admin access to JanConnect" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Enhanced gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/70"></div>
              
              {/* Text overlay with enhanced styling */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <p className="text-4xl font-light text-white mb-4 tracking-wide">
                  Secure. Manage. Control.
                </p>
                <p className="text-xl text-white/90 font-medium">
                  Admin Portal - JanConnect
                </p>
              </div>

              {/* Subtle border effect on hover */}
              <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-white/20 transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
