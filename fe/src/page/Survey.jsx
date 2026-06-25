import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useApp } from '../context/AppContext';
import { submitSurvey, fetchSurveyMasterData } from '../service/surveyService';
import { useSurveyDraft } from '../hook/useSurveyDraft';
import { surveySchema } from '../schema/surveySchema';

import { HealthGoalForm } from '../component/organism/Survey/HealthGoalForm';
import { BodyMetricsForm } from '../component/organism/Survey/BodyMetricsForm';
import { AllergensForm } from '../component/organism/Survey/AllergensForm';
import { AIAnalyzerScreen } from '../component/organism/Survey/AIAnalyzerScreen';
import { SurveyStickyFooter } from '../component/molecule/Survey/SurveyStickyFooter';

import { useSurveyMasterData } from '../hook/useSurveyMasterData';

export default function Survey() {
  const { user, updateSurveyStatus } = useApp();
  const navigate = useNavigate();
  const { getDraftData, updateDraft, clearDraft } = useSurveyDraft();

  // Use React Query Hook
  const { data: masterData, isLoading } = useSurveyMasterData();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const [analyzing, setAnalyzing] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);

  const methods = useForm({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      health_goal: '',
      gender: '',
      age: '',
      height: '',
      weight: '',
      activity_level: '',
      allergyIds: [],
    },
    mode: 'onTouched'
  });

  // Initialize draft data
  useEffect(() => {
    const draft = getDraftData();
    if (draft && draft.formData) {
      Object.entries(draft.formData).forEach(([key, value]) => {
        methods.setValue(key, value, { shouldValidate: true });
      });
    }
  }, []);

  const handleSkipConfirm = () => {
    // Generate default profile and set has_surveyed to true
    updateSurveyStatus(true);
    clearDraft();
    navigate('/profile');
  };

  // Sync draft on change
  useEffect(() => {
    const subscription = methods.watch((value) => {
      if (!analyzing) {
        updateDraft(1, value);
      }
    });
    return () => subscription.unsubscribe();
  }, [methods.watch, updateDraft, analyzing]);

  const onSubmit = async (data) => {
    setAnalyzing(true);
    try {
      await submitSurvey(
        {
          health_goal: data.health_goal,
          gender: data.gender,
          age: Number(data.age),
          height: Number(data.height),
          weight: Number(data.weight),
          activity_level: data.activity_level,
          allergyIds: data.allergyIds,
        },
        user.id
      );
      updateSurveyStatus(true);
      clearDraft(); // Clear draft when successfully submitted
      setTimeout(() => {
        navigate('/profile');
      }, 4000);
    } catch (err) {
      alert('Đã xảy ra lỗi khi lưu khảo sát.');
      setAnalyzing(false);
    }
  };

  if (analyzing) {
    return <AIAnalyzerScreen />;
  }

  return (
    <div className="bg-[#FAFBFB] min-h-screen py-10 w-full">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 page-enter">

        {/* Progress Bar & Header Text */}
        <div className="mb-10 text-center relative pt-4">
          <h1 className="text-3xl font-extrabold text-primary mt-8 mb-3">Chào mừng bạn đến với FitFud</h1>
          <p className="text-sm text-text-muted">
            Hãy giúp chúng tôi hiểu rõ hơn về bạn để thiết kế một lộ trình dinh<br />dưỡng cá nhân hóa hoàn hảo.
          </p>
        </div>

        {/* Loading State for Master Data */}
        {!masterData ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-light border-t-primary"></div>
          </div>
        ) : (
          <FormProvider {...methods}>
            <form id="survey-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">

              <HealthGoalForm healthGoals={masterData.healthGoals} />
              <BodyMetricsForm activityLevels={masterData.activityLevels} />
              <AllergensForm allergies={masterData.allergies} />

              <SurveyStickyFooter
                onSkip={() => setShowSkipModal(true)}
                onFinish={methods.handleSubmit(onSubmit)}
                isSubmitting={analyzing}
              />

              <div className="h-24"></div>
            </form>
          </FormProvider>
        )}
      </div>

      {/* Skip Confirmation Modal */}
      {showSkipModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-premium text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-2xl text-danger">
              ⚠️
            </div>
            <h3 className="mb-2 text-lg font-extrabold text-text-main">Bỏ qua khảo sát?</h3>
            <p className="mb-6 text-sm text-text-muted">
              Nếu bỏ qua, FitFud sẽ thiết lập thông tin sức khỏe của bạn về mặc định. Bạn có chắc chắn muốn bỏ qua?
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleSkipConfirm}
                className="w-full rounded-xl bg-danger px-4 py-3 text-sm font-bold text-white transition hover:bg-danger/90"
              >
                Vẫn bỏ qua
              </button>
              <button
                type="button"
                onClick={() => setShowSkipModal(false)}
                className="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm font-bold text-text-main transition hover:bg-bg-main"
              >
                Quay lại làm khảo sát
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
