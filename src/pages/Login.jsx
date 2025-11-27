// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEmail, setPassword, loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

// Import the logo
import webseederLogo from '../assets/webseederlogo.png';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, password, isLoading, error, isAuthenticated } = useSelector(state => state.auth);
  
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=faces",
      title: "Welcome Back",
      description: "Sign in to access your dashboard"
    },
    {
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=faces",
      title: "Secure Access", 
      description: "Your data is protected with enterprise-grade security"
    },
    {
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=faces",
      title: "Modern Interface",
      description: "Experience our redesigned, intuitive platform"
    }
  ];

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Auto slide transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleEmailChange = (e) => {
    dispatch(setEmail(e.target.value));
    if (error) dispatch(loginFailure(null));
  };

  const handlePasswordChange = (e) => {
    dispatch(setPassword(e.target.value));
    if (error) dispatch(loginFailure(null));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      dispatch(loginFailure('Please fill in all fields'));
      return;
    }

    dispatch(loginStart());
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication - replace with real API call
      const mockUser = {
        id: 1,
        name: 'Branch Manager',
        email: email,
        role: 'manager',
        branch: 'Downtown Branch'
      };
      
      if (email.includes('@') && password.length >= 6) {
        dispatch(loginSuccess(mockUser));
        navigate('/dashboard');
      } else {
        dispatch(loginFailure('Invalid email or password. Use any email with @ and password with 6+ characters.'));
      }
    } catch (err) {
      dispatch(loginFailure('Login failed. Please try again.'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Side - Image Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === currentSlide
                ? 'translate-x-0'
                : index < currentSlide
                ? '-translate-x-full'
                : 'translate-x-full'
            }`}
          >
            <div className="h-full relative">
              <img
                alt={slide.title}
                className="w-full h-full object-cover"
                src={slide.image}
              />
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8 z-10">
                  <h2 className="text-5xl font-bold text-white mb-6">
                    {slide.title}
                  </h2>
                  <p className="text-xl text-gray-200 max-w-md mx-auto leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            {/* Updated logo import */}
            <img
              alt="WebSeeder"
              className="h-16 mx-auto mb-6"
              src={webseederLogo}
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500"
                placeholder="Enter your email"
                required
                type="email"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500"
                placeholder="Enter your password"
                required
                type="password"
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials Hint */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>Demo:</strong> Use any email with @ and password with 6+ characters
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Secured by WebSeeder Technology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;