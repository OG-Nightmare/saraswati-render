import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, { username: data.username });
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#F97316]/10 flex items-center justify-center mx-auto mb-4 border border-[#F97316]/20">
            <Lock size={28} className="text-[#F97316]" />
          </div>
          <h1 className="text-3xl font-black text-[#1C1C1E] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Admin Login</h1>
          <p className="text-[#6B6965] text-sm">Saraswati Motors Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#E5E4E0] rounded-2xl p-8 space-y-5 shadow-sm">
          <div>
            <label className="text-[#6B6965] text-sm mb-1.5 block font-medium">Username</label>
            <input
              type="text" required
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="admin"
              className="w-full bg-[#F4F3F0] border border-[#E5E4E0] text-[#1C1C1E] placeholder-[#9C9A97] px-4 py-3 rounded-xl focus:outline-none focus:border-[#F97316] transition-colors text-sm"
            />
          </div>
          <div>
            <label className="text-[#6B6965] text-sm mb-1.5 block font-medium">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'} required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full bg-[#F4F3F0] border border-[#E5E4E0] text-[#1C1C1E] placeholder-[#9C9A97] px-4 py-3 pr-12 rounded-xl focus:outline-none focus:border-[#F97316] transition-colors text-sm"
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6965] hover:text-[#1C1C1E]">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA6C10] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-orange-100">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Login to Dashboard'}
          </button>
        </form>
        <p className="text-center text-xs text-[#9C9A97] mt-4">Default credentials: admin / admin@123</p>
      </motion.div>
    </div>
  );
}
