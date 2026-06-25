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
