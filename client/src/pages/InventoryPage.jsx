import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import SEO from '../components/SEO';
import api from '../lib/api';

const BRANDS = ['All', 'Yamaha', 'KTM', 'Kawasaki', 'Honda', 'Royal Enfield', 'TVS', 'Bajaj', 'Suzuki', 'BMW', 'Ducati', 'Triumph', 'Harley-Davidson', 'Aprilia'];
const FUEL = ['All', 'Petrol', 'Electric'];
const TRANSMISSION = ['All', 'Manual', 'Automatic'];
const SUBCATEGORIES = ['All', 'sports', 'cruiser', 'adventure', 'naked', 'tourer', 'commuter', 'scooter'];
const SUBCATEGORY_LABELS = {
  sports: 'Sports',
  cruiser: 'Cruiser',
  adventure: 'Adventure',
  naked: 'Naked',
  tourer: 'Tourer',
  commuter: 'Commuter',
  scooter: 'Scooter',
};

function FilterChip({ label, active, onClick, color = 'default' }) {
  const colorMap = {
    default: active
      ? 'bg-[#F97316] border-[#F97316] text-white shadow-md shadow-orange-100'
      : 'bg-white border-[#E5E4E0] text-[#6B6965] hover:border-[#F97316]/40 hover:text-[#1C1C1E]',
    red: active
      ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-100'
      : 'bg-white border-[#E5E4E0] text-[#6B6965] hover:border-red-300 hover:text-red-600',
    blue: active
      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100'
      : 'bg-white border-[#E5E4E0] text-[#6B6965] hover:border-blue-300 hover:text-blue-600',
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${colorMap[color]}`}
    >
      {label}
    </button>
  );
}

export default function InventoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || '';

  const [vehicles, setVehicles] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    subcategory: '',
    brand: '',
    fuelType: '',
    transmission: '',
    minPrice: '',
    maxPrice: '',
    sort: 'name-asc',
    search: '',
  });

  const setFilter = (key, val) => {
    if (key === 'category') {
      setPage(1);
      if (val) setSearchParams({ category: val });
      else setSearchParams({});
    } else {
      setFilters(f => ({ ...f, [key]: val }));
      setPage(1);
    }
  };

  const clearFilters = () => {
    setFilters({
      subcategory: '',
      brand: '',
      fuelType: '',
      transmission: '',
      minPrice: '',
      maxPrice: '',
      sort: 'name-asc',
      search: '',
    });
    setPage(1);
    setSearchParams({});
  };

  useEffect(() => {
    let isCancelled = false;

    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const queryParams = {
          page,
          limit: 12,
          category: currentCategory,
          ...filters,
        };
        // Clean empty parameters
        Object.keys(queryParams).forEach(k => {
          if (!queryParams[k] && queryParams[k] !== 0) delete queryParams[k];
        });

        const { data } = await api.get('/vehicles', { params: queryParams });

        if (!isCancelled) {
          const vehicleList = Array.isArray(data?.vehicles) ? data.vehicles : (Array.isArray(data) ? data : []);
          setVehicles(vehicleList);
          setTotal(typeof data?.total === 'number' ? data.total : vehicleList.length);
          setPages(typeof data?.pages === 'number' ? data.pages : 1);
        }
      } catch (e) {
        console.error('Failed to fetch inventory:', e);
        if (!isCancelled) {
          setVehicles([]);
          setTotal(0);
          setPages(1);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchVehicles();

    return () => {
      isCancelled = true;
    };
  }, [
    currentCategory,
    filters.subcategory,
    filters.brand,
    filters.fuelType,
    filters.transmission,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    filters.search,
    page,
  ]);

  const hasActiveFilters = Boolean(
    currentCategory ||
    filters.subcategory ||
    filters.brand ||
    filters.fuelType ||
    filters.transmission ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.search
  );

  const dynamicTitle = filters.maxPrice && Number(filters.maxPrice) <= 500000
    ? `Cheap Superbikes in Delhi & Budget Sports Bikes Under 5 Lakhs | Saraswati Superbikes`
    : filters.brand
    ? `Best & Most Reliable Used ${filters.brand} Superbikes Delhi | Saraswati Superbikes`
    : filters.subcategory === 'sports'
    ? 'Cheap & Premium Second Hand Sports Bikes Delhi | Saraswati Superbikes'
    : currentCategory === 'superbike'
    ? 'Cheap & Verified Pre-Owned Superbikes in Delhi NCR | Karol Bagh Studio'
    : 'Cheap Superbikes in Delhi, Second Hand & Pre-Owned Bikes | Saraswati Superbikes';

  const dynamicDesc = `Explore Delhi NCR's best collection of cheap superbikes in Delhi, budget second hand sports bikes, and luxury pre-owned superbikes in Karol Bagh. 120-point dyno inspected with easy EMI & Pan-India transport.`;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24">
      <SEO
        title={dynamicTitle}
        description={dynamicDesc}
        keywords="cheap superbikes in delhi, cheap superbikes, affordable superbikes delhi, budget superbikes karol bagh, best second hand bikes, premium superbikes delhi, reliable used bikes karol bagh, best sports bikes delhi, racing bikes, how to get a bike in delhi, reliable bike dealer delhi"
        canonicalUrl="https://saraswatimotors.in/inventory"
      />
      {/* Page Header */}
      <div className="bg-[#111118] pt-10 pb-16 px-4 sm:px-6 mb-[-2rem]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#F97316] text-sm font-bold uppercase tracking-widest mb-3 block">Our Stock</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Browse Inventory
            </h1>
            <p className="text-white/50">{total} verified bikes available · Updated regularly</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {/* ── Category Tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[#E5E4E0] rounded-2xl p-3 mb-6 flex gap-2 flex-wrap shadow-sm"
        >
          <button
            onClick={() => setFilter('category', '')}
            className={`flex-1 min-w-[120px] py-3 px-5 rounded-xl font-bold text-sm transition-all ${
              !currentCategory
                ? 'bg-[#1C1C1E] text-white shadow-md'
                : 'text-[#6B6965] hover:bg-[#F4F3F0] hover:text-[#1C1C1E]'
            }`}
          >
            All Bikes
          </button>
          <button
            onClick={() => setFilter('category', 'superbike')}
            className={`flex-1 min-w-[120px] py-3 px-5 rounded-xl font-bold text-sm transition-all ${
              currentCategory === 'superbike'
                ? 'bg-[#FF5500] text-white shadow-md shadow-orange-500/20'
                : 'text-[#6B6965] hover:bg-orange-50 hover:text-[#FF5500]'
            }`}
          >
            Superbikes
          </button>
          <button
            onClick={() => setFilter('category', 'city')}
            className={`flex-1 min-w-[120px] py-3 px-5 rounded-xl font-bold text-sm transition-all ${
              currentCategory === 'city'
                ? 'bg-[#1C1C1E] text-white shadow-md'
                : 'text-[#6B6965] hover:bg-[#F4F3F0] hover:text-[#1C1C1E]'
            }`}
          >
            City & Street Bikes
          </button>
        </motion.div>

        {/* ── Search + Controls ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9C9A97]" />
            <input
              type="text"
              placeholder="Search by name, brand, model..."
              value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
              className="w-full bg-white border border-[#E5E4E0] text-[#1C1C1E] placeholder-[#9C9A97] pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#F97316] transition-colors shadow-sm"
            />
          </div>
          <select
            value={filters.sort}
            onChange={e => setFilter('sort', e.target.value)}
            className="bg-white border border-[#E5E4E0] text-[#1C1C1E] px-4 py-3 rounded-xl focus:outline-none focus:border-[#F97316] transition-colors min-w-[160px] shadow-sm"
          >
            <option value="name-asc">Alphabetical (A → Z)</option>
            <option value="name-desc">Alphabetical (Z → A)</option>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold text-sm transition-all shadow-sm ${
              showFilters || hasActiveFilters
                ? 'bg-[#F97316] border-[#F97316] text-white'
                : 'bg-white border-[#E5E4E0] text-[#1C1C1E] hover:border-[#F97316]/40'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-red-500 font-semibold px-3 py-3 hover:underline"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* ── Collapsible Filters Drawer ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-[#E5E4E0] rounded-2xl p-5 mb-6 shadow-sm overflow-hidden space-y-5"
            >
              {/* Brand Filter */}
              <div>
                <p className="text-[#1C1C1E] font-semibold text-sm mb-3">Brand</p>
                <div className="flex gap-2 flex-wrap">
                  {BRANDS.map(b => (
                    <FilterChip key={b} label={b} active={(b === 'All' && !filters.brand) || filters.brand === b} onClick={() => setFilter('brand', b === 'All' ? '' : b)} />
                  ))}
                </div>
              </div>

              {/* Subcategory */}
              <div>
                <p className="text-[#1C1C1E] font-semibold text-sm mb-3">Subcategory</p>
                <div className="flex gap-2 flex-wrap">
                  {SUBCATEGORIES.map(sc => (
                    <FilterChip key={sc} label={sc === 'All' ? 'All' : (SUBCATEGORY_LABELS[sc] || sc)} active={(sc === 'All' && !filters.subcategory) || filters.subcategory === sc} onClick={() => setFilter('subcategory', sc === 'All' ? '' : sc)} />
                  ))}
                </div>
              </div>

              {/* Fuel */}
              <div>
                <p className="text-[#1C1C1E] font-semibold text-sm mb-3">Fuel Type</p>
                <div className="flex gap-2 flex-wrap">
                  {FUEL.map(f => (
                    <FilterChip key={f} label={f} active={(f === 'All' && !filters.fuelType) || filters.fuelType === f} onClick={() => setFilter('fuelType', f === 'All' ? '' : f)} />
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div>
                <p className="text-[#1C1C1E] font-semibold text-sm mb-3">Transmission</p>
                <div className="flex gap-2 flex-wrap">
                  {TRANSMISSION.map(t => (
                    <FilterChip key={t} label={t} active={(t === 'All' && !filters.transmission) || filters.transmission === t} onClick={() => setFilter('transmission', t === 'All' ? '' : t)} />
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="text-[#1C1C1E] font-semibold text-sm mb-3">Price Range (₹)</p>
                <div className="flex gap-3">
                  <input
                    type="number" placeholder="Min"
                    value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)}
                    className="flex-1 bg-[#F4F3F0] border border-[#E5E4E0] text-[#1C1C1E] placeholder-[#9C9A97] px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#F97316] text-sm"
                  />
                  <input
                    type="number" placeholder="Max"
                    value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)}
                    className="flex-1 bg-[#F4F3F0] border border-[#E5E4E0] text-[#1C1C1E] placeholder-[#9C9A97] px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#F97316] text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Grid ── */}
        {(() => {
          const vehicleList = Array.isArray(vehicles) ? vehicles : [];
          if (loading) {
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-72 bg-[#E5E4E0] rounded-2xl animate-pulse" />
                ))}
              </div>
            );
          }
          if (vehicleList.length === 0) {
            return (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-[#1C1C1E] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>No bikes found</h3>
                <p className="text-[#6B6965] mb-6">Try adjusting your filters</p>
                <button onClick={clearFilters} className="bg-[#F97316] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#EA6C10]">
                  Clear Filters
                </button>
              </div>
            );
          }
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vehicleList.map((v, i) => <VehicleCard key={v._id} vehicle={v} index={i} />)}
            </div>
          );
        })()}

        {/* ── Pagination ── */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${
                  page === i + 1
                    ? 'bg-[#F97316] text-white shadow-md shadow-orange-100'
                    : 'bg-white border border-[#E5E4E0] text-[#6B6965] hover:text-[#1C1C1E] hover:border-[#F97316]/40'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
