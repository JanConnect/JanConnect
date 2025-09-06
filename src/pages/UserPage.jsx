import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {LogOut,Menu,X,AlertCircle,Search,CheckCircle,ChevronDown,ChevronUp,MapPin,Users,Clock,ArrowRight,BarChart3,TrendingUp,ArrowBigUp,Calendar,Building,User,Star,} from "lucide-react";
import { Globe3D } from "../components/Globe3D";
import LionComponent from "../pages/LionComponent";
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,LineChart,Line,Legend,} from "recharts";
import ScrollHeatmap from "../pages/ScrollHeatmap";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocationDetails } from "../store/locationSlice";
import Chatbot from "./ChatBot";


export default function UserPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedAuthority, setSelectedAuthority] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [visibleComplaints, setVisibleComplaints] = useState(5);
  const [activeChartTab, setActiveChartTab] = useState("reports");
  // Sample data for dropdowns
  const states = ["California", "Texas", "New York", "Florida", "Illinois"];

  const { latitude, longitude, district, state, loading, error } = useSelector(
    (s) => s.location
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      // Optionally set error in Redux here if desired
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch(
          fetchLocationDetails({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        );
      },
      (err) => {
        dispatch(setLocationError(err.message))
      }
    );
    // Only once on mount
  }, [dispatch]);
  const authorities = {
    California: ["Los Angeles Police", "San Francisco PD", "San Diego Sheriff"],
    Texas: ["Houston Police", "Dallas PD", "Austin Sheriff"],
    NewYork: ["NYPD", "Albany Police", "Buffalo PD"],
    Florida: ["Miami Police", "Orlando PD", "Tampa Sheriff"],
    Illinois: ["Chicago Police", "Springfield PD", "Peoria Sheriff"],
  };

  const [trendingComplaints, setTrendingComplaints] = useState([
    { id: 1, area: "Mumbai", title: "Water supply issue in Andheri", reports: 245, severity: "High", time: "2 hours ago", lat: 34.05, lon: -218.24, upvotes: 42, description: "Residents in Andheri West have been facing severe water shortage for the past week. The water supply is irregular and the pressure is very low, affecting daily activities.", category: "Water Supply", createdAt: "2023-10-15T08:30:00Z", updates: [{ message: "Complaint registered and assigned to water department", date: "2023-10-15T09:15:00Z" }, { message: "Team dispatched to investigate the issue", date: "2023-10-15T14:20:00Z" }] },
    { id: 2, area: "Delhi", title: "Street lights not functioning in Connaught Place", reports: 189, severity: "Medium", time: "5 hours ago", lat: 32.78, lon: -96.8, upvotes: 28, description: "Multiple street lights in the inner circle of Connaught Place are not working, creating safety concerns for pedestrians and motorists during night time.", category: "Street Lights", createdAt: "2023-10-15T05:45:00Z", updates: [{ message: "Complaint registered with electrical department", date: "2023-10-15T06:30:00Z" }] },
    { id: 3, area: "Bengaluru", title: "Garbage collection delays in Whitefield", reports: 167, severity: "High", time: "1 day ago", lat: 40.71, lon: 374.01, upvotes: 56, description: "Garbage hasn't been collected for three days in Whitefield area, leading to overflow of bins and unhygienic conditions. The smell is becoming unbearable for residents.", category: "Garbage Collection", createdAt: "2023-10-14T09:20:00Z", updates: [{ message: "Complaint registered with sanitation department", date: "2023-10-14T10:05:00Z" }, { message: "Additional collection vehicles assigned to the area", date: "2023-10-15T08:45:00Z" }] },
    { id: 4, area: "Hyderabad", title: "Potholes causing traffic jams in Hitech City", reports: 142, severity: "Medium", time: "1 day ago", lat: 10.71, lon: 74.01, upvotes: 31, description: "Multiple large potholes on the main road leading to Hitech City are causing traffic congestion during peak hours. Several vehicles have suffered damage.", category: "Road Maintenance", createdAt: "2023-10-14T11:30:00Z", updates: [{ message: "Complaint registered with public works department", date: "2023-10-14T12:15:00Z" }] },
    { id: 5, area: "Kolkata", title: "Drainage blockage near Salt Lake", reports: 128, severity: "High", time: "2 days ago", lat: -30.71, lon: -84.01, upvotes: 39, description: "Severe drainage blockage in Sector V of Salt Lake causing water logging even with light rainfall. Mosquito breeding has increased due to stagnant water.", category: "Drainage", createdAt: "2023-10-13T14:20:00Z", updates: [{ message: "Complaint registered with municipal corporation", date: "2023-10-13T15:10:00Z" }, { message: "Cleaning crew dispatched to location", date: "2023-10-14T09:45:00Z" }] },
    { id: 6, area: "Chennai", title: "Frequent power cuts in T Nagar", reports: 115, severity: "Medium", time: "2 days ago", lat: -30.71, lon: 184.01, upvotes: 22, description: "Residents of T Nagar are experiencing frequent and unscheduled power cuts, sometimes lasting for hours. This is affecting businesses and daily life.", category: "Power Supply", createdAt: "2023-10-13T16:40:00Z", updates: [{ message: "Complaint registered with electricity board", date: "2023-10-13T17:25:00Z" }] },
    { id: 7, area: "Pune", title: "Illegal parking on main roads", reports: 98, severity: "Low", time: "3 days ago", lat: 18.52, lon: 73.85, upvotes: 15, description: "Vehicles are illegally parked on FC Road, causing traffic congestion and inconvenience to pedestrians. No action has been taken despite multiple complaints.", category: "Traffic Management", createdAt: "2023-10-12T10:15:00Z", updates: [{ message: "Complaint registered with traffic police", date: "2023-10-12T11:00:00Z" }] },
    { id: 8, area: "Ahmedabad", title: "Mosquito menace in residential areas", reports: 87, severity: "Medium", time: "3 days ago", lat: 23.02, lon: 72.57, upvotes: 19, description: "Increased mosquito population in Satellite area leading to rise in dengue and malaria cases. Residents request fogging and cleaning of stagnant water sources.", category: "Public Health", createdAt: "2023-10-12T13:50:00Z", updates: [{ message: "Complaint registered with health department", date: "2023-10-12T14:35:00Z" }] },
    { id: 9, area: "Jaipur", title: "Water logging during rains", reports: 76, severity: "High", time: "4 days ago", lat: 26.91, lon: 75.79, upvotes: 34, description: "Even light rainfall causes severe water logging in Malviya Nagar area, making roads impassable and entering homes and shops. Drainage system needs urgent attention.", category: "Drainage", createdAt: "2023-10-11T08:10:00Z", updates: [{ message: "Complaint registered with municipal corporation", date: "2023-10-11T08:55:00Z" }, { message: "Engineers assessing the drainage system", date: "2023-10-12T10:30:00Z" }] },
    { id: 10, area: "Lucknow", title: "Stray animal problem in colonies", reports: 65, severity: "Low", time: "4 days ago", lat: 26.85, lon: 80.95, upvotes: 12, description: "Increased population of stray dogs in Gomti Nagar area is causing safety concerns, especially for children and elderly. Several incidents of barking and chasing have been reported.", category: "Animal Control", createdAt: "2023-10-11T11:30:00Z", updates: [{ message: "Complaint registered with animal control department", date: "2023-10-11T12:15:00Z" }] }
  ]);

  const [upvotedComplaints, setUpvotedComplaints] = useState(new Set());
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const departmentPerformanceData = [
    { department: "Water Department", resolved: 85, pending: 15, avgTime: "2.3 days" },
    { department: "Electricity Board", resolved: 72, pending: 28, avgTime: "3.1 days" },
    { department: "Municipal Corp", resolved: 68, pending: 32, avgTime: "4.2 days" },
    { department: "Public Works", resolved: 91, pending: 9, avgTime: "1.8 days" },
    { department: "Sanitation", resolved: 78, pending: 22, avgTime: "2.7 days" },
    { department: "Traffic Police", resolved: 64, pending: 36, avgTime: "5.5 days" }
  ];
  const reportsOverTimeData = [
    { month: "Jan", reports: 45, resolved: 32 },
    { month: "Feb", reports: 52, resolved: 38 },
    { month: "Mar", reports: 48, resolved: 42 },
    { month: "Apr", reports: 67, resolved: 51 },
    { month: "May", reports: 73, resolved: 58 },
    { month: "Jun", reports: 89, resolved: 72 },
    { month: "Jul", reports: 95, resolved: 76 },
    { month: "Aug", reports: 112, resolved: 89 },
    { month: "Sep", reports: 98, resolved: 82 },
    { month: "Oct", reports: 84, resolved: 71 },
    { month: "Nov", reports: 76, resolved: 64 },
    { month: "Dec", reports: 63, resolved: 54 },
  ];
  
  const sortedComplaints = useMemo(() => {
    const severityOrder = { High: 0, Medium: 1, Low: 2 };
    return [...trendingComplaints].sort((a, b) => {
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }, [trendingComplaints]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      if (!storedUser || storedUser === "undefined" || storedUser === "null") {
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage:", error);
      localStorage.removeItem("user");
      navigate("/login");
    }

    // Animation trigger
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Detect scroll for header style changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const handleCardClick = (cardIndex) => {
    setActiveCard(activeCard === cardIndex ? null : cardIndex);
  };

  const navigateToRaiseComplaint = () => {
    if (user && user._id) {
      navigate(`/user/${user._id}/raise`);
    }
  };

  const navigateToTrackComplaint = () => {
    if (user && user._id) {
      navigate(`/user/${user._id}/track`);
    }
  };

  const navigateToResolvedComplaints = () => {
    if (user && user._id) {
      navigate(`/user/${user._id}/resolved`);
    }
  };

  const loadMoreComplaints = () => {
    setVisibleComplaints((prev) => Math.min(prev + 5, sortedComplaints.length));
  };

  const showLessComplaints = () => {
    setVisibleComplaints(5);
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/40";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/40";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/40";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const handleUpvote = (complaintId, e) => {
    e.stopPropagation(); // Prevent triggering the complaint detail modal
    if (upvotedComplaints.has(complaintId)) {
      // Already upvoted, remove the upvote
      setUpvotedComplaints(prev => {
        const newSet = new Set(prev);
        newSet.delete(complaintId);
        return newSet;
      });
      
      setTrendingComplaints(prev => 
        prev.map(complaint => 
          complaint.id === complaintId 
            ? { ...complaint, upvotes: Math.max(0, complaint.upvotes - 1) }
            : complaint
        )
      );
    } else {
      // Add upvote
      setUpvotedComplaints(prev => new Set(prev).add(complaintId));
      
      setTrendingComplaints(prev => 
        prev.map(complaint => 
          complaint.id === complaintId 
            ? { ...complaint, upvotes: complaint.upvotes + 1 }
            : complaint
        )
      );
    }
  };

  const openComplaintDetail = (complaint) => {
    setSelectedComplaint(complaint);
    setDetailModalOpen(true);
  };

  const formatDetailDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-white/30"}`}
      />
    ));
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/10 p-4 rounded-2xl border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <p className="font-bold text-white text-sm mb-4 border-b border-white/10 pb-2 text-shadow-sm">
            {label}
          </p>
          <div className="space-y-5 ounded-xl">
            {/* Resolved */}
            <div className="flex justify-between items-center">
              <span className="text-green-300 text-sm text-shadow-sm">
                Resolved
              </span>
              <span className="text-white font-semibold text-shadow-sm">
                {data.resolved}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-[0_0_20px_rgba(16,185,129,0.7)] transition-all duration-500"
                style={{ width: `${data.resolved}%` }}
              />
            </div>

            {/* Pending */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-yellow-300 text-sm text-shadow-sm">
                Pending
              </span>
              <span className="text-white font-semibold text-shadow-sm">
                {data.pending}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-[0_0_20px_rgba(245,158,11,0.6)] transition-all duration-500"
                style={{ width: `${data.pending}%` }}
              />
            </div>

            {/* Avg Time */}
            <div className="flex justify-between items-center mt-5 pt-3 border-t border-white/10">
              <span className="text-blue-300 text-sm text-shadow-sm">
                Avg. Time
              </span>
              <span className="text-white font-semibold text-shadow-sm">
                {data.avgTime}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for reports over time chart
  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] p-4 flex flex-col space-y-2">
          <p className="text-white font-bold text-sm text-shadow-md">{label}</p>
          <p className="text-blue-400 text-sm text-shadow-sm">
            Reports: {payload[0].value}
          </p>
          <p className="text-green-400 text-sm text-shadow-sm">
            Resolved: {payload[1].value}
          </p>
          <p className="text-gray-300 text-sm">
            Resolution Rate:{" "}
            <span className="font-semibold text-white text-shadow-sm">
              {payload[0].value
                ? Math.round((payload[1].value / payload[0].value) * 100)
                : 0}
              %
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/userloginbg6.jpg')" }}
          ></div>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/userloginbg6.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>
      <Chatbot />
      {/* Header at the very top - matching the provided design */}
      <motion.header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "backdrop-blur-lg shadow-sm" : "backdrop-blur-md"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Site Name */}
          <motion.div
            className="text-xl md:text-2xl font-bold text-white"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            JanConnect
          </motion.div>

  

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center space-x-4">
           {/* district name display */}
          <div className="relative">
            <input
              type="text"
              value={district || ""}
              readOnly
              placeholder="Detecting district..."
              className="p-2 bg-white-900/70 backdrop-blur-sm rounded-xl border border-white/20 text-white focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200 shadow-sm cursor-not-allowed"
            />
          </div>


            {/* Authority Dropdown */}
            {/* <div className="relative">
              <select
                value={selectedAuthority}
                onChange={(e) => setSelectedAuthority(e.target.value)}
                disabled={!selectedState}
                className="p-2 bg-white-900/70 backdrop-blur-sm rounded-xl border border-white/20 text-white focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-white-800/90 text-white">
                  Select Your Authority
                </option>
                {selectedState &&
                  authorities[selectedState.replace(/\s+/g, "")]?.map(
                    (auth) => (
                      <option
                        key={auth}
                        value={auth}
                        className="bg-white-800/90 text-white"
                      >
                        {auth}
                      </option>
                    )
                  )}
              </select>
            </div> */}

            {/* Profile Section */}
            <div className="relative">
              <motion.button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 bg-white-900/70 hover:bg-white-800/70 p-2 pl-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-white/20 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white">Welcome, {user.name}</span>
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white-900/95 backdrop-blur-xl rounded-xl shadow-lg z-20 overflow-hidden border border-white/20"
                  >
                    <div className="p-4 border-b border-white/10">
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-white/60 text-sm">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left p-4 text-white/90 hover:bg-red-500/20 transition-all duration-150 flex items-center"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-xl bg-white/0 hover:bg-white/10 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
            >
            {mobileMenuOpen ? (
              <i className="fas fa-times h-6 w-6 text-white"></i>
            ) : (
              <i className="fas fa-bars h-6 w-6 text-white"></i>
            )}
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white/20 backdrop-blur-lg md:hidden overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {/* State Dropdown in Mobile Menu */}
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedAuthority("");
                  }}
                  className="w-full p-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 text-gray-800 focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200 shadow-sm"
                >
                  <option value="" className="bg-white-800/90 text-white">
                    Select Your State
                  </option>
                  {states.map((state) => (
                    <option
                      key={state}
                      value={state}
                      className="bg-white-800/90 text-white"
                    >
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Authority Dropdown in Mobile Menu */}
              <div className="relative">
                <select
                  value={selectedAuthority}
                  onChange={(e) => setSelectedAuthority(e.target.value)}
                  disabled={!selectedState}
                  className="w-full p-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 text-gray-800 focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" className="bg-white-800/90 text-white">
                    Select Your Authority
                    </option>
                  {selectedState &&
                    authorities[selectedState.replace(/\s+/g, "")]?.map(
                      (auth) => (
                        <option
                          key={auth}
                          value={auth}
                          className="bg-white-800/90 text-white"
                        >
                          {auth}
                        </option>
                      )
                    )}
                </select>
              </div>

              {/* Profile Info in Mobile Menu */}
              <div className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20">
                <p className="text-white-800 font-medium">{user.name}</p>
                <p className="text-white-800/60 text-sm">{user.email}</p>
              </div>

              {/* Logout Button in Mobile Menu */}
              <motion.button
                className="flex items-center justify-center space-x-1 px-4 py-2 rounded-xl border border-white text-gray-800 bg-transparent hover:bg-white/10 transition-all duration-300"
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative w-full max-w-6xl mx-auto h-[28rem] md:h-[22rem] ">
        {/* Lion Component as background */}
        <div className="absolute top-0 right-80 bottom-0 z-0 w-[60%] md:w-[50%]">
          <LionComponent />
        </div>

        {/* Welcome Text overlay */}
        <motion.div
          className={`absolute top-1/3 md:left-0 transition-all duration-700 delay-400 ease-out whitespace-nowrap ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <h1 className="text-[5vw] md:text-[4vw] font-bold text-white">
            Welcome, {user.name} 🎉
          </h1>
          <p className="text-white/70 text-lg">
            Press and drag to blow the wind. The lion will surely appreciate.
          </p>
        </motion.div>
</div>


      <div className="flex-1 flex items-center justify-center p-4 relative z-10 mt-8">
        <div className="w-full max-w-6xl">

          {/* Three Interactive Cards */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 px-4">
            {/* Raise a Complaint Card */}
            <motion.div
              className={`w-full md:w-72 h-80 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 cursor-pointer flex flex-col items-center justify-center ${
                activeCard === 0 ? "z-30" : "z-10"
              }`}
              onClick={() => handleCardClick(0)}
              animate={{
                scale: activeCard === 0 ? 1.1 : 1,
                rotateY: activeCard === 0 ? 0 : activeCard !== null ? 10 : 0,
                x:
                  activeCard === 0
                    ? 0
                    : activeCard === 1
                    ? -40
                    : activeCard === 2
                    ? 40
                    : 0,
                y: activeCard === 0 ? -20 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mb-5">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Raise a Complaint
              </h3>
              <p className="text-white/80 text-center text-sm">
                Report issues and problems in your community that need attention
                from authorities.
              </p>
              <motion.button
                className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-medium"
                animate={{ scale: activeCard === 0 ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={navigateToRaiseComplaint}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Report Now
              </motion.button>
            </motion.div>

            {/* Track Your Complaint Card */}
            <motion.div
              className={`w-full md:w-72 h-80 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 cursor-pointer flex flex-col items-center justify-center ${
                activeCard === 1 ? "z-30" : "z-10"
              }`}
              onClick={() => handleCardClick(1)}
              animate={{
                scale: activeCard === 1 ? 1.1 : 1,
                rotateY: activeCard === 1 ? 0 : activeCard !== null ? 10 : 0,
                x:
                  activeCard === 1
                    ? 0
                    : activeCard === 0
                    ? 40
                    : activeCard === 2
                    ? -40
                    : 0,
                y: activeCard === 1 ? -20 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mb-5">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Track Your Complaint
              </h3>
              <p className="text-white/80 text-center text-sm">
                Monitor the status of your submitted complaints and see the
                progress being made.
              </p>
              <motion.button
                className="mt-6 bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-medium"
                animate={{ scale: activeCard === 1 ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={navigateToTrackComplaint}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Check Status
              </motion.button>
            </motion.div>

            {/* Resolved Complaints Card */}
            <motion.div
              className={`w-full md:w-72 h-80 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 cursor-pointer flex flex-col items-center justify-center ${
                activeCard === 2 ? "z-30" : "z-10"
              }`}
              onClick={() => handleCardClick(2)}
              animate={{
                scale: activeCard === 2 ? 1.1 : 1,
                rotateY: activeCard === 2 ? 0 : activeCard !== null ? 10 : 0,
                x:
                  activeCard === 2
                    ? 0
                    : activeCard === 0
                    ? -40
                    : activeCard === 1
                    ? 40
                    : 0,
                y: activeCard === 2 ? -20 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-5">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Resolved Complaints
              </h3>
              <p className="text-white/80 text-center text-sm">
                View your previously resolved complaints and see how your
                reports made a difference.
              </p>
              <motion.button
                className="mt-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium"
                animate={{ scale: activeCard === 2 ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={navigateToResolvedComplaints}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View History
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Globe on left, Trending complaints on right */}
      <div className="flex-1 flex flex-col lg:flex-row mt-20 p-4 relative z-10 gap-6">
        {/* Left Section - Globe */}
        <div className="w-full lg:w-1/2 h-96 lg:h-auto">
          <Globe3D complaints={sortedComplaints.slice(0, 6)} />
        </div>

        {/* Right Section - Trending Complaints */}
        <div className="w-full lg:w-1/2 backdrop-blur-md rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Trending Complaints
            </h2>
            <div className="flex items-center text-white/60 text-sm">
              <Users className="h-4 w-4 mr-1" />
              <span>{sortedComplaints.length} total reports</span>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {sortedComplaints
              .slice(0, visibleComplaints)
              .map((complaint, index) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                  onClick={() => openComplaintDetail(complaint)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 text-blue-400 mr-2" />
                        <span className="text-white font-medium">
                          {complaint.area}
                        </span>
                        <span
                          className={`ml-3 px-2 py-1 rounded-full text-xs border ${getSeverityColor(
                            complaint.severity
                          )}`}
                        >
                          {getSeverityIcon(complaint.severity)}{" "}
                          {complaint.severity}
                        </span>
                      </div>
                      <h3 className="text-white text-sm font-semibold mb-2">
                        {complaint.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{complaint.reports} reports</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{complaint.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center ml-2" onClick={(e) => e.stopPropagation()}>
                      <motion.button
                        onClick={(e) => handleUpvote(complaint.id, e)}
                        className={`p-1 rounded-full ${
                          upvotedComplaints.has(complaint.id)
                            ? "bg-blue-500/30 text-blue-300"
                            : "bg-white/10 text-white/60 hover:bg-white/20"
                        } transition-all duration-200`}
                        whileTap={{ scale: 0.9 }}
                        title="Upvote this complaint"
                      >
                        <ArrowBigUp className="h-4 w-4" />
                      </motion.button>
                      <span className="text-xs text-white/80 mt-1">
                        {complaint.upvotes}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {sortedComplaints.length > 5 && (
            <div className="mt-6 flex justify-center">
              {visibleComplaints < sortedComplaints.length ? (
                <motion.button
                  onClick={loadMoreComplaints}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/40 text-white rounded-full border border-indigo-500/50 transition-all duration-300"
                >
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Load More ({sortedComplaints.length - visibleComplaints}{" "}
                  remaining)
                </motion.button>
              ) : (
                <motion.button
                  onClick={showLessComplaints}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-gray-600/30 hover:bg-gray-600/40 text-white rounded-full border border-gray-500/50 transition-all duration-300"
                >
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show Less
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="w-full p-4 mt-8 relative z-10">
        <div className=" backdrop-blur-md rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Performance Analytics
            </h2>
            <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-xl p-1">
              <button
                onClick={() => setActiveChartTab("department")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center ${
                  activeChartTab === "department"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-transparent text-white/70 hover:bg-white/10"
                }`}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Department Performance
              </button>
              <button
                onClick={() => setActiveChartTab("reports")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center ${
                  activeChartTab === "reports"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-transparent text-white/70 hover:bg-white/10"
                }`}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Reports Timeline
              </button>
            </div>
          </div>

          <div className="h-80">
            {activeChartTab === "department" ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentPerformanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  barSize={35}
                >
                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient
                      id="resolvedGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#34D399" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#10B981"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                    <linearGradient
                      id="pendingGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#FDE68A" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#F59E0B"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="department"
                    // angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{
                      fill: "rgba(255,255,255,0.8)",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 12 }}
                    label={{
                      value: "Resolution Rate (%)",
                      angle: -90,
                      position: "insideLeft",
                      style: {
                        fill: "rgba(255,255,255,0.8)",
                        fontSize: 12,
                        fontWeight: 500,
                      },
                    }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    content={<CustomBarTooltip />}
                    cursor={{ fill: "rgba(255,255,255,0.1)" }}
                  />

                  {/* Bars with gradient */}
                  <Bar
                    dataKey="resolved"
                    name="Resolved"
                    fill="url(#resolvedGradient)"
                    radius={[6, 6, 0, 0]}
                    background={{ fill: "rgba(255,255,255,0.05)", radius: 6 }}
                  />
                  <Bar
                    dataKey="pending"
                    name="Pending"
                    fill="url(#pendingGradient)"
                    radius={[6, 6, 0, 0]}
                    background={{ fill: "rgba(255,255,255,0.05)", radius: 6 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={reportsOverTimeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.7)" }} />
                  <Tooltip content={<CustomLineTooltip />} />
                  <Legend
                    wrapperStyle={{
                      color: "rgba(255,255,255,0.7)",
                      paddingTop: "20px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reports"
                    name="Total Reports"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#3B82F6" }}
                    activeDot={{ r: 6, fill: "#3B82F6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    name="Resolved Cases"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#10B981" }}
                    activeDot={{ r: 6, fill: "#10B981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="w-full flex justify-center items-center text-center mt-6">
          <h1 className="text-[5vw] md:text-[3vw] font-bold text-white">Live Complaints Heatmap</h1>
        </div>
        </div>
      <div style={{ background: "#081025", minHeight: "100vh", color: "#e6eef8", padding: 0 }}>
      <header style={{ padding: "1rem 1.25rem", fontSize: "1.05rem", fontWeight: 600 }}>
        JanConnect — Scroll Heatmap demo
      </header>
      <main>
        <ScrollHeatmap />
      </main>
      </div>

      {/* Complaint Detail Modal */}
      <AnimatePresence>
        {detailModalOpen && selectedComplaint && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedComplaint.title}</h2>
                <button 
                  onClick={() => setDetailModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-white/80">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>Reported: {formatDetailDate(selectedComplaint.createdAt)}</span>
                </div>
                <div className="flex items-center text-white/80">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{selectedComplaint.area}</span>
                </div>
                <div className="flex items-center text-white/80">
                  <span>Category: {selectedComplaint.category}</span>
                </div>
                <div className="flex items-center text-white/80">
                  <span>Severity: {selectedComplaint.severity}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-white/80">{selectedComplaint.description}</p>
              </div>
              
              {/* Progress Timeline */}
              {selectedComplaint.updates && selectedComplaint.updates.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Progress Timeline</h3>
                  <div className="space-y-4">
                    {selectedComplaint.updates.map((update, index) => (
                      <div key={index} className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                          {index < selectedComplaint.updates.length - 1 && (
                            <div className="w-0.5 h-12 bg-indigo-400/30 mt-1"></div>
                          )}
                        </div>
                        <div className="pb-4">
                          <p className="text-white font-medium">{update.message}</p>
                          <p className="text-white/60 text-sm">{formatDetailDate(update.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Stats Section */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Total Reports: </span>
                    <span className="text-white">{selectedComplaint.reports}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Upvotes: </span>
                    <span className="text-white">{selectedComplaint.upvotes}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        select option {
          background: rgba(30, 41, 59, 0.95);
          color: white;
          padding: 10px;
        }
        /* Custom scrollbar for trending complaints */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}