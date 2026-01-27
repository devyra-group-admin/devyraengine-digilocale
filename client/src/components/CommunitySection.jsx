import React, { useState } from 'react';
import {
  Calendar, ShoppingBag, Briefcase, AlertCircle, Fish, Wrench,
  MapPin, Users, MessageCircle, ThumbsUp, MoreHorizontal,
  Search, PenSquare, ChevronDown, Heart, Bookmark, Share2
} from 'lucide-react';
import { communityBoards, communityPosts } from '../data/communityBoards';
import ImageWithFallback from './ui/ImageWithFallback';

const CommunitySection = ({ searchQuery = '' }) => {
  const [selectedBoard, setSelectedBoard] = useState('all');
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  // Icon mapping
  const getIcon = (iconName) => {
    const icons = {
      Calendar, ShoppingBag, Briefcase, AlertCircle, Fish, Wrench
    };
    return icons[iconName] || Calendar;
  };

  // Get board color
  const getBoardColor = (boardId) => {
    const colors = {
      'local-events': 'bg-blue-500',
      'buy-sell': 'bg-emerald-500',
      'jobs': 'bg-purple-500',
      'lost-found': 'bg-amber-500',
      'fishing': 'bg-cyan-500',
      'local-services': 'bg-rose-500',
    };
    return colors[boardId] || 'bg-teal-500';
  };

  // Filter posts
  const filteredPosts = communityPosts.filter(post => {
    const matchBoard = selectedBoard === 'all' || post.boardId === selectedBoard;
    const matchSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBoard && matchSearch;
  });

  const selectedBoardData = communityBoards.find(b => b.id === selectedBoard);

  return (
    <div className="flex w-full h-full bg-gray-50 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-[280px] flex-shrink-0 bg-white flex-col border-r border-gray-100 shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Community</h2>
          <p className="text-xs text-gray-500 mt-0.5">Connect with locals</p>
        </div>

        {/* Categories */}
        <div className="p-3 space-y-1 flex-1 overflow-y-auto">
          {/* All Posts option */}
          <button
            onClick={() => setSelectedBoard('all')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              selectedBoard === 'all'
                ? 'bg-green-50 text-green-700 font-semibold shadow-sm border border-green-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className={`p-2 rounded-lg transition-colors ${
              selectedBoard === 'all' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
            }`}>
              <Users size={18} />
            </div>
            <span className="text-sm">All Posts</span>
          </button>

          {communityBoards.map((board) => {
            const Icon = getIcon(board.icon);
            const isSelected = selectedBoard === board.id;
            return (
              <button
                key={board.id}
                onClick={() => setSelectedBoard(board.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isSelected
                    ? 'bg-green-50 text-green-700 font-semibold shadow-sm border border-green-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className={`p-2 rounded-lg transition-colors ${
                  isSelected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                }`}>
                  <Icon size={18} />
                </div>
                <span className="text-sm">{board.name}</span>
              </button>
            );
          })}
        </div>

        {/* My Groups - Desktop */}
        <div className="p-4 border-t border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">My Groups</h3>
          <ul className="space-y-2">
            {['Fishing Club', 'Community Projects', 'Tourism Tips'].map((group, i) => (
              <li key={i} className="flex items-center space-x-3 text-gray-600 hover:text-green-600 cursor-pointer transition-colors p-2 rounded-lg hover:bg-gray-50">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-green-500' : 'bg-orange-500'
                }`}>
                  {group.charAt(0)}
                </div>
                <span className="text-sm font-medium">{group}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Feed Area */}
      <div className="flex-1 flex flex-col relative bg-gray-50">
        {/* Mobile Category Selector - Horizontal scroll */}
        <div className="md:hidden bg-white border-b border-gray-100 shadow-sm">
          {/* Current category header */}
          <button
            onClick={() => setShowMobileCategories(!showMobileCategories)}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              {selectedBoard === 'all' ? (
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Users className="text-green-600" size={20} />
                </div>
              ) : (
                <div className={`w-10 h-10 rounded-xl ${getBoardColor(selectedBoard)} flex items-center justify-center`}>
                  {React.createElement(getIcon(selectedBoardData?.icon), { className: 'text-white', size: 20 })}
                </div>
              )}
              <div className="text-left">
                <p className="font-bold text-gray-900">{selectedBoard === 'all' ? 'All Posts' : selectedBoardData?.name}</p>
                <p className="text-xs text-gray-500">{filteredPosts.length} posts</p>
              </div>
            </div>
            <ChevronDown className={`text-gray-400 transition-transform duration-300 ${showMobileCategories ? 'rotate-180' : ''}`} size={20} />
          </button>

          {/* Expandable category grid */}
          {showMobileCategories && (
            <div className="p-4 pt-0 animate-fadeIn">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { setSelectedBoard('all'); setShowMobileCategories(false); }}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all active:scale-95 ${
                    selectedBoard === 'all' ? 'bg-green-50 ring-2 ring-green-500' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    selectedBoard === 'all' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    <Users size={18} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">All</span>
                </button>
                {communityBoards.map((board) => {
                  const Icon = getIcon(board.icon);
                  const isSelected = selectedBoard === board.id;
                  return (
                    <button
                      key={board.id}
                      onClick={() => { setSelectedBoard(board.id); setShowMobileCategories(false); }}
                      className={`flex flex-col items-center p-3 rounded-xl transition-all active:scale-95 ${
                        isSelected ? 'bg-green-50 ring-2 ring-green-500' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        isSelected ? getBoardColor(board.id) + ' text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <Icon size={18} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 line-clamp-1">{board.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Feed */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 space-y-4 max-w-2xl mx-auto">
            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-16 animate-fadeIn">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No posts found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or select a different category.</p>
                <button
                  onClick={() => setSelectedBoard('all')}
                  className="text-green-600 font-semibold hover:underline"
                >
                  View all posts
                </button>
              </div>
            )}

            {/* Post Cards */}
            {filteredPosts.map((post, index) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden hover:shadow-elevated transition-all duration-300 animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Post Header */}
                <div className="p-4 pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${getBoardColor(post.boardId)}`}>
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{post.author}</span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-white ${getBoardColor(post.boardId)}`}>
                            {communityBoards.find(b => b.id === post.boardId)?.name.split(' ')[0]}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">{post.timeAgo}</span>
                      </div>
                    </div>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 active:scale-95">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4">
                  <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug">{post.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line line-clamp-3">
                    {post.content}
                  </p>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="mt-3 mx-4">
                    <ImageWithFallback
                      src={post.image}
                      alt="Post attachment"
                      className="w-full h-48 rounded-xl"
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between px-4 py-3 mt-2 border-t border-gray-50">
                  <div className="flex items-center gap-1">
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-gray-100 text-gray-500 transition-all active:scale-95 group">
                      <ThumbsUp size={16} className="group-hover:text-blue-500 transition-colors" />
                      <span className="text-xs font-semibold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-gray-100 text-gray-500 transition-all active:scale-95 group">
                      <MessageCircle size={16} className="group-hover:text-green-500 transition-colors" />
                      <span className="text-xs font-semibold">{post.comments}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-all active:scale-95">
                      <Bookmark size={16} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-all active:scale-95">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Join CTA Card */}
            {filteredPosts.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-5 border border-green-100 animate-fadeIn">
                <h4 className="font-bold text-gray-800 mb-2">Join the Conversation</h4>
                <p className="text-sm text-gray-600 mb-4">Share news, ask questions, and connect with your neighbors.</p>
                <div className="flex flex-wrap gap-2">
                  {['Fishing Club', 'Community Projects', 'Tourism Tips'].map((group, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white/80 text-green-700 rounded-full text-xs font-semibold shadow-sm">
                      {group}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom spacer for mobile nav */}
            <div className="h-24 md:h-8" />
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="absolute bottom-24 md:bottom-8 right-4 md:right-8">
          <button className="flex items-center gap-2 px-5 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-elevated hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95">
            <PenSquare size={18} />
            <span className="font-bold text-sm">New Post</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;
