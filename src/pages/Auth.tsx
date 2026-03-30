import React, { useState, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, Moon, Sun, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { env } from '../config/env';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

const BrandLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="22" cy="22" r="8" fill="currentColor" fillOpacity="0.2" />
    <rect x="14" y="2" width="16" height="16" rx="6" fill="currentColor" fillOpacity="0.4" />
    <rect x="2" y="14" width="16" height="16" rx="6" fill="currentColor" fillOpacity="0.4" />
    <rect x="2" y="2" width="16" height="16" rx="6" fill="currentColor" />
  </svg>
);

export default function Auth() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { login, signup, sendOtp, resetPassword, guestLogin } = useUser();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = [...otp];
    pastedData.forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (isForgotPassword && !isVerifying) {
        // Step 1: Send OTP for password reset
        await sendOtp(formData.email);
        setIsVerifying(true);
      } else if (isForgotPassword && isVerifying) {
        // Step 2: Reset password with OTP
        const otpValue = otp.join('');
        await resetPassword({
          email: formData.email,
          otp: otpValue,
          new_password: formData.password,
          confirm_password: formData.password,
        });
        setSuccess('Password reset successfully. You can now sign in.');
        setIsForgotPassword(false);
        setIsVerifying(false);
        setOtp(['', '', '', '', '', '']);
      } else if (isSignUp && !isVerifying) {
        // Step 1: Send OTP
        await sendOtp(formData.email);
        setIsVerifying(true);
      } else if (isVerifying) {
        // Step 2: Signup with OTP
        const otpValue = otp.join('');
        await signup({
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          otp: otpValue,
        });
        // After signup, login automatically
        await login({
          email: formData.email,
          password: formData.password,
        });
        navigate('/');
      } else {
        // Sign in
        await login({
          email: formData.email,
          password: formData.password,
        });
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-zinc-50 dark:bg-[#111113] text-zinc-900 dark:text-zinc-200 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white/20 dark:selection:text-white transition-colors duration-500">
      
      {/* Left Panel - Branding/Visual (Hidden on mobile) */}
      <div className="hidden lg:flex relative w-1/2 bg-zinc-900 dark:bg-[#1a1a1f] p-12 flex-col justify-between overflow-hidden transition-colors duration-500">
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
          alt="Abstract 3D" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 dark:opacity-20 mix-blend-luminosity transition-opacity duration-500"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent dark:from-[#111113]/80 dark:via-[#111113]/20 transition-opacity duration-500" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 text-white dark:text-zinc-200 transition-colors duration-500">
          <div className="w-10 h-10 bg-white dark:bg-white text-zinc-900 dark:text-black rounded-none flex items-center justify-center shadow-lg dark:shadow-none transition-colors duration-500">
            <BrandLogo className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight">{env.appName}</span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-lg space-y-6">
          <h1 className="text-4xl xl:text-5xl font-medium tracking-tight text-white dark:text-zinc-200 leading-[1.1] transition-colors duration-500">
            {isSignUp ? 'Start building your digital space.' : 'Welcome back to your workspace.'}
          </h1>
          <p className="text-zinc-300 dark:text-zinc-400 text-lg leading-relaxed transition-colors duration-500">
            Access premium tools, tactile controls, and high-fidelity design blocks to elevate your workflow and craft exceptional interfaces.
          </p>
          
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-none border-2 border-zinc-900 dark:border-zinc-900 transition-colors duration-500" src="https://i.pravatar.cc/100?img=1" alt="User" />
              <img className="w-10 h-10 rounded-none border-2 border-zinc-900 dark:border-zinc-900 transition-colors duration-500" src="https://i.pravatar.cc/100?img=2" alt="User" />
              <img className="w-10 h-10 rounded-none border-2 border-zinc-900 dark:border-zinc-900 transition-colors duration-500" src="https://i.pravatar.cc/100?img=3" alt="User" />
            </div>
            <div className="text-sm text-zinc-400 dark:text-zinc-500 transition-colors duration-500">
              <span className="text-white dark:text-zinc-200 font-medium transition-colors duration-500">10,000+</span> designers <br/>already joined
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        
        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between lg:justify-end items-center gap-6 z-10">
          {/* Back Button for SignUp/ForgotPassword */}
          {(isSignUp || isForgotPassword || isVerifying) && (
            <button 
              onClick={() => {
                setIsSignUp(false);
                setIsForgotPassword(false);
                setIsVerifying(false);
                setError(null);
                setSuccess(null);
              }}
              className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-300 active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 text-zinc-900 dark:text-zinc-200 transition-colors duration-500">
            <BrandLogo className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">{env.appName}</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hidden sm:block text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-300 active:scale-[0.98]">Help</a>
            <a href="#" className="hidden sm:block text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-300 active:scale-[0.98]">Privacy</a>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-none border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.1] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-white/[0.06] transition-all duration-300 active:scale-[0.96]"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-[400px] space-y-8">
            
            {/* Header */}
            <div className="space-y-2 text-center lg:text-left transition-colors duration-500">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-200 transition-colors duration-500">
                {isVerifying 
                  ? 'Verify your email'
                  : isForgotPassword ? 'Reset password' : isSignUp ? 'Create an account' : 'Sign in'}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-500">
                {isVerifying
                  ? 'We sent a verification code to your email.'
                  : isForgotPassword
                    ? 'Enter your email to receive a reset code'
                    : isSignUp 
                      ? 'Enter your details below to create your account' 
                      : 'Enter your email and password to access your account'}
              </p>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-none text-rose-500 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-none text-emerald-500 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                {success}
              </div>
            )}

            {isVerifying ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { if (el) inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-14 text-center text-xl font-semibold bg-white dark:bg-[#111113] border border-black/5 dark:border-white/[0.08] shadow-sm dark:shadow-none rounded-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 focus:border-transparent transition-all duration-500"
                    />
                  ))}
                </div>
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded-none font-semibold border border-zinc-900 dark:border-white/[0.1] hover:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {isForgotPassword ? 'Reset Password' : 'Verify Email'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="space-y-4 pt-2">
                  <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-500">
                    Didn't receive the code?
                    <button 
                      type="button" 
                      onClick={() => sendOtp(formData.email)}
                      className="ml-1.5 font-medium text-zinc-900 dark:text-zinc-200 hover:underline underline-offset-4 transition-all duration-500"
                    >
                      Resend
                    </button>
                  </p>
                  <p className="text-center text-sm">
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsVerifying(false);
                        setIsForgotPassword(false);
                      }}
                      className="font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-500"
                    >
                      Back to sign in
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              <>
                {/* Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {isSignUp && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 transition-colors duration-500">First Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input 
                              type="text" 
                              required
                              value={formData.firstName}
                              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#111113] border border-black/5 dark:border-white/[0.08] shadow-sm dark:shadow-none rounded-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 focus:border-transparent transition-all duration-500 sm:text-sm" 
                              placeholder="Jane" 
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 transition-colors duration-500">Last Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input 
                              type="text" 
                              required
                              value={formData.lastName}
                              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#111113] border border-black/5 dark:border-white/[0.08] shadow-sm dark:shadow-none rounded-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 focus:border-transparent transition-all duration-500 sm:text-sm" 
                              placeholder="Doe" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 transition-colors duration-500">Username</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                          <input 
                            type="text" 
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#111113] border border-black/5 dark:border-white/[0.08] shadow-sm dark:shadow-none rounded-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 focus:border-transparent transition-all duration-500 sm:text-sm" 
                            placeholder="janedoe" 
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 transition-colors duration-500">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#111113] border border-black/5 dark:border-white/[0.08] shadow-sm dark:shadow-none rounded-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 focus:border-transparent transition-all duration-500 sm:text-sm" 
                        placeholder="name@company.com" 
                      />
                    </div>
                  </div>

                  {(!isForgotPassword || isVerifying) && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors duration-500">
                          {isForgotPassword ? 'New Password' : 'Password'}
                        </label>
                        {!isSignUp && !isForgotPassword && (
                          <button 
                            type="button"
                            onClick={() => setIsForgotPassword(true)}
                            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-300 active:scale-[0.98]"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-[#111113] border border-black/5 dark:border-white/[0.08] shadow-sm dark:shadow-none rounded-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 focus:border-transparent transition-all duration-500 sm:text-sm" 
                          placeholder="••••••••" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-500"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded-none font-semibold border border-zinc-900 dark:border-white/[0.1] hover:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 active:scale-[0.98] mt-6 disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {isForgotPassword ? 'Send Reset Code' : isSignUp ? 'Create Account' : 'Sign In'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {!isVerifying && !isForgotPassword && (
                    <button 
                      type="button" 
                      onClick={() => {
                        guestLogin();
                        navigate('/');
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-transparent border border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-zinc-200 rounded-none font-semibold hover:border-zinc-900 dark:hover:border-white hover:bg-zinc-50 dark:hover:bg-white/[0.06] transition-all duration-300 active:scale-[0.98]"
                    >
                      Continue as Guest
                    </button>
                  )}
                </form>

                {/* Footer Toggle */}
                <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-500">
                  {isSignUp ? 'Already have an account?' : isForgotPassword ? 'Remember your password?' : "Don't have an account?"}
                  <button 
                    onClick={() => {
                      setIsSignUp(!isSignUp && !isForgotPassword);
                      setIsForgotPassword(false);
                      setIsVerifying(false);
                      setError(null);
                      setSuccess(null);
                    }} 
                    className="ml-1.5 font-medium text-zinc-900 dark:text-zinc-200 hover:underline underline-offset-4 transition-all duration-500"
                  >
                    {isSignUp || isForgotPassword ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
