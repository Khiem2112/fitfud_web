import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { loginUser, registerUser, forgotPassword } from '../service/authService';
import authBanner from '../assets/auth_banner.png';
import logo from '../assets/fitfud-logo.png';

// Import organisms
import LoginForm from '../component/organism/Auth/LoginForm';
import RegisterForm from '../component/organism/Auth/RegisterForm';
import ForgotPasswordForm from '../component/organism/Auth/ForgotPasswordForm';

export default function Auth() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'forgot'
  
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
    <div className="min-h-screen flex page-enter bg-[#F5F6F5] font-sans overflow-hidden">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-dark overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-primary-dark/40 z-10 mix-blend-multiply"></div>
        <img 
          src={authBanner} 
          alt="Healthy Food Composition" 
          className="absolute inset-0 w-full h-full object-cover z-0" 
        />
        <div className="relative z-20 flex h-full w-full flex-col justify-end p-10 pb-14 text-white">
          <div className="max-w-xl">
            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-5">
              Ăn uống lành mạnh, <br/>
              <span className="text-accent">sống khỏe mỗi ngày.</span>
            </h2>
            <p className="text-base lg:text-lg opacity-90 leading-relaxed font-medium">
              Tham gia cùng hàng ngàn người dùng khác trong hành trình thay đổi thói quen dinh dưỡng và đạt được mục tiêu sức khỏe của bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className={`w-full lg:w-1/2 flex flex-col items-center p-6 sm:p-8 relative overflow-y-auto ${mode === 'register' ? 'justify-start lg:justify-center' : 'justify-center'}`}>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute left-6 top-6 z-20 inline-flex items-center gap-2 rounded-full border border-border-light bg-white/90 px-4 py-2 text-xs font-bold text-primary shadow-sm transition hover:bg-primary hover:text-white"
        >
          <i className="bi bi-arrow-left" aria-hidden="true" />
          Về trang chủ
        </button>

        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-6 right-6 flex items-center gap-2.5 cursor-pointer z-10" onClick={() => navigate('/')}>
          <img
            src={logo}
            alt="FitFud"
            className="h-10 w-auto max-w-[144px] object-contain"
          />
        </div>

        <div className={`w-full max-w-[420px] bg-transparent sm:bg-white sm:rounded-3xl sm:shadow-premium-lg transition-all duration-300 mt-20 lg:mt-0 ${mode === 'register' ? 'sm:p-7' : 'sm:p-9'}`}>
          
          {/* Header Title */}
          <div className={mode === 'register' ? 'mb-4' : 'mb-6'}>
            <h1 className={`${mode === 'register' ? 'text-xl' : 'text-2xl'} font-extrabold tracking-tight text-text-main mb-2`}>
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
              <i className="bi bi-exclamation-triangle text-lg leading-none mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-6 rounded-xl bg-primary-light/30 p-4 border border-primary/20 text-sm font-semibold text-primary-forest flex items-start gap-3">
              <i className="bi bi-stars text-lg leading-none mt-0.5" aria-hidden="true" />
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
              defaultValues={{
                fullName: searchParams.get('name') || '',
                phone: searchParams.get('phone') || '',
                email: searchParams.get('email') || ''
              }}
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
        <div className="hidden lg:block mt-4 text-center w-full text-xs text-text-light font-medium">
          © {new Date().getFullYear()} FitFud. Nền tảng dinh dưỡng thông minh.
        </div>
      </div>
    </div>
  );
}
