import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { loginUser, registerUser, forgotPassword } from '../service/authService';

export default function Auth() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot'
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email, password_hash: password });
      login(res.user);
      if (res.user.has_surveyed) {
        navigate('/profile');
      } else {
        navigate('/survey');
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    if (!agreeTerms) {
      setError('Bạn phải đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        full_name: fullName,
        email,
        phone,
        password_hash: password
      });
      login(res.user);
      navigate('/survey'); // New user goes straight to AI body survey
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!email) {
      setError('Vui lòng nhập địa chỉ email của bạn.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      setSuccess(res.message);
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
    <div className="mx-auto my-12 w-full max-w-md px-4 sm:px-6 page-enter">
      <div className="rounded-2xl border border-border-light bg-bg-card p-6 shadow-premium sm:p-8">
        
        {/* Toggle Title */}
        <div className="text-center mb-8">
          <span className="inline-block text-3xl mb-2">🌱</span>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">
            {mode === 'login' && 'Chào mừng quay trở lại!'}
            {mode === 'register' && 'Tạo tài khoản mới'}
            {mode === 'forgot' && 'Quên mật khẩu?'}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {mode === 'login' && 'Tham gia ăn uống lành mạnh cùng FitFud.'}
            {mode === 'register' && 'Bắt đầu hành trình dinh dưỡng cá nhân hóa.'}
            {mode === 'forgot' && 'Khôi phục năng lượng, khôi phục tài khoản.'}
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-4 rounded-lg bg-danger-light p-3.5 border border-danger/30 text-xs font-semibold text-danger text-center">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-primary-light p-3.5 border border-primary/30 text-xs font-semibold text-primary text-center">
            🎉 {success}
          </div>
        )}

        {/* LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-3 text-sm focus:border-primary focus:outline-none transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-text-main">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() => { resetMessages(); setMode('forgot'); }}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-3 text-sm focus:border-primary focus:outline-none transition"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-border-light text-primary focus:ring-primary"
              />
              <label htmlFor="remember-me" className="ml-2 text-xs font-medium text-text-muted">
                Ghi nhớ tôi cho các lần đăng nhập tiếp theo
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3.5 text-center text-sm font-bold text-white shadow-premium hover:bg-primary-dark transition disabled:opacity-50"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { resetMessages(); setMode('register'); }}
                className="text-xs text-text-muted font-medium"
              >
                Chưa có tài khoản? <span className="text-primary font-bold hover:underline">Đăng ký ngay</span>
              </button>
            </div>
          </form>
        )}

        {/* REGISTER MODE */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
                Họ và tên
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-3 text-sm focus:border-primary focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-3 text-sm focus:border-primary focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
                Số điện thoại
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0901234567"
                className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-3 text-sm focus:border-primary focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-3 text-sm focus:border-primary focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-3 text-sm focus:border-primary focus:outline-none transition"
              />
            </div>

            <div className="flex items-start">
              <input
                id="agree-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 rounded border-border-light text-primary focus:ring-primary mt-0.5"
              />
              <label htmlFor="agree-terms" className="ml-2 text-xs font-medium text-text-muted leading-tight">
                Tôi đồng ý với các Điều khoản dịch vụ và Chính sách bảo mật của FitFud.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3.5 text-center text-sm font-bold text-white shadow-premium hover:bg-primary-dark transition disabled:opacity-50"
            >
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { resetMessages(); setMode('login'); }}
                className="text-xs text-text-muted font-medium"
              >
                Đã có tài khoản? <span className="text-primary font-bold hover:underline">Đăng nhập ngay</span>
              </button>
            </div>
          </form>
        )}

        {/* FORGOT MODE */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-5">
            <p className="text-xs text-text-muted leading-relaxed">
              Đừng lo lắng! Hãy nhập email của bạn và chúng tôi sẽ gửi mật khẩu mới đến hộp thư của bạn ngay lập tức.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
                Email của bạn
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-3 text-sm focus:border-primary focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3.5 text-center text-sm font-bold text-white shadow-premium hover:bg-primary-dark transition disabled:opacity-50"
            >
              {loading ? 'Đang gửi...' : 'Gửi mật khẩu'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { resetMessages(); setMode('login'); }}
                className="text-xs text-primary font-bold hover:underline"
              >
                Quay lại Đăng nhập
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
