function Logo({ theme = 'light', showTagline = false, className = '', height = 40 }) {
  const isDark = theme === 'dark';
  const localTextColor = isDark ? '#FFFFFF' : '#141524';
  const taglineColor = isDark ? '#9CA1BA' : '#55586D';

  const viewBox = showTagline ? '0 0 340 115' : '0 0 340 92';
  const calculatedHeight = height;

  return (
    <div className={`localloop-logo-wrap ${className}`}>
      <svg
        viewBox={viewBox}
        height={calculatedHeight}
        style={{ width: 'auto', display: 'block', overflow: 'visible' }}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="LocalLoop - Discover what's happening around you"
        role="img"
      >
        <defs>
          {/* Main Pin Gradient (Purple -> Magenta/Pink -> Sunset Orange) */}
          <linearGradient id="llPinGrad" x1="15%" y1="15%" x2="85%" y2="85%">
            <stop offset="0%" stopColor="#4A1FFF" />
            <stop offset="28%" stopColor="#6E32F6" />
            <stop offset="68%" stopColor="#E4278A" />
            <stop offset="100%" stopColor="#FF7728" />
          </linearGradient>

          {/* Planetary Orbital Ring Gradient (Orange to Warm Gold) */}
          <linearGradient id="llRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8500" />
            <stop offset="50%" stopColor="#FFA600" />
            <stop offset="100%" stopColor="#FF6000" />
          </linearGradient>

          {/* Infinity Loop Gradient for "Loop" */}
          <linearGradient id="llLoopTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5B2BF8" />
            <stop offset="42%" stopColor="#8937F5" />
            <stop offset="70%" stopColor="#E62688" />
            <stop offset="100%" stopColor="#FF6E28" />
          </linearGradient>

          {/* Soft Drop Shadow under pin */}
          <radialGradient id="llShadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6C35F5" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6C35F5" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* --- ICON SYMBOL (PIN + ORBIT RING + ENERGY RAYS) --- */}
        <g id="logo-icon">
          {/* Soft shadow under pin base */}
          <ellipse cx="68" cy="84" rx="24" ry="5" fill="url(#llShadowGrad)" />

          {/* Back part of orbital ring */}
          <path
            d="M 33 53 C 25 43, 85 24, 107 43"
            fill="none"
            stroke="url(#llRingGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* The Vibrant Pin Marker Body */}
          <path
            d="M 68 80
               C 62 72, 43 51, 43 36
               A 25 25 0 1 1 93 36
               C 93 51, 74 72, 68 80 Z"
            fill="url(#llPinGrad)"
          />

          {/* Inner White Cutout of Pin */}
          <circle cx="68" cy="36" r="10.5" fill={isDark ? '#141522' : '#FFFFFF'} />

          {/* Front part of orbital ring looping across the pin */}
          <path
            d="M 32 50 C 23 65, 80 77, 108 55"
            fill="none"
            stroke="url(#llRingGrad)"
            strokeWidth="7.5"
            strokeLinecap="round"
          />

          {/* Upper Sparkle Beams / Energy Rays */}
          <path
            d="M 97 14 L 102 24"
            stroke="#FFA500"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 107 27 L 117 33"
            stroke="#FF9500"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>

        {/* --- LOGO TEXT "LocalLoop" --- */}
        <g id="logo-text" transform="translate(122, 0)">
          {/* "Local" in Bold Modern Sans */}
          <text
            x="0"
            y="60"
            fill={localTextColor}
            fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif"
            fontWeight="900"
            fontSize="49"
            letterSpacing="-1.2"
          >
            Local
          </text>

          {/* "Loop" in Vibrant Continuous Gradient with Infinity Twist */}
          <text
            x="118"
            y="60"
            fill="url(#llLoopTextGrad)"
            fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif"
            fontWeight="900"
            fontSize="49"
            letterSpacing="-1.2"
          >
            Loop
          </text>

          {/* Infinity Intertwining Loop Accent across "oo" */}
          <path
            d="M 168 47
               C 168 39, 178 39, 185 47
               C 192 55, 202 55, 202 47
               C 202 39, 192 39, 185 47
               C 178 55, 168 55, 168 47 Z"
            fill="none"
            stroke="url(#llLoopTextGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Tagline: Discover what's happening around you */}
          {showTagline && (
            <text
              x="2"
              y="85"
              fill={taglineColor}
              fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif"
              fontWeight="500"
              fontSize="14.5"
              letterSpacing="0.2"
            >
              Discover what’s happening around you.
            </text>
          )}
        </g>
      </svg>
    </div>
  );
}

export default Logo;
