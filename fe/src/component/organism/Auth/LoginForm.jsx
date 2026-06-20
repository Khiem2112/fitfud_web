import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Email không được để trống.').email('Email không đúng định dạng.'),
  password: z.string().min(1, 'Mật khẩu không được để trống.'),
});

export default function LoginForm({
  handleLoginSubmit,
  loading,
  setMode,
  resetMessages
}) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const inputClass = "w-full rounded-xl border border-border-light bg-bg-card px-4 py-3.5 text-sm text-text-main shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200";
  const labelClass = "block text-sm font-semibold text-text-main mb-1.5";
  const errorClass = "text-danger text-xs font-medium mt-1.5";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit(handleLoginSubmit)} noValidate className="space-y-5">
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            placeholder="ví dụ: fitfud@example.com"
            className={`${inputClass} ${errors.email ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
            {...register('email')}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className={labelClass + " mb-0"}>Mật khẩu</label>
            <button
              type="button"
              onClick={() => { resetMessages(); setMode('forgot'); }}
              className="text-sm text-primary hover:text-primary-dark font-bold transition-colors"
            >
              Quên mật khẩu?
            </button>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            className={`${inputClass} ${errors.password ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
            {...register('password')}
          />
          {errors.password && <p className={errorClass}>{errors.password.message}</p>}
        </div>

        <div className="flex items-center pt-1">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4.5 w-4.5 rounded border-border-light text-primary focus:ring-primary/20 transition-all cursor-pointer"
          />
          <label htmlFor="remember-me" className="ml-2.5 text-sm font-medium text-text-muted cursor-pointer select-none">
            Ghi nhớ tôi cho lần sau
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3.5 text-center text-sm font-bold text-white shadow-md hover:bg-primary-dark hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-light"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent sm:bg-white text-text-light font-medium">Hoặc tiếp tục với</span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button type="button" className="flex items-center justify-center w-full px-4 py-2.5 border border-border-light rounded-xl shadow-sm bg-white text-sm font-semibold text-text-main hover:bg-bg-main transition-colors">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button type="button" className="flex items-center justify-center w-full px-4 py-2.5 border border-border-light rounded-xl shadow-sm bg-white text-sm font-semibold text-text-main hover:bg-bg-main transition-colors">
            <svg className="h-5 w-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>
      </div>

      <div className="text-center mt-8">
        <span className="text-sm text-text-muted font-medium">
          Chưa có tài khoản?{' '}
          <button
            type="button"
            onClick={() => { resetMessages(); setMode('register'); }}
            className="text-primary font-bold hover:text-primary-dark transition-colors"
          >
            Đăng ký ngay
          </button>
        </span>
      </div>
    </div>
  );
}
