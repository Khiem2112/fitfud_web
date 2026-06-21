import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { loginUser, registerUser, forgotPassword } from '../service/authService';
import authBanner from '../assets/auth_banner.png';

// Import organisms
import LoginForm from '../component/organism/Auth/LoginForm';
import RegisterForm from '../component/organism/Auth/RegisterForm';
import ForgotPasswordForm from '../component/organism/Auth/ForgotPasswordForm';

export default function Auth() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot'
  
  // Form states managed by react-hook-form inside child components
  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleLoginSubmit = async (data) => {
    resetMessages();
    setLoading(true);
    try {
      const res = await loginUser({ email: data.email, password_hash: data.password });
      login(res.user);
      if (res.user.has_surveyed) {
        navigate('/profile');
      } else {
        navigate('/survey');
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (data) => {
    resetMessages();
    setLoading(true);
    try {
      const res = await registerUser({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        password_hash: data.password
      });
      login(res.user);
      navigate('/survey'); // New user goes straight to AI body survey
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Email hoặc số điện thoại có thể đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (data) => {
    resetMessages();
    setLoading(true);
    try {
      const res = await forgotPassword({ email: data.email });
      setSuccess(res.message || 'Đã gửi yêu cầu khôi phục mật khẩu. Vui lòng kiểm tra email của bạn.');
      setTimeout(() => {
        setMode('login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Yêu cầu khôi phục thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex page-enter bg-bg-main font-sans">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-primary-dark overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-primary-dark/40 z-10 mix-blend-multiply"></div>
        <img 
          src={authBanner} 
          alt="Healthy Food Composition" 
          className="absolute inset-0 w-full h-full object-cover z-0" 
        />
        <div className="relative z-20 flex flex-col p-12 h-full justify-between text-white w-full">
          <div>
            <div 
              className="flex items-center gap-3 mb-16 cursor-pointer hover:opacity-90 transition" 
              onClick={() => navigate('/')}
            >
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md border border-white/20">
                <span className="text-2xl leading-none block">🌱</span>
              </div>
              <span className="text-3xl font-extrabold tracking-tight">FitFud</span>
            </div>
          </div>
          <div className="max-w-lg">
            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
              Ăn uống lành mạnh, <br/>
              <span className="text-accent">sống khỏe mỗi ngày.</span>
            </h2>
            <p className="text-lg opacity-90 leading-relaxed font-medium">
              Tham gia cùng hàng ngàn người dùng khác trong hành trình thay đổi thói quen dinh dưỡng và đạt được mục tiêu sức khỏe của bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[55%] flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2.5 cursor-pointer z-10" onClick={() => navigate('/')}>
          <div className="bg-primary/10 p-2 rounded-lg">
            <span className="text-xl leading-none block">🌱</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-primary-dark">FitFud</span>
        </div>

        <div className="w-full max-w-[420px] bg-transparent sm:bg-white sm:rounded-3xl sm:shadow-premium-lg sm:p-10 transition-all duration-300 mt-16 lg:mt-0">
          
          {/* Header Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-main mb-2">
              {mode === 'login' && 'Chào mừng quay trở lại'}
              {mode === 'register' && 'Tạo tài khoản mới'}
              {mode === 'forgot' && 'Quên mật khẩu?'}
            </h1>
            <p className="text-sm text-text-muted font-medium">
              {mode === 'login' && 'Vui lòng nhập thông tin để tiếp tục.'}
              {mode === 'register' && 'Bắt đầu hành trình dinh dưỡng của bạn ngay hôm nay.'}
              {mode === 'forgot' && 'Nhập email để nhận hướng dẫn khôi phục.'}
            </p>
          </div>

          {/* Status Alerts */}
          {error && (
            <div className="mb-6 rounded-xl bg-danger-light p-4 border border-danger/20 text-sm font-semibold text-danger flex items-start gap-3">
              <span className="text-lg leading-none mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-6 rounded-xl bg-primary-light/30 p-4 border border-primary/20 text-sm font-semibold text-primary-forest flex items-start gap-3">
              <span className="text-lg leading-none mt-0.5">✨</span>
              <span>{success}</span>
            </div>
          )}

          {/* LOGIN MODE */}
          {mode === 'login' && (
            <LoginForm 
              handleLoginSubmit={handleLoginSubmit}
              loading={loading}
              setMode={setMode}
              resetMessages={resetMessages}
            />
          )}

          {/* REGISTER MODE */}
          {mode === 'register' && (
            <RegisterForm 
              handleRegisterSubmit={handleRegisterSubmit}
              loading={loading}
              setMode={setMode}
              resetMessages={resetMessages}
            />
          )}

          {/* FORGOT MODE */}
          {mode === 'forgot' && (
            <ForgotPasswordForm 
              handleForgotSubmit={handleForgotSubmit}
              loading={loading}
              setMode={setMode}
              resetMessages={resetMessages}
            />
          )}

        </div>
        
        {/* Footer info (only visible on desktop bottom) */}
        <div className="hidden lg:block absolute bottom-8 text-center w-full text-xs text-text-light font-medium">
          © {new Date().getFullYear()} FitFud. Nền tảng dinh dưỡng thông minh.
        </div>
      </div>
    </div>
  );
}
