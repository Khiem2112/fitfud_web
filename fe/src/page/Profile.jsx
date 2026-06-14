import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getProfileDashboard, logMeal, analyzeMealImage, getMealLogs } from '../service/profileService';
import { getSavedAddresses } from '../service/checkoutService';
import { mockMasterData } from '../service/menuService';

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
  const [addresses, setAddresses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Meal logging states
  const [logMode, setLogMode] = useState('fitfud'); // 'fitfud', 'manual', 'ai'
  const [searchDish, setSearchDish] = useState('');
  const [selectedDishId, setSelectedDishId] = useState('');
  
  // Manual log inputs
  const [manualName, setManualName] = useState('');
  const [manualCal, setManualCal] = useState('');
  const [manualPro, setManualPro] = useState('');

  // AI photo scanner states
  const [aiImage, setAiImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);

  const loadDashboardData = async () => {
    if (user) {
      try {
        const data = await getProfileDashboard(user.id, user.full_name);
        setDashboardData(data);
        const addrs = await getSavedAddresses(user.id);
        setAddresses(addrs);
        const mealLogs = getMealLogs(user.id);
        setLogs(mealLogs);
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

  const handleManualLogSubmit = async (e) => {
    e.preventDefault();
    if (!manualName || !manualCal || !manualPro) {
      alert('Vui lòng điền đầy đủ các chỉ số dinh dưỡng.');
      return;
    }

    try {
      await logMeal(user.id, {
        dish_name: manualName,
        calories: Number(manualCal),
        protein: Number(manualPro)
      });
      // Reset form & reload
      setManualName('');
      setManualCal('');
      setManualPro('');
      loadDashboardData();
      alert('Đã thêm bữa ăn vào nhật ký!');
    } catch (err) {
      alert('Không thể ghi nhận bữa ăn.');
    }
  };

  const handleFitFudLogSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDishId) return;

    // Resolve dish details
    const matchedDish = mockMasterData.categories
      .map(() => {
        // Look up in our mockDishes
        // (For simplicity we know mockDishes from menuService, let's hardcode lookup details)
        const match = [
          { id: 'dish_1', name: 'Cơm cá hồi áp chảo', cal: 542, pro: 35 },
          { id: 'dish_2', name: 'Cơm gà gạo lứt', cal: 420, pro: 32 },
          { id: 'dish_3', name: 'Bò áp chảo khoai lang', cal: 480, pro: 35 },
          { id: 'dish_5', name: 'Salmon Poke Bowl', cal: 450, pro: 28 },
          { id: 'dish_6', name: 'Buddha Veggie Bowl', cal: 380, pro: 16 },
          { id: 'dish_7', name: 'Nước ép xanh thanh lọc', cal: 120, pro: 3 }
        ].find((d) => d.id === selectedDishId);
        return match;
      })
      .filter(Boolean)[0];

    if (!matchedDish) return;

    try {
      await logMeal(user.id, {
        dish_name: matchedDish.name,
        calories: matchedDish.cal,
        protein: matchedDish.pro
      });
      setSelectedDishId('');
      loadDashboardData();
      alert('Đã ghi nhận món ăn vào nhật ký dinh dưỡng!');
    } catch (err) {
      alert('Ghi nhận thất bại.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAiImage(file);
      setScannedResult(null);
    }
  };

  const handleStartAIScan = async () => {
    if (!aiImage) return;
    setScanning(true);
    setScannedResult(null);

    try {
      const res = await analyzeMealImage(aiImage);
      setScannedResult(res);
    } catch (err) {
      alert('AI không thể nhận diện được hình ảnh này.');
    } finally {
      setScanning(false);
    }
  };

  const handleSaveAIScannedLog = async () => {
    if (!scannedResult) return;
    try {
      await logMeal(user.id, scannedResult);
      setAiImage(null);
      setScannedResult(null);
      loadDashboardData();
      alert('Đã lưu kết quả phân tích AI vào nhật ký dinh dưỡng!');
    } catch (err) {
      alert('Lưu thất bại.');
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-light border-t-primary"></div>
      </div>
    );
  }

  // Circular progress calculations for Target Calories
  const caloriesPercent = Math.min(
    100,
    Math.round((dashboardData.today_calories_logged / dashboardData.target_calories) * 100)
  );
  const proteinPercent = Math.min(
    100,
    Math.round((dashboardData.today_protein_logged / dashboardData.target_protein) * 100)
  );

  // SVG Circle stroke dash calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (caloriesPercent / 100) * circumference;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 page-enter space-y-8">
      
      {/* Profile Header Card */}
      <div className="rounded-3xl border border-border-light bg-bg-card p-6 shadow-premium flex flex-col sm:flex-row items-center sm:justify-between gap-6">
        <div className="flex items-center gap-4 flex-col sm:flex-row text-center sm:text-left">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-primary">
            👤
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-text-main">{dashboardData.fullName}</h1>
            <p className="text-xs text-text-muted mt-0.5">Thành viên năng động FitFud</p>
            <div className="flex gap-2 mt-2 justify-center sm:justify-start">
              <span className="rounded bg-primary-light px-2 py-0.5 text-[9px] font-bold text-primary uppercase">
                BMI: {dashboardData.bmi}
              </span>
              <span className="rounded bg-accent/10 px-2 py-0.5 text-[9px] font-bold text-accent-dark uppercase">
                TDEE: {dashboardData.tdee} kcal
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/survey')}
            className="rounded-xl border border-border-light bg-bg-card px-4 py-2.5 text-xs font-bold text-text-main hover:bg-bg-main transition"
          >
            Cập nhật mục tiêu
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/auth');
            }}
            className="rounded-xl bg-danger-light border border-danger/10 px-4 py-2.5 text-xs font-bold text-danger hover:bg-danger hover:text-white transition"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* DAILY PROGRESS RING TRACKER & WEEKLY CHART (Left/Middle) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Daily Circular Target Progress Ring */}
          <div className="bg-bg-card border border-border-light rounded-3xl p-6 shadow-premium grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            
            {/* SVG Ring circle */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">Mục tiêu hằng ngày</span>
              <div className="relative flex items-center justify-center">
                <svg className="h-40 w-40 transform -rotate-90">
                  {/* Background Track circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="var(--border-light)"
                    strokeWidth="10"
                  />
                  {/* Fill circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="var(--primary-base)"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute text-center">
                  <span className="block text-2xl font-extrabold text-text-main">
                    {dashboardData.today_calories_logged.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-text-muted block">/ {dashboardData.target_calories} Kcal</span>
                  <span className="text-[10px] font-bold text-primary block mt-0.5">{caloriesPercent}% Hoàn thành</span>
                </div>
              </div>
            </div>

            {/* Protein bar progress */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-text-main mb-1.5">
                  <span>💪 ĐẠM (PROTEIN)</span>
                  <span className="text-primary">{proteinPercent}%</span>
                </div>
                {/* Horizontal bar */}
                <div className="w-full bg-border-light h-3 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${proteinPercent}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-text-muted mt-1 font-medium">
                  <span>Đã nạp: {dashboardData.today_protein_logged}g</span>
                  <span>Mục tiêu: {dashboardData.target_protein}g</span>
                </div>
              </div>

              {/* Body indicators specs summary */}
              <div className="pt-4 border-t border-border-light grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-text-muted block">CÂN NẶNG</span>
                  <span className="font-extrabold text-text-main text-sm">{dashboardData.weight} kg</span>
                </div>
                <div>
                  <span className="text-text-muted block">CHIỀU CAO</span>
                  <span className="font-extrabold text-text-main text-sm">{dashboardData.height} cm</span>
                </div>
              </div>
            </div>

          </div>

          {/* Weekly intake trend Chart */}
          <div className="bg-bg-card border border-border-light rounded-3xl p-6 shadow-premium space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-main">Lịch sử dinh dưỡng (7 ngày qua)</h3>
              <p className="text-[11px] text-text-muted">So sánh calo nạp hằng ngày</p>
            </div>

            {/* Custom Responsive HTML/CSS Chart bars */}
            <div className="flex justify-between items-end h-44 pt-4 px-2 border-b border-border-light">
              {dashboardData.weekly_trend.map((t) => {
                const heightPercent = Math.min(100, Math.round((t.calories / 2000) * 100));
                return (
                  <div key={t.day} className="flex flex-col items-center gap-2 flex-1 group">
                    {/* Hover tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition absolute bg-text-main text-white text-[9px] px-1.5 py-0.5 rounded -translate-y-8 font-bold shadow-md">
                      {t.calories} kcal
                    </div>
                    {/* Bar visual */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-5 bg-primary-light hover:bg-primary rounded-t-md transition-all duration-500 ease-out shadow-sm"
                    ></div>
                    {/* Label */}
                    <span className="text-[10px] text-text-muted font-bold">{t.day}</span>
                  </div>
                );
              })}
            </div>
            
            {/* AI comment block */}
            <p className="text-xs text-text-muted italic bg-primary-light/40 border border-primary-light/50 rounded-xl p-3 text-center">
              “Bạn đang duy trì thói quen ăn uống rất tốt! Chỉ số protein trung bình cao hơn 15% so với tuần trước.”
            </p>
          </div>

        </div>

        {/* MEAL LOG PANEL & SAVE ADDRESSES (Right) */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Meal log recorder panel */}
          <div className="bg-bg-card border border-border-light rounded-3xl p-6 shadow-premium space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-main border-b border-border-light pb-3">
              Nhật ký bữa ăn
            </h2>

            {/* Mode toggle */}
            <div className="grid grid-cols-3 gap-1.5 bg-bg-main p-1 rounded-xl border border-border-light text-[10px] font-bold text-center">
              <button
                onClick={() => setLogMode('fitfud')}
                className={`rounded-lg py-2 transition ${
                  logMode === 'fitfud' ? 'bg-bg-card text-primary shadow-sm' : 'text-text-muted hover:text-text-main'
                }`}
              >
                Món FitFud
              </button>
              <button
                onClick={() => setLogMode('manual')}
                className={`rounded-lg py-2 transition ${
                  logMode === 'manual' ? 'bg-bg-card text-primary shadow-sm' : 'text-text-muted hover:text-text-main'
                }`}
              >
                Nhập tay
              </button>
              <button
                onClick={() => setLogMode('ai')}
                className={`rounded-lg py-2 transition ${
                  logMode === 'ai' ? 'bg-bg-card text-primary shadow-sm' : 'text-text-muted hover:text-text-main'
                }`}
              >
                📸 Quét AI
              </button>
            </div>

            {/* MODE 1: FITFUD DISH LIST LOGGER */}
            {logMode === 'fitfud' && (
              <form onSubmit={handleFitFudLogSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-main mb-1">
                    Chọn món ăn sức khỏe
                  </label>
                  <select
                    value={selectedDishId}
                    onChange={(e) => setSelectedDishId(e.target.value)}
                    className="w-full rounded-xl border border-border-light bg-bg-main px-3 py-2.5 text-xs focus:outline-none transition"
                  >
                    <option value="">-- Click để chọn món --</option>
                    <option value="dish_1">Cơm cá hồi áp chảo (542 kcal)</option>
                    <option value="dish_2">Cơm gà gạo lứt (420 kcal)</option>
                    <option value="dish_3">Bò áp chảo khoai lang (480 kcal)</option>
                    <option value="dish_5">Salmon Poke Bowl (450 kcal)</option>
                    <option value="dish_6">Buddha Veggie Bowl (380 kcal)</option>
                    <option value="dish_7">Nước ép xanh thanh lọc (120 kcal)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={!selectedDishId}
                  className="w-full rounded-xl bg-primary py-2.5 text-center text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition disabled:opacity-50"
                >
                  Ghi nhận bữa ăn
                </button>
              </form>
            )}

            {/* MODE 2: MANUAL LOG FORM */}
            {logMode === 'manual' && (
              <form onSubmit={handleManualLogSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-main mb-1">
                    Tên món ăn tự chuẩn bị
                  </label>
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Ví dụ: Phở gà, Cơm sườn tấm..."
                    className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-main mb-1">
                      Calo (kcal)
                    </label>
                    <input
                      type="number"
                      value={manualCal}
                      onChange={(e) => setManualCal(e.target.value)}
                      placeholder="Calo"
                      className="w-full rounded-xl border border-border-light bg-bg-main px-3 py-2 text-xs text-center focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-main mb-1">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      value={manualPro}
                      onChange={(e) => setManualPro(e.target.value)}
                      placeholder="Protein"
                      className="w-full rounded-xl border border-border-light bg-bg-main px-3 py-2 text-xs text-center focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary py-2.5 text-center text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition pt-2"
                >
                  Thêm bữa ăn thủ công
                </button>
              </form>
            )}

            {/* MODE 3: MOCK AI PHOTO SCANNER */}
            {logMode === 'ai' && (
              <div className="space-y-4 text-xs">
                <div className="border-2 border-dashed border-border-light rounded-2xl p-4 text-center bg-bg-main flex flex-col items-center justify-center gap-2">
                  <span className="text-3xl">📷</span>
                  <label className="cursor-pointer bg-primary text-white font-bold rounded-lg px-4 py-1.5 text-[10px] hover:bg-primary-dark transition">
                    Tải ảnh bữa ăn lên
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <p className="text-[10px] text-text-muted leading-tight">
                    {aiImage ? `Ảnh đã chọn: ${aiImage.name}` : 'AI sẽ tự động nhận diện Calo và Protein từ đĩa thức ăn của bạn'}
                  </p>
                </div>

                {aiImage && !scannedResult && (
                  <button
                    onClick={handleStartAIScan}
                    disabled={scanning}
                    className="w-full rounded-xl bg-primary py-2.5 text-center text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition disabled:opacity-50"
                  >
                    {scanning ? '🧬 AI đang nhận diện đĩa thức ăn...' : 'Quét và nhận diện ảnh'}
                  </button>
                )}

                {/* Simulated AI prediction results */}
                {scannedResult && (
                  <div className="rounded-xl border border-primary/20 bg-primary-light/30 p-3 space-y-3">
                    <p className="text-[10px] font-bold text-primary uppercase">Kết quả nhận diện AI</p>
                    <div className="text-xs space-y-1">
                      <p>Món: <span className="font-bold text-text-main">{scannedResult.dish_name}</span></p>
                      <p>Lượng calo: <span className="font-bold text-text-main">{scannedResult.calories} kcal</span></p>
                      <p>Lượng đạm: <span className="font-bold text-primary">{scannedResult.protein}g Protein</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setAiImage(null); setScannedResult(null); }}
                        className="w-full rounded-lg border bg-bg-card py-1.5 text-[10px] font-bold text-text-muted hover:bg-bg-main transition"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSaveAIScannedLog}
                        className="w-full rounded-lg bg-primary py-1.5 text-[10px] font-bold text-white shadow-sm hover:bg-primary-dark transition"
                      >
                        Lưu vào nhật ký
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* List of today logged meals */}
            <div className="pt-4 border-t border-border-light space-y-3">
              <h4 className="text-xs font-bold text-text-main uppercase tracking-wider">Món ăn đã nạp hôm nay:</h4>
              {logs.length === 0 ? (
                <p className="text-[10px] text-text-muted italic text-center">Chưa ghi nhận bữa ăn nào hôm nay.</p>
              ) : (
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {logs.map((log) => (
                    <div key={log.id} className="flex justify-between items-center text-xs bg-bg-main p-2 rounded-lg border border-border-light">
                      <div>
                        <p className="font-bold text-text-main">{log.dish_name}</p>
                        <p className="text-[9px] text-text-muted">Vừa xong</p>
                      </div>
                      <div className="text-right text-[10px]">
                        <span className="font-bold text-text-main block">{log.calories} kcal</span>
                        <span className="text-primary font-bold block">{log.protein}g Pro</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Saved Addresses Panel */}
          <div className="bg-bg-card border border-border-light rounded-3xl p-6 shadow-premium space-y-4">
            <div className="flex items-center justify-between border-b border-border-light pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-main">Địa chỉ giao hàng</h3>
            </div>
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="border border-border-light rounded-xl p-4 bg-bg-main relative">
                  {addr.isDefault && (
                    <span className="absolute top-3 right-4 rounded bg-primary text-[8px] font-extrabold text-white px-1.5 py-0.5 uppercase tracking-widest">
                      Mặc định
                    </span>
                  )}
                  <p className="font-bold text-xs text-text-main">{addr.name}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{addr.phone}</p>
                  <p className="text-xs text-text-muted leading-relaxed mt-2">
                    {addr.shipping_address_text}, {addr.wardName}, {addr.districtName}, {addr.cityName}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
