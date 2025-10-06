export default function Hero({ 
    title = "Welcome to MedFi", 
    subtitle = "Your gateway to decentralized healthcare", 
    backgroundImage = "/default-hero.jpg",
    overlayColor = "rgba(0, 0, 0, 0.5)",
    height = "70vh",
    textColor = "white",
    showCTA = false,
    ctaText = "Get Started",
    onCTAClick = () => {}
  }) {
    return (
      <div 
        className="relative w-full flex items-center justify-center"
        style={{ 
          height: height,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay */}
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: overlayColor }}
        ></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 
            className="text-4xl md:text-6xl font-bold mb-3 leading-tight"
            style={{ color: textColor }}
          >
            {title}
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-8 leading-relaxed"
            style={{ color: textColor }}
          >
            {subtitle}
          </p>
          
          {showCTA && (
            <button
              onClick={onCTAClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-300"
            >
              {ctaText}
            </button>
          )}
        </div>
      </div>
    );
  }