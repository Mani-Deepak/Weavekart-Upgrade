import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Save, Heart, Sparkles, MapPin, Phone, Mail } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 1. Local State for User Info Forms
  const [userInfo, setUserInfo] = useState({
    fullName: user?.name || 'Aiva User',
    phone: '+1 (555) 000-0000',
    address: 'New York, USA',
    email: user?.email || 'user@example.com'
  });

  // 2. Local State for Preferences
  const [preferences, setPreferences] = useState({
    season: 'Summer',
    occasion: 'Casual',
    style: 'Modern'
  });

  const handleInfoChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handlePrefChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Profile Updated (Mock Save)");
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* 1. Profile Header */}
        <div className="bg-background-50 rounded-2xl p-6 shadow-sm border border-secondary-200 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center border-4 border-white shadow-md text-primary-600 text-3xl font-bold">
                {user?.avatar ? (
                     <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                    userInfo.fullName.charAt(0)
                )}
            </div>
            <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl font-bold text-text-900">{userInfo.fullName}</h1>
                <p className="text-text-500">{userInfo.email}</p>
            </div>
            <button className="px-4 py-2 border border-secondary-300 rounded-lg text-sm font-medium hover:bg-white hover:border-primary-500 transition-colors">
                Edit Profile Icon
            </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {/* 2. User Info Card */}
            <div className="bg-background-50 rounded-2xl p-6 shadow-sm border border-secondary-200 h-full">
                <div className="flex items-center gap-2 mb-6 border-b border-secondary-200 pb-2">
                    <User className="w-5 h-5 text-primary-500" />
                    <h2 className="text-xl font-bold text-text-900">Personal Details</h2>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-700 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            name="fullName"
                            value={userInfo.fullName}
                            onChange={handleInfoChange}
                            className="w-full px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-700 mb-1">Phone</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                name="phone"
                                value={userInfo.phone}
                                onChange={handleInfoChange}
                                className="w-full pl-10 px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                            />
                            <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-700 mb-1">Location</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                name="address"
                                value={userInfo.address}
                                onChange={handleInfoChange}
                                className="w-full pl-10 px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                            />
                            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-400" />
                        </div>
                    </div>
                    <button 
                        onClick={handleSave}
                        className="w-full mt-4 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </div>

            {/* 3. Preferences Card */}
            <div className="bg-background-50 rounded-2xl p-6 shadow-sm border border-secondary-200 h-full">
                <div className="flex items-center gap-2 mb-6 border-b border-secondary-200 pb-2">
                    <Sparkles className="w-5 h-5 text-accent-500" />
                    <h2 className="text-xl font-bold text-text-900">Style Preferences</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-700 mb-1">Preferred Season</label>
                        <select 
                            name="season"
                            value={preferences.season}
                            onChange={handlePrefChange}
                            className="w-full px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-accent-500 outline-none bg-white"
                        >
                            <option>Summer</option>
                            <option>Winter</option>
                            <option>Rainy</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-700 mb-1">Usual Occasion</label>
                        <select 
                            name="occasion"
                            value={preferences.occasion}
                            onChange={handlePrefChange}
                            className="w-full px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-accent-500 outline-none bg-white"
                        >
                            <option>Casual</option>
                            <option>Formal</option>
                            <option>Party</option>
                            <option>Traditional</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-text-700 mb-1">Core Style</label>
                        <select 
                            name="style"
                            value={preferences.style}
                            onChange={handlePrefChange}
                            className="w-full px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-accent-500 outline-none bg-white"
                        >
                            <option>Classic</option>
                            <option>Modern</option>
                            <option>Minimal</option>
                            <option>Ethnic</option>
                        </select>
                    </div>
                     <button 
                        onClick={handleSave}
                        className="w-full mt-4 flex items-center justify-center gap-2 border border-accent-500 text-accent-600 hover:bg-accent-50 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        Update Preferences
                    </button>
                </div>
            </div>
        </div>

        {/* 4. Saved Items */}
        <div>
             <h2 className="text-xl font-bold text-text-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" /> Saved Items
             </h2>
             <div className="bg-background-50 rounded-2xl p-6 shadow-sm border border-secondary-200">
                
                <div className="mb-6">
                    <h3 className="font-semibold text-text-700 mb-3">Saved Recommendations</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="min-w-[150px] bg-white p-3 rounded-xl border border-secondary-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                                <div className="aspect-[3/4] bg-secondary-100 rounded-lg mb-2"></div>
                                <p className="text-sm font-medium text-text-800">Summer Look #{i}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-text-700 mb-3">Saved Virtual Try-Ons</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                         {[1, 2].map(i => (
                            <div key={i} className="min-w-[150px] bg-white p-3 rounded-xl border border-secondary-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                                <div className="aspect-[3/4] bg-secondary-100 rounded-lg mb-2 relative overflow-hidden">
                                     <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-50">
                                        <Sparkles className="w-6 h-6 text-white" />
                                     </div>
                                </div>
                                <p className="text-sm font-medium text-text-800">Try-On Result #{i}</p>
                            </div>
                        ))}
                    </div>
                </div>

             </div>
        </div>

        {/* 5. Logout */}
        <div className="flex justify-center pt-8 border-t border-secondary-200">
             <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-8 py-3 bg-red-50 text-red-600 rounded-full font-bold hover:bg-red-100 transition-colors"
             >
                <LogOut className="w-5 h-5" /> Log Out
             </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
