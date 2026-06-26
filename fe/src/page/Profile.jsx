import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { getProfileDashboard, logMeal, updateProfileHealth } from '../service/profileService';

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
  const { user, logout, isAIAnalyzing } = useApp();
  const { addToast } = useToast();
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

  const prevIsAIAnalyzing = useRef(isAIAnalyzing);
  useEffect(() => {
    if (prevIsAIAnalyzing.current === true && isAIAnalyzing === false) {
      loadDashboardData();
      addToast('Đã phân tích và thêm bữa ăn từ ảnh!', 'success');
    }
    prevIsAIAnalyzing.current = isAIAnalyzing;
  }, [isAIAnalyzing]);

  const handleLogMeal = async (mealInput) => {
    try {
      await logMeal(user.id, mealInput);
      loadDashboardData(); // Reload dashboard data
      addToast('Đã thêm bữa ăn vào nhật ký!', 'success');
    } catch (err) {
      addToast('Không thể ghi nhận bữa ăn.', 'error');
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
    <div className="mx-auto max-w-[1280px] px-4 py-5 page-enter relative">

      {/* 3-Column Layout exactly like Figma */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* LEFT COLUMN: Profile info, Health Goal, Address */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <ProfileCard
            dashboardData={dashboardData}
            onChangePassword={() => setIsChangePasswordOpen(true)}
            onUpdateHealth={async (input) => {
              await updateProfileHealth(user.id, input);
              await loadDashboardData();
              addToast('Đã cập nhật chiều cao/cân nặng.', 'success');
            }}
          />
          <HealthGoalPanel
            dashboardData={dashboardData}
            onUpdateGoal={async (input) => {
              await updateProfileHealth(user.id, input);
              await loadDashboardData();
              addToast('Đã cập nhật mục tiêu sức khỏe.', 'success');
            }}
          />
          <DefaultAddressPanel
            addresses={dashboardData.addresses}
            onChangeAddress={() => setIsAddAddressOpen(true)}
          />
        </div>

        {/* MIDDLE COLUMN: Chart, Logger, Recent Meals */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <NutritionChartGrid />

          <div className="flex flex-col gap-4">
            <MealLoggerPanel onLogMeal={handleLogMeal} />

            <div className="bg-bg-card border border-border-light rounded-2xl p-4 shadow-premium">
              <h2 className="text-sm font-bold text-text-main flex items-center gap-2 mb-4">
                <i className="bi bi-clock-history text-base leading-none text-primary" aria-hidden="true" />
                <span>Bữa ăn gần đây</span>
              </h2>
              <RecentMealsPanel recentMeals={dashboardData.recentMeals} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Progress Box, AI Dinner */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <TodayProgressBox dashboardData={dashboardData} />
          <div className="flex-1">
            <AIRecommendedMealsPanel recommendedDishes={dashboardData.aiRecommendedDishes} />
          </div>
        </div>

      </div>

      <ChangePasswordPopup
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      <AddAddressPopup
        isOpen={isAddAddressOpen}
        onClose={() => setIsAddAddressOpen(false)}
        onSuccess={loadDashboardData}
      />
    </div>
  );
}
