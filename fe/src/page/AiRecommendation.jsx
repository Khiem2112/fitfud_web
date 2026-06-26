import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getCustomerProfile } from '../service/surveyService';
import { fetchAiRecommendations } from '../service/aiRecommendationService';
import { getProfileDashboard } from '../service/profileService';
import { mockMasterData } from '../service/menuService';

import AiAnalysisLoadingPopup from '../component/organism/AiRecommendation/AiAnalysisLoadingPopup';
import AiRecommendationResultList from '../component/organism/AiRecommendation/AiRecommendationResultList';
import AiAnalyticsGrid from '../component/organism/AiRecommendation/AiAnalyticsGrid';
import QuickViewModal from '../component/organism/Menu/QuickViewModal';

export default function AiRecommendation() {
  const { user, addToCart } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  // Quick View Popup States
  const [selectedDish, setSelectedDish] = useState(null);
  const [allergenAlert, setAllergenAlert] = useState(null);

  // Authentication & Profile Check
  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true });
      return;
    }

    const userProfile = getCustomerProfile(user.id);
    if (!userProfile) {
      navigate('/survey', { replace: true });
      return;
    }

    setProfile(userProfile);

    // Fetch AI Recommendations & Dashboard Data concurrently
    const fetchData = async () => {
      try {
        const [recResult, dashResult] = await Promise.all([
          fetchAiRecommendations({ profileId: userProfile.id, limit: 3 }),
          getProfileDashboard(user.id, user.full_name)
        ]);
        
        setRecommendations(recResult);
        setDashboardData(dashResult);
      } catch (err) {
        setError("Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  // Handle Quick View
  const handleOpenQuickView = (dish) => {
    setSelectedDish(dish);

    // Allergen detection
    if (profile && profile.allergyIds && profile.allergyIds.length > 0) {
      const userAllergies = mockMasterData.allergies.filter((a) => profile.allergyIds.includes(a.id));

      const matchedAllergens = [];
      userAllergies.forEach((allergy) => {
        const triggers = allergy.triggers || [allergy.name.toLowerCase()];
        const clashingIngredient = dish.ingredients.find((ing) =>
          triggers.some((trig) => ing.toLowerCase().includes(trig.toLowerCase()))
        );
        if (clashingIngredient) {
          matchedAllergens.push({ allergyName: allergy.name, clashingIngredient });
        }
      });

      if (matchedAllergens.length > 0) {
        setAllergenAlert(matchedAllergens);
      } else {
        setAllergenAlert(null);
      }
    } else {
      setAllergenAlert(null);
    }
  };

  if (!user || !profile) return null;

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-5 page-enter relative min-h-[70vh] bg-[#F7F9FA]">
      
      {isLoading && <AiAnalysisLoadingPopup />}

      {!isLoading && error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center">
          {error}
        </div>
      )}

      {!isLoading && !error && recommendations && dashboardData && (
        <div className="animate-fade-in-up">
          <div className="mb-5">
            <h1 className="text-2xl font-extrabold text-[#12563F]">Kết quả phân tích từ FitFud</h1>
            <p className="text-xs text-text-muted mt-1.5">
              Dựa trên chỉ số cơ thể và mục tiêu sức khỏe của bạn, AI đã tối ưu hóa lộ trình dinh dưỡng hôm nay.
            </p>
          </div>

          <AiAnalyticsGrid dashboardData={dashboardData} profile={profile} />

          <AiRecommendationResultList 
            dishes={recommendations.recommendedDishes} 
            onOpenQuickView={handleOpenQuickView}
          />

          {/* Bottom Banner */}
          <div className="mt-8 bg-[#336850] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center justify-end pr-12">
              <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1"><path d="M7 2v10a2 2 0 002 2h2m6-12v10a2 2 0 01-2 2h-2m-3 0v10"></path></svg>
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#95C2B4] mb-2">Tự động hóa sức khỏe của bạn</h2>
              <p className="text-white/80 text-xs md:text-sm leading-relaxed">
                Hãy để AI lên kế hoạch chi tiết cho cả tuần. Tiết kiệm thời gian, ăn ngon và đạt mục tiêu nhanh chóng.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* QUICK VIEW POPUP MODAL */}
      {selectedDish && (
        <QuickViewModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onAddToCart={addToCart}
          allergenAlert={allergenAlert}
        />
      )}
    </div>
  );
}
