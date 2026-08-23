import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Bike, MessageSquare, Star, LogOut, X, Upload, CheckCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import BikeLoader from '../components/BikeLoader';

// ── Vehicle Form Modal ─────────────────────────────────────────────────────────
function VehicleModal({ vehicle, onClose, onSaved }) {
  const isEdit = !!vehicle;
  const [form, setForm] = useState({
    title: vehicle?.title || '',
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    type: vehicle?.type || 'bike',
    category: vehicle?.category || 'city',
    year: vehicle?.year || new Date().getFullYear(),
    price: vehicle?.price || '',
    fuelType: vehicle?.fuelType || 'Petrol',
    transmission: vehicle?.transmission || 'Manual',
    ownership: vehicle?.ownership || 1,
    kilometers: vehicle?.kilometers || '',
    description: vehicle?.description || '',
    features: vehicle?.features || '',
    sellerNotes: vehicle?.sellerNotes || '',
    registrationState: vehicle?.registrationState || 'Delhi',
    insuranceStatus: vehicle?.insuranceStatus || 'Active',
    status: vehicle?.status || 'available',
    featured: vehicle?.featured || false,
    power: vehicle?.power || '',
    acceleration: vehicle?.acceleration || '',
    topSpeed: vehicle?.topSpeed || '',
    displacement: vehicle?.displacement || '',
    torque: vehicle?.torque || '',
    weight: vehicle?.weight || '',
  });
  const [files, setFiles] = useState([]);                           // new files to upload
  const [keepImages, setKeepImages] = useState(vehicle?.images || []); // existing images to keep
  const [thumbnail, setThumbnail] = useState(vehicle?.images?.[0]?.url || (vehicle?.images?.[0] && typeof vehicle.images[0] === 'object' ? vehicle.images[0].url : vehicle?.images?.[0]) || 'new-0');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const removeExistingImage = (imgObj) => {
    const imgUrl = typeof imgObj === 'object' ? imgObj.url : imgObj;
    setKeepImages(prev => {
      const updated = prev.filter(p => (typeof p === 'object' ? p.url : p) !== imgUrl);
      if (thumbnail === imgUrl) {
        if (updated.length > 0) {
          const first = updated[0];
          setThumbnail(typeof first === 'object' ? first.url : first);
        }
        else if (files.length > 0) setThumbnail('new-0');
        else setThumbnail(null);
      }
      return updated;
    });
  };

  const removeNewFile = (idx) => {
    setFiles(prev => {
      const updated = prev.filter((_, i) => i !== idx);
      if (thumbnail === `new-${idx}`) {
        if (keepImages.length > 0) setThumbnail(keepImages[0]);
        else if (updated.length > 0) setThumbnail('new-0');
        else setThumbnail(null);
      } else if (thumbnail && thumbnail.startsWith('new-')) {
        const tIdx = parseInt(thumbnail.split('-')[1]);
        if (tIdx > idx) {
          setThumbnail(`new-${tIdx - 1}`);
        }
      }
      return updated;
    });
  };

  // Derive valid thumbnail
  const getFirstUrl = () => {
    if (keepImages.length > 0) {
      const item = keepImages[0];
      return typeof item === 'object' ? item.url : item;
    }
    return null;
  };

  let validThumbnail = thumbnail;
  if (thumbnail) {
    if (thumbnail.startsWith('new-')) {
      const idx = parseInt(thumbnail.split('-')[1]);
      if (isNaN(idx) || idx >= files.length) {
        validThumbnail = getFirstUrl() || (files.length > 0 ? 'new-0' : null);
      }
    } else if (!keepImages.some(p => (typeof p === 'object' ? p.url : p) === thumbnail)) {
      validThumbnail = getFirstUrl() || (files.length > 0 ? 'new-0' : null);
    }
  } else {
    validThumbnail = getFirstUrl() || (files.length > 0 ? 'new-0' : null);
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      const data = {
        ...form,
        features: typeof form.features === 'string' ? form.features.split(',').map(s => s.trim()).filter(Boolean) : form.features,
        keepImages, // tell server which existing images to keep
        thumbnail: validThumbnail,
      };
      fd.append('data', JSON.stringify(data));
      files.forEach(f => fd.append('images', f));

      if (isEdit) await api.put(`/vehicles/${vehicle._id}`, fd);
      else await api.post('/vehicles', fd);

      toast.success(isEdit ? 'Vehicle updated!' : 'Vehicle added!');
      onClose();
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full bg-[#0B0B0B] border border-[#2A2A2A] text-white placeholder-[#BDBDBD] px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#FF6B00] transition-colors text-sm';

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0B0B]/90 flex items-start justify-center overflow-y-auto py-10 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[#2A2A2A]">
          <h2 className="text-xl font-black text-white">{isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
          <button onClick={onClose} className="text-[#BDBDBD] hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[#BDBDBD] text-xs mb-1 block">Title *</label>
              <input className={inputCls} required value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Yamaha R15 V4" />
            </div>
            <div>
              <label className="text-[#BDBDBD] text-xs mb-1 block">Brand *</label>
              <input className={inputCls} required value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Yamaha" />
            </div>
            <div>
              <label className="text-[#BDBDBD] text-xs mb-1 block">Model *</label>
              <input className={inputCls} required value={form.model} onChange={e => set('model', e.target.value)} placeholder="R15 V4" />
            </div>
            {/* Category — bike-only, no cars */}
            <div>
              <label className="text-[#BDBDBD] text-xs mb-1 block">Category</label>
              <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="city">🛵 City Bike</option>
                <option value="superbike">🏍️ Superbike</option>
              </select>
            </div>
            <div>
              <label className="text-[#BDBDBD] text-xs mb-1 block">Year</label>
              <input className={inputCls} type="number" value={form.year} onChange={e => set('year', +e.target.value)} />
            </div>
            <div>
              <label className="text-[#BDBDBD] text-xs mb-1 block">Price (₹) *</label>
              <input className={inputCls} required type="number" value={form.price} onChange={e => set('price', +e.target.value)} placeholder="150000" />
            </div>
            <div>
              <label className="text-[#BDBDBD] text-xs mb-1 block">KM Driven</label>
              <input className={inputCls} type="number" value={form.kilometers} onChange={e => set('kilometers', +e.target.value)} placeholder="15000" />
            </div>
            <div>
              <label className="text-[#BDBDBD] text-xs mb-1 block">Fuel Type</label>
              <select className={inputCls} value={form.fuelType} onChange={e => set('fuelType', e.target.value)}>
                {['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[#BDBDBD] text-xs mb-1 block">Transmission</label>
              <select className={inputCls} value={form.transmission} onChange={e => set('transmission', e.target.value)}>
                <option>Manual</option><option>Automatic</option>
              </select>
            </div>
            <div>
              <label className="text-[#BDBDBD] text-xs mb-1 block">Ownership</label>
              <input className={inputCls} type="number" min="1" max="5" value={form.ownership} onChange={e => set('ownership', +e.target.value)} />
            </div>
            <div>
              <label className="text-[#BDBDBD] text-xs mb-1 block">Status</label>
              <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-[#FF6B00] w-4 h-4" />
              <label htmlFor="featured" className="text-[#BDBDBD] text-sm font-semibold">Mark as Featured (Hero Showcase)</label>
            </div>

            {/* ── Featured Vehicle Specs (Visible only when 'Mark as Featured' is checked) ── */}
            {form.featured && (
              <div className="col-span-2 bg-[#1A1A1A] border border-[#FF6B00]/40 rounded-2xl p-4 space-y-3 shadow-inner">
                <div className="flex items-center gap-2 text-[#FF6B00] font-black text-xs uppercase tracking-wider">
                  <Zap size={15} /> Featured Superbike Telemetry & Performance Specs
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[#BDBDBD] text-xs mb-1 block font-medium">Max Power</label>
                    <input className={inputCls} value={form.power} onChange={e => set('power', e.target.value)} placeholder="e.g. 207 HP" />
                  </div>
                  <div>
                    <label className="text-[#BDBDBD] text-xs mb-1 block font-medium">0-100 km/h</label>
                    <input className={inputCls} value={form.acceleration} onChange={e => set('acceleration', e.target.value)} placeholder="e.g. 2.9s" />
                  </div>
                  <div>
                    <label className="text-[#BDBDBD] text-xs mb-1 block font-medium">Top Speed</label>
                    <input className={inputCls} value={form.topSpeed} onChange={e => set('topSpeed', e.target.value)} placeholder="e.g. 303 km/h" />
                  </div>
                  <div>
                    <label className="text-[#BDBDBD] text-xs mb-1 block font-medium">Engine / Displacement</label>
                    <input className={inputCls} value={form.displacement} onChange={e => set('displacement', e.target.value)} placeholder="e.g. 999cc Inline-4" />
                  </div>
                  <div>
                    <label className="text-[#BDBDBD] text-xs mb-1 block font-medium">Max Torque</label>
                    <input className={inputCls} value={form.torque} onChange={e => set('torque', e.target.value)} placeholder="e.g. 113 Nm @ 11,000 RPM" />
                  </div>
                  <div>
                    <label className="text-[#BDBDBD] text-xs mb-1 block font-medium">Kerb Weight</label>
                    <input className={inputCls} value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="e.g. 193 kg" />
                  </div>
                </div>
              </div>
            )}
            <div className="col-span-2">
              <label className="text-[#BDBDBD] text-xs mb-1 block">Features (comma separated)</label>
              <input className={inputCls} value={Array.isArray(form.features) ? form.features.join(', ') : form.features} onChange={e => set('features', e.target.value)} placeholder="ABS, LED Lights, TFT Display" />
            </div>
            <div className="col-span-2">
              <label className="text-[#BDBDBD] text-xs mb-1 block">Description</label>
              <textarea className={inputCls} rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Vehicle description..." />
            </div>

            {/* ── Existing Images (edit mode) ── */}
            {isEdit && vehicle?.images?.length > 0 && (
              <div className="col-span-2">
                <label className="text-[#BDBDBD] text-xs mb-2 block">Current Images — click ★ to make primary thumbnail, ✕ to remove</label>
                <div className="grid grid-cols-4 gap-3">
                  {keepImages.map((img, i) => {
                    const imgUrl = typeof img === 'object' ? img.url : img;
                    return (
                      <div key={i} className={`relative group rounded-xl overflow-hidden aspect-square bg-[#1A1A1A] border-2 transition-all ${thumbnail === imgUrl ? 'border-[#FF6B00]' : 'border-transparent'
                        }`}>
                        <img
                          src={imgUrl}
                          alt={`img-${i}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(img)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold shadow"
                          title="Remove Image"
                        >
                          ✕
                        </button>
                        <button
                          type="button"
                          onClick={() => setThumbnail(imgUrl)}
                          className={`absolute bottom-1 left-1 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${thumbnail === imgUrl
                              ? 'bg-[#FF6B00] text-white shadow-md'
                              : 'bg-black/60 text-[#BDBDBD] hover:text-white hover:bg-black/90'
                            }`}
                          title="Set as Thumbnail"
                        >
                          ★
                        </button>
                      </div>
                    );
                  })}
                </div>
                {keepImages.length === 0 && (
                  <p className="text-[#BDBDBD] text-xs mt-1">All existing images removed — add new ones below</p>
                )}
              </div>
            )}

            {/* ── Add New Images ── */}
            <div className="col-span-2">
              <label className="text-[#BDBDBD] text-xs mb-1 block">
                {isEdit ? 'Add More Images' : 'Upload Images'}
              </label>
              <label className="flex items-center gap-2 border border-dashed border-[#2A2A2A] rounded-xl p-4 cursor-pointer hover:border-[#FF6B00]/50 transition-colors">
                <Upload size={16} className="text-[#FF6B00]" />
                <span className="text-[#BDBDBD] text-sm">
                  {files.length ? `${files.length} new file(s) selected` : 'Click to select images (multiple allowed)'}
                </span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={e => setFiles(Array.from(e.target.files))} />
              </label>
              {/* New file previews */}
              {files.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-2">
                  {files.map((f, i) => (
                    <div key={i} className={`relative group rounded-xl overflow-hidden aspect-square bg-[#1A1A1A] border-2 transition-all ${thumbnail === `new-${i}` ? 'border-[#FF6B00]' : 'border-transparent'
                      }`}>
                      <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewFile(i)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold shadow"
                        title="Remove Image"
                      >✕</button>
                      <button
                        type="button"
                        onClick={() => setThumbnail(`new-${i}`)}
                        className={`absolute bottom-1 left-1 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${thumbnail === `new-${i}`
                            ? 'bg-[#FF6B00] text-white shadow-md'
                            : 'bg-black/60 text-[#BDBDBD] hover:text-white hover:bg-black/90'
                          }`}
                        title="Set as Thumbnail"
                      >
                        ★
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-[#2A2A2A] text-[#BDBDBD] py-2.5 rounded-xl hover:text-white transition-colors text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-[#FF6B00] hover:bg-[#FF8A33] disabled:opacity-60 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
              {loading ? '...' : isEdit ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('vehicles');
  const [vehicles, setVehicles] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [sellRequests, setSellRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [newEnquiries, setNewEnquiries] = useState(0);
  const [newSellReqs, setNewSellReqs] = useState(0);
  const lastContactCount = useRef(null);
  const lastSellCount = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const load = useCallback(async () => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 2500); // 2.5s fallback safety limit
    try {
      const [vRes, cRes, tRes, sRes] = await Promise.allSettled([
        api.get('/vehicles?limit=100'),
        api.get('/contact'),
        api.get('/testimonials/all'),
        api.get('/sell-requests'),
      ]);

      const vData = vRes.status === 'fulfilled' ? vRes.value.data : [];
      const cData = cRes.status === 'fulfilled' ? cRes.value.data : [];
      const tData = tRes.status === 'fulfilled' ? tRes.value.data : [];
      const sData = sRes.status === 'fulfilled' ? sRes.value.data : [];

      const v = Array.isArray(vData?.vehicles) ? vData.vehicles : (Array.isArray(vData) ? vData : []);
      const c = Array.isArray(cData) ? cData : [];
      const t = Array.isArray(tData) ? tData : [];
      const s = Array.isArray(sData) ? sData : [];

      setVehicles(v);
      setContacts(c);
      if (c.length) lastContactCount.current = c.length;
      setTestimonials(t);
      setSellRequests(s);
      if (s.length) lastSellCount.current = s.length;
    } catch {
      toast.error('Failed to load data');
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  }, []);

  // Silent poll for all data tables — runs every 10 seconds
  const pollAllData = useCallback(async () => {
    try {
      const [v, c, t, s] = await Promise.all([
        api.get('/vehicles?limit=100').then(r => Array.isArray(r.data?.vehicles) ? r.data.vehicles : (Array.isArray(r.data) ? r.data : [])).catch(() => null),
        api.get('/contact').then(r => Array.isArray(r.data) ? r.data : []).catch(() => null),
        api.get('/testimonials/all').then(r => Array.isArray(r.data) ? r.data : []).catch(() => null),
        api.get('/sell-requests').then(r => Array.isArray(r.data) ? r.data : []).catch(() => null),
      ]);

      if (Array.isArray(v)) setVehicles(v);
      if (Array.isArray(t)) setTestimonials(t);

      if (Array.isArray(c)) {
        const prev = lastContactCount.current;
        if (prev !== null && c.length > prev) {
          const diff = c.length - prev;
          setNewEnquiries(n => n + diff);
          toast(`📩 ${diff} new enquir${diff > 1 ? 'ies' : 'y'} received!`,
            { duration: 7000, style: { background: '#FF6B00', color: '#fff', fontWeight: 700, borderRadius: '12px' } });
        }
        lastContactCount.current = c.length;
        setContacts(c);
      }

      if (Array.isArray(s)) {
        const prevS = lastSellCount.current;
        if (prevS !== null && s.length > prevS) {
          const diff = s.length - prevS;
          setNewSellReqs(n => n + diff);
          toast(`🏍️ ${diff} new sell request${diff > 1 ? 's' : ''}!`,
            { duration: 7000, style: { background: '#7C3AED', color: '#fff', fontWeight: 700, borderRadius: '12px' } });
        }
        lastSellCount.current = s.length;
        setSellRequests(s);
      }
    } catch {
      // silent on poll failure
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      await load();
    };
    if (isMounted) fetchInitial();
    return () => { isMounted = false; };
  }, [load]);

  // Start polling after initial load
  useEffect(() => {
    const interval = setInterval(pollAllData, 10000); // every 10 s
    return () => clearInterval(interval);            // cleanup on unmount
  }, [pollAllData]);


  const deleteVehicle = async id => {
    if (!confirm('Delete this vehicle?')) return;
    setVehicles(prev => prev.filter(v => v._id !== id)); // optimistic update
    try {
      await api.post(`/vehicles/${id}/delete`);
      toast.success('Deleted');
      load(); // sync with server
    } catch {
      toast.error('Failed to delete'); load(); // revert on error
    }
  };

  const deleteContact = async id => {
    if (!confirm('Delete this inquiry?')) return;
    setContacts(prev => prev.filter(c => c._id !== id)); // optimistic update
    try {
      await api.post(`/contact/${id}/delete`);
      toast.success('Deleted');
      load(); // sync with server
    } catch {
      toast.error('Failed to delete'); load(); // revert on error
    }
  };

  const deleteSellRequest = async id => {
    if (!confirm('Delete this sell request?')) return;
    setSellRequests(prev => prev.filter(r => r._id !== id));
    try {
      await api.post(`/sell-requests/${id}/delete`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed to delete'); load();
    }
  };

  const markSellRequestStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/sell-requests/${id}/status`, { status });
      setSellRequests(prev => prev.map(r => r._id === id ? data : r));
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const safeVehicles = Array.isArray(vehicles) ? vehicles : [];
  const safeContacts = Array.isArray(contacts) ? contacts : [];
  const safeTestimonials = Array.isArray(testimonials) ? testimonials : [];
  const safeSellRequests = Array.isArray(sellRequests) ? sellRequests : [];

  const stats = [
    { label: 'Total Bikes', value: safeVehicles.length, icon: Bike, color: 'text-blue-400' },
    { label: 'Available', value: safeVehicles.filter(v => v && v.status === 'available').length, icon: CheckCircle, color: 'text-[#22C55E]' },
    { label: 'Inquiries', value: safeContacts.length, icon: MessageSquare, color: 'text-[#FF6B00]' },
    { label: 'Sell Requests', value: safeSellRequests.length, icon: Star, color: 'text-purple-400' },
  ];

  if (loading && safeVehicles.length === 0) {
    return <BikeLoader fullScreen={true} dark={true} message="Accessing Saraswati Admin Console..." />;
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B]">
      {/* Admin Header */}
      <div className="bg-[#141414] border-b border-[#2A2A2A] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Admin Dashboard</h1>
          <p className="text-[#BDBDBD] text-xs">Welcome, {admin?.username}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-[#BDBDBD] hover:text-red-400 transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#BDBDBD] text-xs">{s.label}</span>
                <s.icon size={16} className={s.color} />
              </div>
              <div className="text-3xl font-black text-white">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 mb-6 border-b border-[#2A2A2A] pb-0 overflow-x-auto">
          {[
            ['vehicles', 'Vehicles', Bike, null],
            ['contacts', 'Inquiries', MessageSquare, newEnquiries],
            ['sell', 'Sell Requests', Star, newSellReqs],
            ['testimonials', 'Reviews', Star, null],
          ].map(([key, label, Icon, badge]) => (
            <button key={key}
              onClick={() => { setTab(key); if (key === 'contacts') setNewEnquiries(0); if (key === 'sell') setNewSellReqs(0); }}
              className={`relative flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px whitespace-nowrap ${tab === key ? 'border-[#FF6B00] text-[#FF6B00]' : 'border-transparent text-[#BDBDBD] hover:text-white'
                }`}>
              <Icon size={15} />{label}
              {badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF6B00] text-white text-[10px] font-black flex items-center justify-center animate-bounce">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <BikeLoader fullScreen={false} dark={true} message="Refreshing console records..." />
          </div>
        ) : (
          <>
            {/* Vehicles Tab */}
            {tab === 'vehicles' && (
              <div>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-white font-bold">All Vehicles ({safeVehicles.length})</h2>
                  <button onClick={() => setModal('add')}
                    className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#FF8A33] text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                    <Plus size={16} /> Add Vehicle
                  </button>
                </div>
                <div className="space-y-3">
                  {safeVehicles.map(v => {
                    const firstImg = v.images?.[0];
                    const src = (firstImg && typeof firstImg === 'object' ? firstImg.url : firstImg) || 'https://via.placeholder.com/64';
                    return (
                      <div key={v._id} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4 flex items-center gap-4">
                        <img src={src} alt={v.title}
                          className="w-16 h-12 rounded-xl object-cover flex-shrink-0 bg-[#1A1A1A]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate">{v.title}</p>
                          <p className="text-[#BDBDBD] text-xs">{v.year} • {v.kilometers?.toLocaleString()} km • ₹{v.price?.toLocaleString()}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${v.status === 'available' ? 'bg-[#22C55E]/10 text-[#22C55E]'
                            : v.status === 'sold' ? 'bg-red-500/10 text-red-400'
                              : 'bg-yellow-500/10 text-yellow-400'
                          }`}>{v.status}</span>
                        <div className="flex gap-2 flex-shrink-0">
                          <a href={`/inventory/${v._id}`} target="_blank" rel="noreferrer"
                            className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-[#BDBDBD] hover:text-white transition-colors">
                            <Eye size={14} />
                          </a>
                          <button onClick={() => setModal(v)}
                            className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-[#BDBDBD] hover:text-[#FF6B00] transition-colors">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => deleteVehicle(v._id)}
                            className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-[#BDBDBD] hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {safeVehicles.length === 0 && (
                    <div className="text-center py-16 text-[#BDBDBD]">
                      <Bike size={48} className="mx-auto mb-3 opacity-30" />
                      <p>No vehicles yet. Add your first one!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contacts Tab */}
            {tab === 'contacts' && (
              <div>
                <h2 className="text-white font-bold mb-5">Inquiries ({safeContacts.length})</h2>
                <div className="space-y-3">
                  {safeContacts.map(c => (
                    <div key={c._id} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="text-white font-semibold">{c.name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'new' ? 'bg-[#FF6B00]/10 text-[#FF6B00]' : 'bg-[#22C55E]/10 text-[#22C55E]'}`}>
                              {c.status}
                            </span>
                          </div>
                          <p className="text-[#BDBDBD] text-sm mb-1">📞 {c.phone} {c.email && `• ✉️ ${c.email}`}</p>
                          {c.vehicleInterested && <p className="text-[#BDBDBD] text-sm mb-1">🏍️ {c.vehicleInterested}</p>}
                          <p className="text-[#BDBDBD] text-sm">{c.message}</p>
                          <p className="text-[#BDBDBD] text-xs mt-2">{new Date(c.createdAt).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <a href={`tel:${c.phone}`} className="text-xs bg-[#FF6B00]/10 text-[#FF6B00] px-3 py-1.5 rounded-xl hover:bg-[#FF6B00] hover:text-white transition-all">Call</a>
                          <button onClick={() => deleteContact(c._id)} className="text-xs text-red-400 hover:text-red-300 px-2">✕</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {safeContacts.length === 0 && (
                    <div className="text-center py-16 text-[#BDBDBD]">
                      <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
                      <p>No inquiries yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Testimonials Tab */}
            {tab === 'testimonials' && (
              <div>
                <h2 className="text-white font-bold mb-5">Customer Reviews ({safeTestimonials.length})</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {safeTestimonials.map(t => (
                    <div key={t._id} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
                      <div className="flex gap-1 mb-2">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} size={12} className="text-[#FF6B00] fill-[#FF6B00]" />
                        ))}
                      </div>
                      <p className="text-[#BDBDBD] text-sm mb-3 line-clamp-3">"{t.review}"</p>
                      <p className="text-white text-sm font-semibold">{t.name}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${t.isActive ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-red-500/10 text-red-400'}`}>
                          {t.isActive ? 'Active' : 'Hidden'}
                        </span>
                        <button
                          onClick={async () => { await api.put(`/testimonials/${t._id}`, { isActive: !t.isActive }); load(); }}
                          className="text-[#BDBDBD] text-xs hover:text-white border border-[#2A2A2A] px-2 py-1 rounded-lg"
                        >
                          Toggle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Sell Requests Tab */}
            {tab === 'sell' && (
              <div>
                <h2 className="text-white font-bold mb-5">Bike Sell Requests ({safeSellRequests.length})</h2>
                <div className="space-y-4">
                  {safeSellRequests.map(sr => (
                    <div key={sr._id} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col md:flex-row gap-5">
                      {/* Left: Bike Image (if uploaded) */}
                      {sr.image ? (
                        <div className="w-full md:w-44 h-32 rounded-xl overflow-hidden bg-[#1A1A1A] flex-shrink-0 border border-[#2A2A2A]">
                          <img
                            src={typeof sr.image === 'object' ? sr.image.url : (sr.image.startsWith('http') ? sr.image : `${api.defaults.baseURL || ''}${sr.image}`)}
                            alt={`${sr.brand} ${sr.model}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full md:w-44 h-32 rounded-xl bg-[#1A1A1A] flex items-center justify-center flex-shrink-0 border border-[#2A2A2A] text-[#BDBDBD] text-xs">
                          No Photo Uploaded
                        </div>
                      )}

                      {/* Middle: Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-white font-black text-lg">
                            {sr.brand} {sr.model}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${sr.status === 'new' ? 'bg-red-500/10 text-red-400'
                              : sr.status === 'reviewed' ? 'bg-[#FF6B00]/10 text-[#FF6B00]'
                                : 'bg-green-500/10 text-[#22C55E]'
                            }`}>
                            {sr.status}
                          </span>
                        </div>

                        {/* Specs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-[#BDBDBD] text-xs font-semibold">
                          <div>📅 Year: <span className="text-white">{sr.year}</span></div>
                          <div>🛣️ KM: <span className="text-white">{sr.kilometers?.toLocaleString()} km</span></div>
                          <div>💰 Asking: <span className="text-white">{sr.askingPrice ? `₹${sr.askingPrice.toLocaleString()}` : 'N/A'}</span></div>
                          <div>📅 Date: <span className="text-white">{new Date(sr.createdAt).toLocaleDateString('en-IN')}</span></div>
                        </div>

                        {/* Contact details & description */}
                        <div className="bg-[#0B0B0B] border border-[#2A2A2A] rounded-xl p-3.5 space-y-2 mb-2 text-sm text-[#BDBDBD]">
                          <p><span className="text-[#FF6B00] font-bold">Seller:</span> {sr.name} (<span className="text-white select-all">{sr.phone}</span>)</p>
                          {sr.description && (
                            <p className="italic text-white/70">"{sr.description}"</p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex md:flex-col gap-3 justify-end items-end flex-shrink-0">
                        <select
                          value={sr.status}
                          onChange={(e) => markSellRequestStatus(sr._id, e.target.value)}
                          className="bg-[#0B0B0B] border border-[#2A2A2A] text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#FF6B00] font-semibold"
                        >
                          <option value="new">🆕 New</option>
                          <option value="reviewed">👀 Reviewed</option>
                          <option value="contacted">📞 Contacted</option>
                        </select>

                        <div className="flex gap-2 w-full md:w-auto">
                          <a
                            href={`tel:${sr.phone}`}
                            className="flex-1 text-center text-xs bg-[#FF6B00] hover:bg-[#FF8A33] text-white font-bold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                          >
                            Call Seller
                          </a>
                          <button
                            onClick={() => deleteSellRequest(sr._id)}
                            className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500 px-3 py-2.5 rounded-xl transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {safeSellRequests.length === 0 && (
                    <div className="text-center py-16 text-[#BDBDBD]">
                      <Star size={48} className="mx-auto mb-3 opacity-30" />
                      <p>No sell requests submitted yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Vehicle Modal */}
      {modal && (
        <VehicleModal
          vehicle={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}
