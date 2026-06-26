import { useState, useEffect, useRef, useCallback } from 'react';
import { getProfileDashboard, logMeal, updateProfileHealth } from '../service/profileService';
import { useApp } from '../context/AppContext';
import { ProfileDashboardOutput, MealLogInput, UpdateProfileHealthInput } from '../type/profile.types';

import { UserSession } from '../type/auth.types';

export const useProfileDashboard = () => {
  const { user } = useApp() as { user: UserSession | null };

  const [dashboardData, setDashboardData] = useState<ProfileDashboardOutput | null>(null);
  const [loading, setLoading] = useState(true);

  // Popups state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

  const loadDashboardData = useCallback(async () => {
    if (user) {
      try {
        const data = await getProfileDashboard(user.id, user.full_name);
        setDashboardData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);



  const handleLogMeal = async (mealInput: MealLogInput) => {
    if (!user) throw new Error('Không tìm thấy người dùng');
    await logMeal(user.id, mealInput);
    await loadDashboardData();
  };

  const handleUpdateHealth = async (input: UpdateProfileHealthInput) => {
    if (!user) throw new Error('Không tìm thấy người dùng');
    await updateProfileHealth(user.id, input);
    await loadDashboardData();
  };

  return {
    dashboardData,
    loading,
    isChangePasswordOpen,
    setIsChangePasswordOpen,
    isAddAddressOpen,
    setIsAddAddressOpen,
    loadDashboardData,
    handleLogMeal,
    handleUpdateHealth
  };
};
