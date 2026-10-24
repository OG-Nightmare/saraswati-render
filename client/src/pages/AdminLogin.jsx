import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [mode, setMode] = useState('login'); // 'login' | 'forgot'
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot password state machine: 'REQUEST_OTP' -> 'VERIFY_OTP' -> 'SET_PASSWORD' -> 'SUCCESS'
  const [forgotStep, setForgotStep] = useState('REQUEST_OTP');
  const [maskedPhone, setMaskedPhone] = useState('+91 98117 •••61');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [devOtpHint, setDevOtpHint] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);

  const otpInputsRef = useRef([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Load auth info on mount
  useEffect(() => {
    api.get('/auth/info')
      .then(res => {
        if (res.data?.maskedPhone) {
          setMaskedPhone(res.data.maskedPhone);
        }
      })
      .catch(() => {});
  }, []);

  // Resend countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle standard Admin Login
  const handleLoginSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', loginForm);
      login(data.token, { username: data.username });
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Request OTP for registered hardcoded phone number
  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { username: 'admin' });
      if (data.maskedPhone) setMaskedPhone(data.maskedPhone);
      if (data.devOtp) setDevOtpHint(data.devOtp);
      toast.success(data.message || 'OTP dispatched to registered admin mobile!');
      setForgotStep('VERIFY_OTP');
      setCountdown(60);
      // Focus first OTP field
      setTimeout(() => otpInputsRef.current[0]?.focus(), 150);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // OTP segment input handling
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value.slice(-1);
    setOtpDigits(newOtp);

    // Auto-advance
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = e => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || '';
    }
    setOtpDigits(newOtp);
    const nextIdx = Math.min(pasted.length, 5);
    otpInputsRef.current[nextIdx]?.focus();
  };

  const fullOtp = otpDigits.join('');

  // Step 2: Verify OTP
  const handleVerifyOtp = async e => {
    e?.preventDefault();
    if (fullOtp.length !== 6) {
      toast.error('Please enter all 6 digits of the OTP');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { otp: fullOtp });
      setResetToken(data.resetToken);
      toast.success('OTP verified successfully!');
      setForgotStep('SET_PASSWORD');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async e => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', {
        resetToken,
        otp: fullOtp,
        newPassword,
      });
      toast.success(data.message || 'Password reset successfully!');
      setForgotStep('SUCCESS');
      // Pre-fill login password with the newly set password
      setLoginForm(prev => ({ ...prev, password: newPassword }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Calculate password strength
  const getPasswordStrength = pw => {
    if (!pw) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score <= 3) return { score: 3, label: 'Good', color: 'bg-blue-500' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  };

  const pwStrength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#E3E1E9] flex items-center justify-center px-4 py-12 relative overflow-hidden selection:bg-[#F97316] selection:text-black">
      {/* Dynamic Background Cockpit Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#F97316]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#38BDF8]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181B26] border border-white/10 text-xs font-mono uppercase tracking-widest text-[#F97316] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-ping" />
            Saraswati Motors Ateliers
          </div>

          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2"
            style={{ fontFamily: 'Space Grotesk, Outfit, sans-serif' }}
          >
            {mode === 'login' ? 'Admin Gateway' : 'Security Recovery'}
          </h1>
          <p className="text-[#94A3B8] text-sm">
            {mode === 'login'
              ? 'Authorized Superbike Administration & Telemetry'
              : 'One-Time Password (OTP) verification protocol'}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#12141C]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-7 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Top Amber Chamfer Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F97316] to-transparent" />

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#090A0F] rounded-xl p-1 mb-6 border border-white/5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setForgotStep('REQUEST_OTP');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-[#F97316] text-[#090A0F] shadow-md shadow-orange-500/20 font-bold'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('forgot');
                if (forgotStep === 'SUCCESS') setForgotStep('REQUEST_OTP');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'forgot'
                  ? 'bg-[#F97316] text-[#090A0F] shadow-md shadow-orange-500/20 font-bold'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Reset Password
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              /* ── LOGIN FORM ── */
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                onSubmit={handleLoginSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
                    Admin Username
                  </label>
                  <input
                    type="text"
                    required
                    value={loginForm.username}
                    onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
                    placeholder="admin"
                    className="w-full bg-[#181B26] border border-white/10 text-white placeholder-slate-500 px-4 py-3 rounded-xl focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-all text-sm font-sans"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] block">
                      Admin Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setForgotStep('REQUEST_OTP');
                      }}
                      className="text-xs text-[#F97316] hover:text-[#FB923C] transition-colors font-medium underline underline-offset-2"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      required
                      value={loginForm.password}
                      onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full bg-[#181B26] border border-white/10 text-white placeholder-slate-500 px-4 py-3 pr-12 rounded-xl focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-all text-sm font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA6C10] disabled:opacity-50 text-[#090A0F] font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 text-sm cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#090A0F] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock size={16} />
                      Authenticate to Dashboard
                    </>
                  )}
                </button>

                {/* Default Credentials Notice */}
                <div className="pt-2 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#090A0F] border border-white/5 text-[11px] font-mono text-[#94A3B8]">
                    <span>Default:</span>
                    <span className="text-white font-bold">admin</span>
                    <span>/</span>
                    <span className="text-[#F97316] font-bold">admin@123$</span>
                  </div>
                </div>
              </motion.form>
            ) : (
              /* ── FORGOT PASSWORD / OTP RECOVERY ── */
              <motion.div
                key="forgot-password-flow"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-5"
              >
                {/* STEP 1: REQUEST OTP */}
                {forgotStep === 'REQUEST_OTP' && (
                  <div className="space-y-5 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center mx-auto text-[#F97316]">
                      <Smartphone size={26} />
                    </div>

                    <div>
                      <h3
                        className="text-lg font-bold text-white mb-1"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        Reset via Authorized Phone
                      </h3>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        A single-use 6-digit OTP will be dispatched to the verified admin number registered on file.
                      </p>
                    </div>

                    <div className="bg-[#181B26] border border-white/10 rounded-xl p-3.5 flex items-center justify-between text-left">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          Verified Destination Number
                        </div>
                        <div className="text-sm font-mono font-bold text-white tracking-wider">
                          {maskedPhone}
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck size={12} /> Hardcoded
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleRequestOtp}
                      className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA6C10] disabled:opacity-50 text-[#090A0F] font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/25 text-sm cursor-pointer"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-[#090A0F] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <KeyRound size={16} />
                          Dispatch 6-Digit OTP
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors"
                    >
                      <ArrowLeft size={14} /> Back to Sign In
                    </button>
                  </div>
                )}

                {/* STEP 2: VERIFY OTP DIGITS */}
                {forgotStep === 'VERIFY_OTP' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center mx-auto text-[#38BDF8] mb-2">
                        <KeyRound size={22} />
                      </div>
                      <h3
                        className="text-base font-bold text-white"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        Enter 6-Digit Verification Code
                      </h3>
                      <p className="text-xs text-[#94A3B8] mt-0.5">
                        Sent to <span className="font-mono text-white">{maskedPhone}</span>
                      </p>
                    </div>

                    {/* Segmented OTP 6-Box Input */}
                    <div className="flex items-center justify-center gap-2" onPaste={handleOtpPaste}>
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={el => (otpInputsRef.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(idx, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(idx, e)}
                          className="w-11 h-13 text-center text-xl font-mono font-bold bg-[#181B26] border border-white/15 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] text-white rounded-xl outline-none transition-all shadow-inner"
                        />
                      ))}
                    </div>

                    {/* Dev OTP Quick-Fill helper if present in development */}
                    {devOtpHint && (
                      <div className="bg-[#090A0F] border border-amber-500/30 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono text-amber-300">
                        <span>Dev OTP: <strong className="text-white tracking-widest">{devOtpHint}</strong></span>
                        <button
                          type="button"
                          onClick={() => {
                            const chars = devOtpHint.split('');
                            setOtpDigits(chars);
                            toast.success('Dev OTP auto-filled');
                          }}
                          className="text-[11px] underline text-[#F97316] hover:text-[#FB923C]"
                        >
                          Auto-fill
                        </button>
                      </div>
                    )}

                    {/* Resend Timer & Action */}
                    <div className="flex items-center justify-between text-xs font-mono pt-1">
                      <span className="text-[#94A3B8]">
                        {countdown > 0 ? `Resend in ${countdown}s` : 'Did not receive code?'}
                      </span>
                      <button
                        type="button"
                        disabled={countdown > 0 || loading}
                        onClick={handleRequestOtp}
                        className="text-[#F97316] hover:text-[#FB923C] disabled:text-slate-600 transition-colors flex items-center gap-1 font-bold"
                      >
                        <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Resend OTP
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || fullOtp.length !== 6}
                      className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA6C10] disabled:opacity-50 text-[#090A0F] font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/25 text-sm cursor-pointer"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-[#090A0F] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Verify Code & Continue'
                      )}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setForgotStep('REQUEST_OTP')}
                        className="text-xs text-[#94A3B8] hover:text-white transition-colors inline-flex items-center gap-1"
                      >
                        <ArrowLeft size={13} /> Change Phone Number
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: SET NEW PASSWORD */}
                {forgotStep === 'SET_PASSWORD' && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 mb-2">
                        <ShieldCheck size={22} />
                      </div>
                      <h3
                        className="text-base font-bold text-white"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        Set New Admin Password
                      </h3>
                      <p className="text-xs text-[#94A3B8]">
                        OTP verified for <span className="font-mono text-white">admin</span>. Choose a strong new password.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPw ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full bg-[#181B26] border border-white/10 text-white placeholder-slate-500 px-4 py-2.5 pr-12 rounded-xl focus:outline-none focus:border-[#F97316] text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw(!showNewPw)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>

                      {/* Password strength visual meter */}
                      {newPassword && (
                        <div className="mt-2 space-y-1">
                          <div className="flex gap-1 h-1.5">
                            {[1, 2, 3, 4].map(step => (
                              <div
                                key={step}
                                className={`flex-1 rounded-full transition-all ${
                                  pwStrength.score >= step ? pwStrength.color : 'bg-slate-800'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
                            <span>Strength: <strong className="text-white">{pwStrength.label}</strong></span>
                            <span>Min 6 chars</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
                        Confirm New Password
                      </label>
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-[#181B26] border border-white/10 text-white placeholder-slate-500 px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#F97316] text-sm"
                      />
                    </div>

                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-rose-400 flex items-center gap-1">
                        <ShieldAlert size={13} /> Passwords do not match
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
                      className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA6C10] disabled:opacity-50 text-[#090A0F] font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/25 text-sm cursor-pointer mt-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-[#090A0F] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Save New Password'
                      )}
                    </button>
                  </form>
                )}

                {/* STEP 4: SUCCESS STATE */}
                {forgotStep === 'SUCCESS' && (
                  <div className="space-y-5 text-center py-2">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                      <CheckCircle2 size={36} />
                    </div>

                    <div>
                      <h3
                        className="text-lg font-bold text-white mb-1"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        Password Changed Successfully!
                      </h3>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        Your admin credentials have been updated securely. You can now log into your dashboard using your new password.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setForgotStep('REQUEST_OTP');
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA6C10] text-[#090A0F] font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/25 text-sm cursor-pointer"
                    >
                      <Sparkles size={16} /> Proceed to Sign In
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs font-mono text-[#94A3B8] hover:text-[#F97316] transition-colors inline-flex items-center gap-1.5"
          >
            ← Back to Saraswati Superbikes Showroom
          </a>
        </div>
      </motion.div>
    </div>
  );
}
