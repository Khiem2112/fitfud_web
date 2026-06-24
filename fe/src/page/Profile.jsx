import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getProfileDashboard, logMeal } from '../service/profileService';

// Left Column Components
import ProfileCard from '../component/organism/Profile/ProfileCard';
import HealthGoalPanel from '../component/organism/Profile/HealthGoalPanel';
import DefaultAddressPanel from '../component/organism/Profile/DefaultAddressPanel';

// Middle Column Components
import NutritionChartGrid from '../component/organism/Profile/NutritionChartGrid';
import MealLoggerPanel from '../component/organism/Profile/MealLoggerPanel';
import RecentMealsPanel from '../component/organism/Profile/RecentMealsPanel';

// Right Column Components
import TodayProgressBox from '../component/organism/Profile/TodayProgressBox';
import AIRecommendedMealsPanel from '../component/organism/Profile/AIRecommendedMealsPanel';

import ChangePasswordPopup from '../component/organism/Profile/ChangePasswordPopup';
import AddAddressPopup from '../component/organism/Profile/AddAddressPopup';

export default function Profile() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Popups state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

  const loadDashboardData = async () => {
    if (user) {
      try {
        const data = await getProfileDashboard(user.id, user.full_name);
        setDashboardData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const handleLogMeal = async (mealInput) => {
    try {
      await logMeal(user.id, mealInput);
      loadDashboardData(); // Reload dashboard data
      alert('Đã thêm bữa ăn vào nhật ký!');
    } catch (err) {
      alert('Không thể ghi nhận bữa ăn.');
      throw err;
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-light border-t-primary"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 page-enter relative">
      
      {/* 3-Column Layout exactly like Figma */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: Profile info, Health Goal, Address */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <ProfileCard 
            dashboardData={dashboardData} 
            onChangePassword={() => setIsChangePasswordOpen(true)}
          />
          <HealthGoalPanel />
          <DefaultAddressPanel 
            defaultAddress={dashboardData.defaultAddress}
            onChangeAddress={() => setIsAddAddressOpen(true)}
          />
        </div>

        {/* MIDDLE COLUMN: Chart, Logger, Recent Meals */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <NutritionChartGrid weeklyTrend={dashboardData.weekly_trend} />
          
          <div className="flex flex-col gap-6">
            <MealLoggerPanel onLogMeal={handleLogMeal} />
            
            <div className="bg-bg-card border border-border-light rounded-3xl p-6 shadow-premium">
              <h2 className="text-sm font-bold text-text-main flex items-center gap-2 mb-4">
                <span>🕒</span> Bữa ăn gần đây
              </h2>
              <RecentMealsPanel recentMeals={dashboardData.recentMeals} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Progress Box, AI Dinner */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <TodayProgressBox dashboardData={dashboardData} />
          <div className="flex-1">
            <AIRecommendedMealsPanel recommendedDishes={dashboardData.aiRecommendedDishes} />
          </div>
        </div>

      </div>

      {/* Floating Logout Button or any other global actions can go here if needed, but per Figma it might be in an avatar dropdown, or we can just keep it accessible via navbar */}
      <button 
        onClick={() => {
          logout();
          navigate('/auth');
        }}
        className="fixed bottom-4 right-4 bg-danger-light text-danger rounded-full px-4 py-2 text-xs font-bold shadow-md hover:bg-danger hover:text-white transition"
      >
        Đăng xuất
      </button>

      <ChangePasswordPopup 
        isOpen={isChangePasswordOpen} 
        onClose={() => setIsChangePasswordOpen(false)} 
      />
      
      <AddAddressPopup 
        isOpen={isAddAddressOpen}
        onClose={() => setIsAddAddressOpen(false)}
      />
    </div>
  );
}
