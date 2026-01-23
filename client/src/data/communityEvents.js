// Community events data for the Dullstroom Digital app
export const communityEvents = [
  {
    id: 1,
    title: "Weekend Market This Saturday!",
    author: "Dullstroom Events",
    category: "Local Events",
    timeAgo: "2h ago",
    description: "Join us this Saturday for the Dullstroom Market at Cherry Grove! Lots of local crafts, food, and live music.",
    image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=400&h=200&fit=crop",
    comments: 18,
    likes: 32
  },
  {
    id: 2,
    title: "Hiring: Housekeeper Needed",
    author: "Big Oak Cottages",
    category: "Jobs & Vacancies", 
    timeAgo: "3 days ago",
    description: "Looking for a reliable housekeeper. Experience preferred. Apply within.",
    image: "https://images.unsplash.com/photo-1556909075-f3e64e95b369?w=400&h=200&fit=crop",
    comments: 12,
    likes: 24
  },
  {
    id: 3,
    title: "Fishing Tips at Dullstroom Dam",
    author: "Paul's Tackle Shop",
    category: "Fishing & Outdoors",
    timeAgo: "1 day ago",
    description: "Check out the best baits and tactics for trout season!",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=200&fit=crop",
    comments: 8,
    likes: 20
  },
  {
    id: 4,
    title: "Lost: Black & White Border Collie",
    author: "Mary L.",
    category: "Lost & Found",
    timeAgo: "4h ago",
    description: "Missing in the Oak Lane area. Please contact me if found!",
    image: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=200&fit=crop",
    comments: 14,
    likes: 15
  },
  {
    id: 5,
    title: "Community Clean-Up Day",
    author: "Dullstroom Municipality",
    category: "Community Projects",
    timeAgo: "5 days ago",
    description: "Join us next weekend for our monthly community clean-up initiative. Meet at the town hall at 8 AM.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop",
    comments: 25,
    likes: 45
  }
];

export const eventCategories = [
  { name: "Local Events", icon: "📅", color: "#3B82F6" },
  { name: "Jobs & Vacancies", icon: "💼", color: "#F59E0B" },
  { name: "Lost & Found", icon: "🔍", color: "#10B981" },
  { name: "Fishing & Outdoors", icon: "🎣", color: "#06B6D4" },
  { name: "Local Services", icon: "🛠️", color: "#8B5CF6" },
  { name: "Community Projects", icon: "🏠", color: "#EF4444" }
];

export default { communityEvents, eventCategories };