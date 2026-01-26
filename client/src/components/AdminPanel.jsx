import React, { useState } from 'react';
import { 
  Users, Building2, MessageSquare, DollarSign, BarChart3, 
  Settings, Shield, TrendingUp, FileText, AlertCircle,
  CheckCircle, XCircle, Eye, Trash2, Edit, Search
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden md:flex w-64 bg-gray-900 text-white flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-gray-400 text-sm">Dullstroom Digital</p>
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

          {activeTab !== 'overview' && activeTab !== 'users' && activeTab !== 'businesses' && (
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

              {/* Businesses Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Listed</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { id: 1, name: 'The Highlander Restaurant', category: 'Restaurants', owner: 'John Smith', tier: 'Featured', status: 'Active', listed: '2024-01-10' },
                        { id: 2, name: 'Dullstroom Gallery', category: 'Art & Culture', owner: 'Sarah Johnson', tier: 'Basic', status: 'Active', listed: '2024-02-15' },
                        { id: 3, name: 'Mountain View Lodge', category: 'Accommodations', owner: 'Mike Wilson', tier: 'Partner', status: 'Active', listed: '2024-01-20' },
                        { id: 4, name: 'Outdoors Equipment Shop', category: 'Shopping', owner: 'Emma Davis', tier: 'Free', status: 'Pending', listed: '2024-03-10' },
                        { id: 5, name: 'Fishing Tours Pro', category: 'Activities', owner: 'Tom Brown', tier: 'Basic', status: 'Inactive', listed: '2023-12-05' },
                      ].map((business) => (
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{business.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{business.owner}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              business.tier === 'Partner' ? 'bg-indigo-100 text-indigo-700' :
                              business.tier === 'Featured' ? 'bg-purple-100 text-purple-700' :
                              business.tier === 'Basic' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {business.tier}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              business.status === 'Active' ? 'bg-green-100 text-green-700' :
                              business.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {business.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{business.listed}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button className="text-blue-600 hover:text-blue-800" title="View">
                              <Eye size={16} />
                            </button>
                            <button className="text-green-600 hover:text-green-800" title="Approve">
                              <CheckCircle size={16} />
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
                  <p className="text-sm text-gray-600">Showing 1 to 5 of 89 businesses</p>
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
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
