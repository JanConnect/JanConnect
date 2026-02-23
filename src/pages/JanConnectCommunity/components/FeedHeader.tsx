import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Bell, Search, Flame, Clock, TrendingUp, ChevronUp } from "lucide-react";

interface FeedHeaderProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: "hot", icon: Flame, label: "Hot" },
  { id: "new", icon: Clock, label: "New" },
  { id: "top", icon: TrendingUp, label: "Top" },
  { id: "rising", icon: ChevronUp, label: "Rising" },
];

const FeedHeader: React.FC<FeedHeaderProps> = ({ activeFilter, onFilterChange }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
            J
          </div>
          <span className="font-display font-semibold text-foreground hidden sm:block">janconnect</span>
        </button>

        {/* Home */}
        <button className="action-button hidden md:flex">
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-secondary/60 rounded-full p-1">
          {filters.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => onFilterChange(f.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === f.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search communities..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary/60 border-none text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
            U
          </div>
        </div>
      </div>
    </header>
  );
};

export default FeedHeader;
