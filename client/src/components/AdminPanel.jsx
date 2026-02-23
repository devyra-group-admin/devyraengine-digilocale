import React, { useState, useEffect, useCallback } from 'react';
import BusinessImageUpload from './BusinessImageUpload';
import BusinessLocationEditor from './BusinessLocationEditor';
import { supabase } from '../services/supabaseClient';
import { 
  Users, Building2, MessageSquare, DollarSign, BarChart3, 
  Settings, Shield, TrendingUp, FileText, AlertCircle,
  CheckCircle, XCircle, Eye, Trash2, Edit, Search, Save, MapPin
} from 'lucide-react';

const EMPTY_TOWN_BRANDING = {
  slug: '',
  town_name: '',
  app_name: 'Digital',
  tagline: '',
  logo_url: '',
  hero_url: '',
  primary_color: '#2f4a2f',
  secondary_color: '#3b77c4',
  accent_color: '#e58a2a',
  is_active: true,
  metadata: {
    location_label: '',
    banner_badge: '',
  },
};

function parseEwkbPoint(ewkb) {
  if (!ewkb || typeof ewkb !== 'string') return null;
  const hex = ewkb.startsWith('\\x') ? ewkb.slice(2) : ewkb;
  if (hex.length < 18 || hex.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hex)) return null;

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }

  const view = new DataView(bytes.buffer);
  const littleEndian = view.getUint8(0) === 1;
  const type = view.getUint32(1, littleEndian);
  const hasSrid = (type & 0x20000000) !== 0;
  const offset = hasSrid ? 9 : 5;

  if (view.byteLength < offset + 16) return null;

  const lng = view.getFloat64(offset, littleEndian);
  const lat = view.getFloat64(offset + 8, littleEndian);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return [lat, lng];
}

const AdminPanel = ({ townSlug = 'dullstroom', branding = null }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [businesses, setBusinesses] = useState([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [editingLocationBusiness, setEditingLocationBusiness] = useState(null);
  const [brandingRows, setBrandingRows] = useState([]);
  const [selectedTownSlug, setSelectedTownSlug] = useState(townSlug);
  const [brandingForm, setBrandingForm] = useState(EMPTY_TOWN_BRANDING);
  const [loadingBranding, setLoadingBranding] = useState(false);
  const [savingBranding, setSavingBranding] = useState(false);
  const [brandingError, setBrandingError] = useState('');
  const [brandingMessage, setBrandingMessage] = useState('');

  const loadBusinesses = useCallback(async () => {
    setLoadingBusinesses(true);
    const { data } = await supabase.from('businesses').select('*');
    setBusinesses(data || []);
    setLoadingBusinesses(false);
  }, []);

  useEffect(() => {
    if (activeTab !== 'businesses') return;
    void loadBusinesses();
  }, [activeTab, loadBusinesses]);

  useEffect(() => {
    if (activeTab !== 'settings') return;

    let isMounted = true;
    setLoadingBranding(true);
    setBrandingError('');

    supabase
      .from('town_branding')
      .select('*')
      .order('town_name', { ascending: true })
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          setBrandingError(error.message);
          setBrandingRows([]);
          return;
        }
        const rows = data || [];
        setBrandingRows(rows);

        const preferredSlug = rows.some((row) => row.slug === selectedTownSlug)
          ? selectedTownSlug
          : rows.some((row) => row.slug === townSlug)
            ? townSlug
            : rows[0]?.slug || '';

        if (preferredSlug) {
          const current = rows.find((row) => row.slug === preferredSlug);
          setSelectedTownSlug(preferredSlug);
          setBrandingForm({
            ...EMPTY_TOWN_BRANDING,
            ...current,
            metadata: {
              ...EMPTY_TOWN_BRANDING.metadata,
              ...(current?.metadata || {}),
            },
          });
        } else {
          setSelectedTownSlug('');
          setBrandingForm(EMPTY_TOWN_BRANDING);
        }
      })
      .finally(() => {
        if (isMounted) setLoadingBranding(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab, selectedTownSlug, townSlug]);

  // Mock data
  const stats = {
    totalUsers: 1247,
    totalBusinesses: 89,
    activePosts: 156,
    pendingApprovals: 12,
    revenue: 'R 45,230',
    activeSubscriptions: 23
  };

  const pendingItems = [
    { id: 1, type: 'business', name: 'New Café Opening', status: 'pending', date: '2h ago' },
    { id: 2, type: 'post', name: 'Community Event Announcement', status: 'pending', date: '4h ago' },
    { id: 3, type: 'user', name: 'John Smith - Business Owner', status: 'pending', date: '1d ago' },
  ];

  const recentActivity = [
    { id: 1, action: 'New business listing approved', user: 'Admin', time: '10 min ago' },
    { id: 2, action: 'Post removed - spam', user: 'Moderator', time: '1h ago' },
    { id: 3, action: 'User upgraded to Partner tier', user: 'System', time: '2h ago' },
  ];

  const handleTownSelection = (slug) => {
    setSelectedTownSlug(slug);
    setBrandingMessage('');
    setBrandingError('');
    if (!slug) {
      setBrandingForm(EMPTY_TOWN_BRANDING);
      return;
    }
    const row = brandingRows.find((item) => item.slug === slug);
    if (!row) {
      setBrandingForm(EMPTY_TOWN_BRANDING);
      return;
    }
    setBrandingForm({
      ...EMPTY_TOWN_BRANDING,
      ...row,
      metadata: {
        ...EMPTY_TOWN_BRANDING.metadata,
        ...(row.metadata || {}),
      },
    });
  };

  const handleBrandingFieldChange = (field, value) => {
    setBrandingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBrandingMetadataChange = (field, value) => {
    setBrandingForm((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value,
      },
    }));
  };

  const handleCreateTown = () => {
    setSelectedTownSlug('');
    setBrandingMessage('');
    setBrandingError('');
    setBrandingForm(EMPTY_TOWN_BRANDING);
  };

  const handleSaveBranding = async () => {
    const slug = String(brandingForm.slug || '').trim().toLowerCase();
    const townName = String(brandingForm.town_name || '').trim();
    const appName = String(brandingForm.app_name || '').trim() || 'Digital';

    if (!slug || !townName) {
      setBrandingError('Town slug and town name are required.');
      return;
    }

    setSavingBranding(true);
    setBrandingError('');
    setBrandingMessage('');

    const payload = {
      ...brandingForm,
      slug,
      town_name: townName,
      app_name: appName,
      metadata: brandingForm.metadata || {},
    };

    const { data, error } = await supabase
      .from('town_branding')
      .upsert(payload, { onConflict: 'slug' })
      .select('*');

    if (error) {
      setBrandingError(error.message);
      setSavingBranding(false);
      return;
    }

    const rows = data || [];
    if (rows.length > 0) {
      const savedRow = rows[0];
      setBrandingRows((prev) => {
        const next = [...prev];
        rows.forEach((row) => {
          const idx = next.findIndex((item) => item.slug === row.slug);
          if (idx >= 0) next[idx] = row;
          else next.push(row);
        });
        return next.sort((a, b) => a.town_name.localeCompare(b.town_name));
      });
      setSelectedTownSlug(slug);
      setBrandingForm({
        ...EMPTY_TOWN_BRANDING,
        ...savedRow,
        metadata: {
          ...EMPTY_TOWN_BRANDING.metadata,
          ...(savedRow?.metadata || {}),
        },
      });
    }

    setBrandingMessage('Town branding saved.');
    setSavingBranding(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden md:flex w-64 bg-gray-900 text-white flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Super Admin</h1>
          <p className="text-gray-400 text-sm">
            {branding?.townName || 'Town'} {branding?.appName || 'Digital'}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'overview' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <BarChart3 size={20} />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'users' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Users size={20} />
            <span>Users</span>
          </button>

          <button
            onClick={() => setActiveTab('businesses')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'businesses' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Building2 size={20} />
            <span>Businesses</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'content' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <MessageSquare size={20} />
            <span>Content Moderation</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'subscriptions' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <DollarSign size={20} />
            <span>Subscriptions</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'analytics' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <TrendingUp size={20} />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'settings' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 px-4 py-2">
            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
              <Shield size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-400">Super Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
          {/* Mobile Navigation Dropdown */}
          <div className="md:hidden mb-4">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="overview">Dashboard Overview</option>
              <option value="users">User Management</option>
              <option value="businesses">Business Listings</option>
              <option value="content">Content Moderation</option>
              <option value="subscriptions">Subscriptions</option>
              <option value="analytics">Analytics</option>
              <option value="settings">Settings</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'businesses' && 'Business Listings'}
                {activeTab === 'content' && 'Content Moderation'}
                {activeTab === 'subscriptions' && 'Subscription Management'}
                {activeTab === 'analytics' && 'Analytics & Reports'}
                {activeTab === 'settings' && 'Settings'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {activeTab === 'overview' && 'Monitor key metrics and recent activity'}
                {activeTab === 'users' && 'Manage user accounts and permissions'}
                {activeTab === 'businesses' && 'Review and manage business listings'}
                {activeTab === 'content' && 'Moderate community posts and media'}
              </p>
            </div>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                      <p className="text-green-600 text-sm mt-2">↑ 12% from last month</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Users size={24} className="text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Active Businesses</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBusinesses}</p>
                      <p className="text-green-600 text-sm mt-2">↑ 8% from last month</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Building2 size={24} className="text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Community Posts</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activePosts}</p>
                      <p className="text-green-600 text-sm mt-2">↑ 24% from last month</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <MessageSquare size={24} className="text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Pending Approvals</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingApprovals}</p>
                      <p className="text-amber-600 text-sm mt-2">Requires attention</p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <AlertCircle size={24} className="text-amber-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Monthly Revenue</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.revenue}</p>
                      <p className="text-green-600 text-sm mt-2">↑ 18% from last month</p>
                    </div>
                    <div className="bg-teal-100 p-3 rounded-lg">
                      <DollarSign size={24} className="text-teal-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Active Subscriptions</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeSubscriptions}</p>
                      <p className="text-green-600 text-sm mt-2">↑ 5% from last month</p>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <TrendingUp size={24} className="text-indigo-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Items Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Pending Approvals</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              item.type === 'business' ? 'bg-purple-100 text-purple-700' :
                              item.type === 'post' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button className="text-blue-600 hover:text-blue-800"><Eye size={16} /></button>
                            <button className="text-green-600 hover:text-green-800"><CheckCircle size={16} /></button>
                            <button className="text-red-600 hover:text-red-800"><XCircle size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className="bg-teal-100 p-2 rounded-lg">
                        <FileText size={16} className="text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500 mt-1">by {activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {['content', 'subscriptions', 'analytics'].includes(activeTab) && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
                  <Settings size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module
                </h3>
                <p className="text-gray-500">
                  This section is under development. Full {activeTab} management features will be available soon.
                </p>
              </div>
            </div>
          )}

          {/* User Management */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-500 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">1,247</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-500 text-sm">Active Today</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">342</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-500 text-sm">Business Owners</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">89</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-500 text-sm">Suspended</p>
                  <p className="text-2xl font-bold text-red-600 mt-2">12</p>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-center space-x-4">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>Moderator</option>
                    <option>Business Owner</option>
                    <option>User</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Suspended</option>
                    <option>Pending</option>
                  </select>
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Apply Filters
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Reset
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Business Owner', status: 'Active', joined: '2024-01-15' },
                        { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'User', status: 'Active', joined: '2024-02-20' },
                        { id: 3, name: 'Mike Wilson', email: 'mike@example.com', role: 'Moderator', status: 'Active', joined: '2024-01-05' },
                        { id: 4, name: 'Emma Davis', email: 'emma@example.com', role: 'Business Owner', status: 'Pending', joined: '2024-03-10' },
                        { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'User', status: 'Suspended', joined: '2023-12-01' },
                      ].map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                                <span className="text-teal-700 font-bold">{user.name.charAt(0)}</span>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.role === 'Business Owner' ? 'bg-purple-100 text-purple-700' :
                              user.role === 'Moderator' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.status === 'Active' ? 'bg-green-100 text-green-700' :
                              user.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button className="text-blue-600 hover:text-blue-800" title="View">
                              <Eye size={16} />
                            </button>
                            <button className="text-teal-600 hover:text-teal-800" title="Edit">
                              <Edit size={16} />
                            </button>
                            <button className="text-red-600 hover:text-red-800" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-600">Showing 1 to 5 of 1,247 users</p>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">Previous</button>
                    <button className="px-3 py-1 bg-teal-600 text-white rounded">1</button>
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">2</button>
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">Next</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Business Management */}
          {activeTab === 'businesses' && (
            <div className="space-y-6">
              {/* Business Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-500 text-sm">Total Businesses</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">89</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-500 text-sm">Pending Approval</p>
                  <p className="text-2xl font-bold text-amber-600 mt-2">7</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-500 text-sm">Featured</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">23</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-500 text-sm">Inactive</p>
                  <p className="text-2xl font-bold text-red-600 mt-2">5</p>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-center space-x-4">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>All Categories</option>
                    <option>Restaurants</option>
                    <option>Accommodations</option>
                    <option>Activities</option>
                    <option>Shopping</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Inactive</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>All Tiers</option>
                    <option>Free</option>
                    <option>Basic</option>
                    <option>Featured</option>
                    <option>Partner</option>
                  </select>
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Apply Filters
                  </button>
                </div>
              </div>

              {/* Businesses Table (from DB) */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  {loadingBusinesses ? (
                    <div className="p-8 text-center text-gray-400">Loading businesses...</div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coordinates</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Images</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {businesses.map((business) => {
                          const coords = parseEwkbPoint(business.location);
                          return (
                          <tr key={business.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <Building2 size={20} className="text-purple-600" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">{business.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{business.category_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                {business.tier}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                              {coords ? `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}` : 'No pin set'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <BusinessImageUpload
                                businessId={business.id}
                                images={business.images || []}
                                onImagesChange={(imgs) => {
                                  setBusinesses((prev) => prev.map((b) => b.id === business.id ? { ...b, images: imgs } : b));
                                }}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                              <button
                                type="button"
                                onClick={() => setEditingLocationBusiness(business)}
                                className="text-emerald-600 hover:text-emerald-800"
                                title="Pin on map"
                              >
                                <MapPin size={16} />
                              </button>
                              <button className="text-blue-600 hover:text-blue-800" title="View">
                                <Eye size={16} />
                              </button>
                              <button className="text-teal-600 hover:text-teal-800" title="Edit">
                                <Edit size={16} />
                              </button>
                              <button className="text-red-600 hover:text-red-800" title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Town Branding Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Town Branding</h3>
                    <p className="text-sm text-gray-500">
                      Configure logos, hero banners, colors, and taglines per town.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateTown}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    New Town
                  </button>
                </div>

                {loadingBranding && (
                  <div className="mt-4 text-sm text-gray-500">Loading town branding...</div>
                )}

                {brandingError && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {brandingError}
                  </div>
                )}

                {brandingMessage && (
                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm">
                    {brandingMessage}
                  </div>
                )}

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Choose Town</label>
                    <select
                      value={selectedTownSlug}
                      onChange={(e) => handleTownSelection(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select a town</option>
                      {brandingRows.map((row) => (
                        <option key={row.slug} value={row.slug}>
                          {row.town_name} ({row.slug})
                        </option>
                      ))}
                    </select>

                    <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                      <p className="text-xs text-gray-500">Live Preview</p>
                      <div className="mt-2 flex items-center gap-2">
                        <img
                          src={brandingForm.logo_url || branding?.logoUrl || '/branding/logo-square.svg'}
                          alt="Town logo preview"
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200 bg-white"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {brandingForm.town_name || brandingForm.slug || 'Town'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {brandingForm.app_name || 'Digital'} · {brandingForm.tagline || 'Tagline'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Town Slug</label>
                      <input
                        type="text"
                        value={brandingForm.slug}
                        onChange={(e) => handleBrandingFieldChange('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g. dullstroom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Town Name</label>
                      <input
                        type="text"
                        value={brandingForm.town_name}
                        onChange={(e) => handleBrandingFieldChange('town_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Town display name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">App Label</label>
                      <input
                        type="text"
                        value={brandingForm.app_name}
                        onChange={(e) => handleBrandingFieldChange('app_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Digital"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                      <input
                        type="text"
                        value={brandingForm.tagline}
                        onChange={(e) => handleBrandingFieldChange('tagline', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Town tagline"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                      <input
                        type="text"
                        value={brandingForm.logo_url}
                        onChange={(e) => handleBrandingFieldChange('logo_url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="https://.../logo.png"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hero URL</label>
                      <input
                        type="text"
                        value={brandingForm.hero_url}
                        onChange={(e) => handleBrandingFieldChange('hero_url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="https://.../hero.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                      <input
                        type="text"
                        value={brandingForm.primary_color}
                        onChange={(e) => handleBrandingFieldChange('primary_color', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="#2f4a2f"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                      <input
                        type="text"
                        value={brandingForm.secondary_color}
                        onChange={(e) => handleBrandingFieldChange('secondary_color', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="#3b77c4"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
                      <input
                        type="text"
                        value={brandingForm.accent_color}
                        onChange={(e) => handleBrandingFieldChange('accent_color', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="#e58a2a"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location Label</label>
                      <input
                        type="text"
                        value={brandingForm.metadata?.location_label || ''}
                        onChange={(e) => handleBrandingMetadataChange('location_label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Mpumalanga, South Africa"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Banner Badge</label>
                      <input
                        type="text"
                        value={brandingForm.metadata?.banner_badge || ''}
                        onChange={(e) => handleBrandingMetadataChange('banner_badge', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Official Town Guide"
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between pt-2">
                      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={Boolean(brandingForm.is_active)}
                          onChange={(e) => handleBrandingFieldChange('is_active', e.target.checked)}
                        />
                        Active
                      </label>
                      <button
                        type="button"
                        onClick={handleSaveBranding}
                        disabled={savingBranding}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 disabled:opacity-60"
                      >
                        <Save size={16} />
                        {savingBranding ? 'Saving...' : 'Save Branding'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {editingLocationBusiness && (
        <BusinessLocationEditor
          business={editingLocationBusiness}
          onClose={() => setEditingLocationBusiness(null)}
          onSaved={async () => {
            await loadBusinesses();
          }}
        />
      )}
    </div>
  );
};

export default AdminPanel;
