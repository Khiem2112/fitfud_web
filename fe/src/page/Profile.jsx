import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useProfileDashboard } from '../hooks/useProfileDashboard';

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
  const { user, isAIAnalyzing } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const {
    dashboardData,
    loading,
    isChangePasswordOpen,
    setIsChangePasswordOpen,
    isAddAddressOpen,
    setIsAddAddressOpen,
    loadDashboardData,
    handleLogMeal,
    handleUpdateHealth
  } = useProfileDashboard();

  const prevIsAIAnalyzing = useRef(isAIAnalyzing);
  useEffect(() => {
    if (prevIsAIAnalyzing.current === true && isAIAnalyzing === false) {
      loadDashboardData();
      addToast('Đã phân tích và thêm bữa ăn từ ảnh!', 'success');
    }
    prevIsAIAnalyzing.current = isAIAnalyzing;
  }, [isAIAnalyzing, loadDashboardData, addToast]);

  const onLogMeal = async (mealInput) => {
    try {
      await handleLogMeal(mealInput);
      addToast('Đã thêm bữa ăn vào nhật ký!', 'success');
    } catch (err) {
      addToast(err.message || 'Không thể ghi nhận bữa ăn.', 'error');
    }
  };

  const onUpdateHealth = async (input) => {
    try {
      await handleUpdateHealth(input);
      addToast('Đã cập nhật chỉ số thành công.', 'success');
    } catch (err) {
      addToast(err.message || 'Cập nhật thất bại.', 'error');
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
            onUpdateHealth={onUpdateHealth}
          />
          <HealthGoalPanel
            dashboardData={dashboardData}
            onUpdateGoal={onUpdateHealth}
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
            <MealLoggerPanel onLogMeal={onLogMeal} />

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
