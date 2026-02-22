import { COLORS } from '../utils/constants';

export const communityStyles = {
  // Glassmorphism effects
  glassCard: {
    background: COLORS.surface,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '1rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },

  // Gradient backgrounds
  gradients: {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    success: 'bg-gradient-to-r from-green-400 to-emerald-500',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    danger: 'bg-gradient-to-r from-red-400 to-pink-500',
    info: 'bg-gradient-to-r from-blue-400 to-cyan-500',
  },

  // Text styles
  typography: {
    h1: 'text-4xl md:text-5xl font-bold text-white',
    h2: 'text-3xl md:text-4xl font-bold text-white',
    h3: 'text-2xl md:text-3xl font-semibold text-white',
    h4: 'text-xl md:text-2xl font-semibold text-white',
    body: 'text-white/80',
    small: 'text-sm text-white/60',
  },

  // Animation keyframes (to be added to global CSS)
  animations: `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    @keyframes slideIn {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(45, 126, 231, 0.3); }
      50% { box-shadow: 0 0 40px rgba(45, 126, 231, 0.6); }
    }
    
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
    
    .animate-pulse-slow {
      animation: pulse 2s ease-in-out infinite;
    }
    
    .animate-slide-in {
      animation: slideIn 0.5s ease-out;
    }
    
    .animate-glow {
      animation: glow 2s ease-in-out infinite;
    }
  `,

  // Scrollbar styles
  scrollbar: `
    .scrollbar-thin::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 10px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  `,

  // Grid pattern
  gridPattern: `
    .bg-grid-pattern {
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 20px 20px;
    }
  `,
};

// Utility function to inject styles
export const injectCommunityStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    ${communityStyles.animations}
    ${communityStyles.scrollbar}
    ${communityStyles.gridPattern}
  `;
  document.head.appendChild(style);
};