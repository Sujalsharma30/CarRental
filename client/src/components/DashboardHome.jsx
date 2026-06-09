import React, { useMemo } from 'react';
import { Car, Users, DollarSign, Calendar, Clock, Bike, Truck, Zap } from 'lucide-react';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const fmtUSD = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

const isToday = (dateVal) => {
  if (!dateVal) return false;
  try {
    const d = new Date(dateVal);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  } catch { return false; }
};

// Stat Card Component
function StatCard({ icon, iconBg, label, value, change, changeType, changeSuffix }) {
  return (
    <div className="fo-stat-card">
      <div className="fo-stat-content">
        <p className="fo-stat-label">{label}</p>
        <h3 className="fo-stat-value">{value}</h3>
        {change && (
          <span className={`fo-stat-change ${changeType === 'up' ? 'positive' : changeType === 'down' ? 'negative' : ''}`}>
            {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : ''} {change} {changeSuffix || ''}
          </span>
        )}
      </div>
      <div className="fo-stat-icon" style={{ background: iconBg || '#f0f0ff' }}>
        {icon}
      </div>
    </div>
  );
}

// Revenue Chart (Simple SVG)
function RevenueChart() {
  const points = [
    { x: 40, y: 180 }, { x: 120, y: 150 }, { x: 200, y: 160 },
    { x: 280, y: 140 }, { x: 360, y: 130 }, { x: 440, y: 110 },
    { x: 520, y: 80 }, { x: 600, y: 60 },
  ];
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = `${pathD} L600,200 L40,200 Z`;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const yLabels = ['$50k', '$40k', '$30k', '$20k', '$10k'];

  return (
    <div className="fo-chart-card">
      <div className="fo-chart-header">
        <h3 className="fo-section-title">Revenue Trends</h3>
        <select className="fo-chart-select">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>Last 90 Days</option>
        </select>
      </div>
      <svg viewBox="0 0 640 220" className="fo-chart-svg">
        {/* Grid lines */}
        {[40, 80, 120, 160, 200].map((y, i) => (
          <g key={i}>
            <line x1="40" y1={y} x2="620" y2={y} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4"/>
            <text x="5" y={y + 4} fontSize="10" fill="#94a3b8">{yLabels[i]}</text>
          </g>
        ))}
        {/* Area gradient */}
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01"/>
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#areaGrad)"/>
        <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke="#6366f1" strokeWidth="2"/>
        ))}
        {/* X-axis labels */}
        {days.map((d, i) => (
          <text key={d} x={40 + i * 80 + 40} y="215" fontSize="11" fill="#94a3b8" textAnchor="middle">{d}</text>
        ))}
      </svg>
    </div>
  );
}

// Category Utilization
function CategoryUtilization({ vehicles }) {
  const catData = useMemo(() => {
    const cats = {};
    vehicles.forEach(v => {
      const cat = v.category || v.type || 'Other';
      if (!cats[cat]) cats[cat] = { total: 0, active: 0 };
      cats[cat].total++;
      if (v.status === 'Ongoing' || v.status === 'Reserved' || v.status === 'Booked') cats[cat].active++;
    });
    const colors = { Scooty: '#6366f1', Car: '#3b82f6', Bike: '#10b981', EV: '#f59e0b', Other: '#94a3b8' };
    return Object.entries(cats).map(([name, d]) => ({
      name, total: d.total, active: d.active,
      percent: d.total > 0 ? Math.round((d.active / d.total) * 100) : 0,
      color: colors[name] || '#6366f1'
    }));
  }, [vehicles]);

  return (
    <div className="fo-util-card">
      <h3 className="fo-section-title">Category Utilization</h3>
      <div className="fo-util-list">
        {catData.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '24px 0' }}>No vehicle categories found</p>
        ) : catData.map(cat => (
          <div key={cat.name} className="fo-util-item">
            <div className="fo-util-header">
              <span className="fo-util-name">{cat.name}</span>
              <span className="fo-util-percent" style={{ color: cat.color }}>{cat.percent}%</span>
            </div>
            <div className="fo-util-bar-track">
              <div className="fo-util-bar-fill" style={{ width: `${cat.percent}%`, background: cat.color }}/>
            </div>
            <span className="fo-util-sub">{cat.active}/{cat.total} active</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Recent Bookings Table
function RecentBookings({ bookings, setCurrentTab }) {
  const recentBookings = bookings.slice(0, 5);

  const displayBookings = recentBookings.length > 0 ? recentBookings : [];

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'active' || s === 'ongoing') return 'fo-badge-green';
    if (s === 'pending' || s === 'reserved') return 'fo-badge-orange';
    if (s === 'approved' || s === 'completed') return 'fo-badge-emerald';
    if (s === 'cancelled') return 'fo-badge-red';
    return 'fo-badge-blue';
  };

  return (
    <div className="fo-bookings-card">
      <div className="fo-bookings-header">
        <h3 className="fo-section-title">Recent Bookings</h3>
        <button className="fo-link-btn" onClick={() => setCurrentTab('bookings')}>View All</button>
      </div>
      <div className="fo-table-wrap">
        <table className="fo-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Dates</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {displayBookings.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>No bookings yet. Create your first booking to see activity here.</td></tr>
            ) : displayBookings.map((b, i) => (
              <tr key={b.bookingId || i}>
                <td className="fo-cell-id">#{b.bookingId}</td>
                <td className="fo-cell-bold">{b.customer?.name || b.customerName || '—'}</td>
                <td>{b.vehicleDetails?.name || b.vehicleName || '—'}</td>
                <td>{b.dates || `${b.rentalPeriod?.startDate ? new Date(b.rentalPeriod.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}`}</td>
                <td><span className={`fo-badge ${getStatusClass(b.status)}`}>{b.status}</span></td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{b.amount || b.finalAmount || b.baseFare || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main Dashboard
export default function DashboardHome({ vehicles, bookings, userRole, setCurrentTab, onPickup, onDropOff }) {
  const isAdmin = userRole === 'admin';
  const now = new Date();

  const fleetStats = useMemo(() => ({
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'Available' || v.status === 'Active').length,
    ongoing: vehicles.filter(v => v.status === 'Ongoing').length,
    reserved: vehicles.filter(v => v.status === 'Reserved').length,
    maintenance: vehicles.filter(v => v.status === 'Maintenance' || v.status === 'Out Of Service' || v.status === 'Inactive').length,
  }), [vehicles]);

  const bookingStats = useMemo(() => {
    const pendingPickups = bookings.filter(b => b.status === 'Reserved');
    const ongoingTrips = bookings.filter(b => ['Ongoing', 'Extended'].includes(b.status));
    const activeRentals = bookings.filter(b => ['Ongoing', 'Extended', 'Reserved'].includes(b.status));
    return { pendingPickups, ongoingTrips, activeRentals };
  }, [bookings]);

  const financials = useMemo(() => {
    const completedRevenue = bookings
      .filter(b => b.status === 'Completed')
      .reduce((sum, b) => sum + (Number(b.rentalCost) || Number(b.baseFare) || 0), 0);
    return { completedRevenue };
  }, [bookings]);

  const utilization = vehicles.length > 0
    ? Math.round(((fleetStats.ongoing + fleetStats.reserved) / vehicles.length) * 100)
    : 0;

  return (
    <div className="fo-dashboard">
      {/* Page Title */}
      <div className="fo-page-header">
        <div>
          <h1 className="fo-page-title">Dashboard Overview</h1>
          <p className="fo-breadcrumb">
            <span>FleetOps</span> / <span className="fo-breadcrumb-active">Dashboard</span>
          </p>
        </div>
        <p className="fo-last-updated">Last updated: <strong>Just now</strong></p>
      </div>

      {/* Stat Cards Row */}
      <div className="fo-stat-grid">
        <StatCard
          icon={<Car size={22} strokeWidth={2} color="#6366f1"/>}
          iconBg="#eef2ff"
          label="Total Vehicles"
          value={vehicles.length}
          change={`+${fleetStats.available}`}
          changeType="up"
          changeSuffix="available"
        />
        <StatCard
          icon={<Users size={22} strokeWidth={2} color="#10b981"/>}
          iconBg="#ecfdf5"
          label="Active Rentals"
          value={bookingStats.activeRentals.length}
          change={`${bookingStats.ongoingTrips.length} ongoing`}
          changeType="up"
          changeSuffix=""
        />
        <StatCard
          icon={<DollarSign size={22} strokeWidth={2} color="#f59e0b"/>}
          iconBg="#fffbeb"
          label="Revenue"
          value={fmt(financials.completedRevenue)}
          change={financials.completedRevenue > 0 ? 'from completed' : 'no data yet'}
          changeType={financials.completedRevenue > 0 ? 'up' : ''}
          changeSuffix=""
        />
        <StatCard
          icon={<Calendar size={22} strokeWidth={2} color="#8b5cf6"/>}
          iconBg="#f5f3ff"
          label="Pending Requests"
          value={bookingStats.pendingPickups.length}
          change={bookingStats.pendingPickups.length > 0 ? `${bookingStats.pendingPickups.length} needs action` : 'all clear'}
          changeType={bookingStats.pendingPickups.length > 0 ? 'down' : 'up'}
          changeSuffix=""
        />
        <StatCard
          icon={<Clock size={22} strokeWidth={2} color="#06b6d4"/>}
          iconBg="#ecfeff"
          label="Fleet Utilization"
          value={`${utilization}%`}
          change={`${fleetStats.ongoing + fleetStats.reserved} in use`}
          changeType={utilization > 50 ? 'up' : 'down'}
          changeSuffix=""
        />
      </div>

      {/* Charts Row */}
      <div className="fo-charts-grid">
        <RevenueChart />
        <CategoryUtilization vehicles={vehicles} />
      </div>

      {/* Recent Bookings */}
      <RecentBookings bookings={bookings} setCurrentTab={setCurrentTab} />
    </div>
  );
}
