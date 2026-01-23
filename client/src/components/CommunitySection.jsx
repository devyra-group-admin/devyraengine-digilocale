import React, { useState } from 'react';
import { 
  Calendar, ShoppingBag, Briefcase, AlertCircle, Fish, Wrench, 
  MapPin, Users, Info, MessageCircle, ThumbsUp, MoreHorizontal, 
  Search, Plus, PenSquare
} from 'lucide-react';
import { communityBoards, communityPosts } from '../data/communityBoards';

const CommunitySection = ({ searchQuery = '' }) => {
  const [selectedBoard, setSelectedBoard] = useState('local-events');

  // Icon mapping
  const getIcon = (iconName) => {
    const icons = {
      Calendar, ShoppingBag, Briefcase, AlertCircle, Fish, Wrench
    };
    return icons[iconName] || Calendar;
  };

  // Filter posts
  const filteredPosts = communityPosts.filter(post => {
    const matchBoard = selectedBoard === 'all' || post.boardId === selectedBoard;
    const matchSearch = !searchQuery || 
                        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBoard && matchSearch;
  });

  return (
    <div className="flex w-full h-full bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar - Fixed Width */}
      <div className="w-[280px] flex-shrink-0 bg-gray-50 flex flex-col border-r border-gray-200">
        
        {/* Categories */}
        <div className="p-4 space-y-1">
          {communityBoards.map((board) => {
            const Icon = getIcon(board.icon);
            const isSelected = selectedBoard === board.id;
            return (
              <button
                key={board.id}
                onClick={() => setSelectedBoard(board.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isSelected 
                    ? 'bg-teal-50 text-teal-700 font-bold shadow-sm border border-teal-100' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className={`
                  p-1.5 rounded-md transition-colors
                  ${isSelected ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}
                `}>
                  <Icon size={18} strokeWidth={2} />
                </div>
                <span className="text-sm">{board.name}</span>
              </button>
            );
          })}
        </div>

        {/* My Groups Section */}
        <div className="mt-4 px-6 pt-4 border-t border-gray-200">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">My Groups</h3>
          <ul className="space-y-3">
            <li className="flex items-center space-x-3 text-gray-600 hover:text-teal-600 cursor-pointer transition-colors group">
              <div className="bg-blue-100 p-1.5 rounded-full group-hover:bg-blue-200 transition-colors">
                <MessageCircle size={14} className="text-blue-600" />
              </div>
              <span className="text-sm font-medium">Fishing Club</span>
            </li>
            <li className="flex items-center space-x-3 text-gray-600 hover:text-teal-600 cursor-pointer transition-colors group">
              <div className="bg-green-100 p-1.5 rounded-full group-hover:bg-green-200 transition-colors">
                <Users size={14} className="text-green-600" />
              </div>
              <span className="text-sm font-medium">Community Projects</span>
            </li>
            <li className="flex items-center space-x-3 text-gray-600 hover:text-teal-600 cursor-pointer transition-colors group">
              <div className="bg-orange-100 p-1.5 rounded-full group-hover:bg-orange-200 transition-colors">
                <MapPin size={14} className="text-orange-600" />
              </div>
              <span className="text-sm font-medium">Tourism Tips</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Feed Area */}
      <div className="flex-1 flex flex-col relative bg-gray-100">

        {/* Scrollable Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome / Join Banner for Empty State or Top of Feed */}
          {filteredPosts.length === 0 && (
             <div className="text-center py-12">
               <div className="bg-white rounded-full p-4 inline-block mb-4 shadow-sm">
                 <Search size={32} className="text-gray-300" />
               </div>
               <h3 className="text-xl font-bold text-gray-700 mb-2">No posts found</h3>
               <p className="text-gray-500">Try adjusting your search or select a different category.</p>
             </div>
          )}

          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200 relative animate-fadeIn">
              {/* Post Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm
                    ${post.boardId === 'local-events' ? 'bg-blue-500' : 
                      post.boardId === 'buy-sell' ? 'bg-green-500' :
                      post.boardId === 'jobs' ? 'bg-purple-500' : 'bg-teal-500'
                    }`}
                  >
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-teal-900 text-base leading-tight">{post.title}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-0.5 space-x-2">
                       <span className="font-medium text-gray-700">{post.author}</span>
                       <span>•</span>
                       <span>{post.timeAgo}</span>
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Post Content */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line mb-3">
                    {post.content}
                  </p>

                   {/* Post Actions */}
                  <div className="flex items-center space-x-6 pt-2">
                    <button className="flex items-center space-x-1.5 text-gray-500 hover:text-teal-600 transition-colors group">
                      <MessageCircle size={16} className="group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium">{post.comments} Comments</span>
                    </button>
                    <button className="flex items-center space-x-1.5 text-gray-500 hover:text-blue-600 transition-colors group">
                      <ThumbsUp size={16} className="group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium">Like {post.likes}</span>
                    </button>
                  </div>
                </div>

                {/* Optional Image */}
                {post.image && (
                  <div className="w-32 h-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg group">
                    <img 
                      src={post.image} 
                      alt="Post attachment" 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Bottom Community Join CTA */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-teal-100 flex items-center justify-between">
             <div>
               <h4 className="font-bold text-gray-800 mb-1">Join Our Community!</h4>
               <div className="flex space-x-2 mt-2">
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold">• Fishing Club</span>
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold">• Community Projects</span>
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold">• Tourism Tips</span>
               </div>
             </div>
             
             {/* FAB - Post Button */}
             <button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                <PenSquare size={24} />
             </button>
          </div>
          
           {/* Spacer for FAB */}
           <div className="h-16"></div>
        </div>

        {/* Floating Action Button (Overlay for mobile/desk) */}
        <div className="absolute bottom-8 right-8">
           <button className="flex flex-col items-center justify-center w-16 h-16 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-2xl hover:shadow-teal-500/30 transition-all transform hover:scale-110 active:scale-95 group">
             <Plus size={32} strokeWidth={2.5} />
             <span className="text-[10px] font-bold mt-0.5 relative -top-1">Post</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;
