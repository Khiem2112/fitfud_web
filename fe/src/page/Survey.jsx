import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { submitSurvey } from '../service/surveyService';
import { mockMasterData } from '../service/menuService';

export default function Survey() {
  const { user, updateSurveyStatus } = useApp();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const [step, setStep] = useState(1); // 1: Goals, 2: Metrics, 3: Allergies
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  // Form state
  const [healthGoal, setHealthGoal] = useState('Muscle Gain');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('Moderately Active');
  const [allergyIds, setAllergyIds] = useState([]);
  const [cuisinePreference, setCuisinePreference] = useState('Chế độ Eat Clean');

  const loadingSteps = [
    'Phân tích hồ sơ sức khỏe...',
    'Tính toán định mức Calo & Macro dinh dưỡng...',
    'Lọc các món ăn phù hợp khẩu vị Việt...',
    'Xây dựng lộ trình thực đơn đề xuất...',
    'Sẵn sàng!'
  ];

  // Animate loading text index during AI analysis
  useEffect(() => {
    let timer;
    if (analyzing) {
      timer = setInterval(() => {
        setLoadingTextIndex((prev) => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          clearInterval(timer);
          return prev;
        });
      }, 800);
    }
    return () => clearInterval(timer);
  }, [analyzing]);

  const handleAllergyToggle = (id) => {
    setAllergyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNextStep = () => {
    if (step === 2) {
      if (!age || !height || !weight) {
        alert('Vui lòng điền đầy đủ các chỉ số cơ thể.');
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSkip = () => {
    navigate('/');
  };

  const handleSubmit = async () => {
    setAnalyzing(true);
    try {
      await submitSurvey(
        {
          health_goal: healthGoal,
          gender,
          age: Number(age) || 25,
          height: Number(height) || 170,
          weight: Number(weight) || 65,
          activity_level: activityLevel,
          allergyIds,
          cuisine_preference: cuisinePreference
        },
        user.id
      );
      updateSurveyStatus(true);
      setTimeout(() => {
        navigate('/profile');
      }, 4000);
    } catch (err) {
      alert('Đã xảy ra lỗi khi lưu khảo sát.');
      setAnalyzing(false);
    }
  };

  if (analyzing) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 page-enter">
        <div className="relative mb-8">
          <div className="h-20 w-20 animate-spin rounded-full border-4 border-primary-light border-t-primary"></div>
          <span className="absolute inset-0 flex items-center justify-center text-3xl">🌱</span>
        </div>
        <h2 className="text-xl font-bold text-text-main mb-2">FitFud đang tạo thực đơn cho riêng bạn...</h2>
        <p className="text-sm text-text-muted max-w-sm mb-6">
          AI của chúng tôi đang tính toán tỉ lệ dinh dưỡng dựa trên chỉ số cơ thể của bạn.
        </p>

        {/* Dynamic loading process details */}
        <div className="w-full max-w-xs bg-bg-card border border-border-light rounded-2xl p-4 shadow-premium text-left">
          <p className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">Premium Nutrition Engine</p>
          <div className="space-y-2">
            {loadingSteps.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className={idx <= loadingTextIndex ? 'text-primary font-bold' : 'text-text-muted'}>
                  {idx < loadingTextIndex ? '✓' : idx === loadingTextIndex ? '⊙' : '○'}
                </span>
                <span className={idx === loadingTextIndex ? 'text-text-main font-semibold' : 'text-text-muted'}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto my-12 w-full max-w-2xl px-4 sm:px-6 page-enter">
      <div className="rounded-2xl border border-border-light bg-bg-card p-6 shadow-premium sm:p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-border-light pb-4 mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-text-main">Chào mừng bạn đến với FitFud</h1>
            <p className="text-xs text-text-muted mt-0.5">Bước {step}/3 khảo sát dinh dưỡng</p>
          </div>
          <button onClick={handleSkip} className="text-xs font-semibold text-text-muted hover:text-primary transition">
            Bỏ qua & khám phá thực đơn
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="w-full bg-border-light h-1 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        {/* STEP 1: HEALTH GOAL */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold text-text-main mb-1">Mục tiêu sức khỏe của bạn là gì?</h2>
            <p className="text-xs text-text-muted mb-6">
              Chúng tôi sẽ thiết kế và cân bằng lượng calo thâm hụt dựa trên lựa chọn này.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { val: 'Weight Loss', label: '📉 Giảm cân khoa học', desc: 'Tập trung thâm hụt calo, duy trì đạm bảo vệ cơ bắp.' },
                { val: 'Muscle Gain', label: '💪 Tăng cơ bắp (Bulking)', desc: 'Dư thừa calo nhẹ, tối ưu lượng Protein xây dựng cơ.' },
                { val: 'Eat Clean', label: '🥗 Ăn sạch sống khỏe', desc: 'Cân bằng vi chất, sử dụng thực phẩm nguyên bản, lành mạnh.' },
                { val: 'Calorie Control', label: '⚖️ Kiểm soát năng lượng', desc: 'Duy trì vóc dáng lý tưởng và năng lượng ổn định.' },
                { val: 'Convenience', label: '⚡ Tiện lợi / Tiết kiệm', desc: 'Bữa ăn nhanh gọn, giao nóng, giàu dinh dưỡng.' }
              ].map((g) => (
                <div
                  key={g.val}
                  onClick={() => setHealthGoal(g.val)}
                  className={`cursor-pointer rounded-2xl border-2 p-4 transition-all hover:shadow-premium ${
                    healthGoal === g.val
                      ? 'border-primary bg-primary-light/40 shadow-sm'
                      : 'border-border-light bg-bg-card'
                  }`}
                >
                  <p className="font-bold text-sm text-text-main">{g.label}</p>
                  <p className="text-xs text-text-muted mt-1 leading-normal">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: BODY METRICS */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold text-text-main mb-1">Chỉ số cơ thể & Vận động</h2>
            <p className="text-xs text-text-muted mb-6">
              Để thuật toán AI tính toán chính xác nhu cầu TDEE và định mức đạm hằng ngày của bạn.
            </p>

            <div className="space-y-5">
              {/* Gender */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-2">
                  Giới tính sinh học
                </label>
                <div className="flex gap-4">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={gender === g}
                        onChange={() => setGender(g)}
                        className="h-4 w-4 border-border-light text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-semibold text-text-main">
                        {g === 'Male' ? 'Nam' : g === 'Female' ? 'Nữ' : 'Khác'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Age, Height, Weight */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
                    Tuổi
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="ví dụ: 25"
                    className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
                    Chiều cao (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="ví dụ: 175"
                    className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
                    Cân nặng (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="ví dụ: 68"
                    className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-2">
                  Cường độ vận động hằng tuần
                </label>
                <div className="space-y-2.5">
                  {[
                    { val: 'Sedentary', label: '🛋️ Ít vận động', desc: 'Chủ yếu ngồi làm việc văn phòng, rất ít đi lại, không tập luyện.' },
                    { val: 'Lightly Active', label: '🚶 Vận động nhẹ', desc: 'Có đi bộ nhẹ hoặc tập luyện nhẹ nhàng 1 - 2 buổi/tuần.' },
                    { val: 'Moderately Active', label: '🏃 Vận động vừa phải', desc: 'Đi lại nhiều, tập luyện thể thao đều đặn 3 - 4 buổi/tuần.' },
                    { val: 'Very Active', label: '🏋️ Vận động nhiều', desc: 'Tập gym cường độ cao 5 - 6 buổi/tuần, năng động.' },
                    { val: 'Extra Active', label: '⚡ Vận động rất nhiều', desc: 'Vận động viên hoặc tập nặng 2 buổi/ngày, lao động thể chất nặng.' }
                  ].map((act) => (
                    <div
                      key={act.val}
                      onClick={() => setActivityLevel(act.val)}
                      className={`cursor-pointer rounded-xl border p-3 flex justify-between items-center transition ${
                        activityLevel === act.val
                          ? 'border-primary bg-primary-light/30'
                          : 'border-border-light hover:bg-bg-main/50'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-xs text-text-main">{act.label}</p>
                        <p className="text-[11px] text-text-muted mt-0.5 leading-normal">{act.desc}</p>
                      </div>
                      <input
                        type="radio"
                        checked={activityLevel === act.val}
                        readOnly
                        className="h-4 w-4 border-border-light text-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ALLERGIES & PREFERENCES */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-bold text-text-main mb-1">Dị ứng cần loại trừ & Sở thích</h2>
            <p className="text-xs text-text-muted mb-6">
              An toàn của bạn là ưu tiên hàng đầu của FitFud. Các món chứa thành phần gây dị ứng sẽ bị lọc bỏ hoặc cảnh báo mạnh mẽ.
            </p>

            <div className="space-y-6">
              {/* Allergies list */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-3">
                  Chọn các thành phần gây dị ứng cho bạn
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {mockMasterData.allergies.map((allergy) => {
                    const isSelected = allergyIds.includes(allergy.id);
                    return (
                      <button
                        key={allergy.id}
                        type="button"
                        onClick={() => handleAllergyToggle(allergy.id)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold border transition ${
                          isSelected
                            ? 'bg-danger/10 border-danger text-danger'
                            : 'bg-bg-card border-border-light text-text-muted hover:border-primary hover:text-primary'
                        }`}
                      >
                        {isSelected ? '❌' : '＋'} {allergy.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cuisine Preferences */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-3">
                  Phong cách ẩm thực ưa thích
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Chế độ Eat Clean', 'Truyền thống Việt', 'Phong cách Âu', 'Thuần chay (Vegan)'].map((p) => (
                    <div
                      key={p}
                      onClick={() => setCuisinePreference(p)}
                      className={`cursor-pointer rounded-xl border p-3 text-center text-xs font-bold transition ${
                        cuisinePreference === p
                          ? 'border-primary bg-primary-light/40 text-primary'
                          : 'border-border-light hover:bg-bg-main/50 text-text-main'
                      }`}
                    >
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div className="mt-8 flex justify-between gap-4 border-t border-border-light pt-6">
          {step > 1 ? (
            <button
              onClick={handlePrevStep}
              className="rounded-xl border border-border-light bg-bg-card px-6 py-3 text-sm font-bold text-text-main hover:bg-bg-main transition"
            >
              Quay lại
            </button>
          ) : (
            <div></div> /* Placeholder for spacing */
          )}

          {step < 3 ? (
            <button
              onClick={handleNextStep}
              className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-premium hover:bg-primary-dark transition"
            >
              Tiếp tục
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-premium hover:bg-primary-dark transition"
            >
              Hoàn tất & Phân tích AI
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
