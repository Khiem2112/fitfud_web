import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const forgotSchema = z.object({
  email: z.string().min(1, 'Email không được để trống.').email('Email không đúng định dạng.'),
});

export default function ForgotPasswordForm({
  handleForgotSubmit,
  loading,
  setMode,
  resetMessages
}) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotSchema)
  });

  const inputClass = "w-full rounded-xl border border-border-light bg-bg-card px-4 py-3.5 text-sm text-text-main shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200";
  const labelClass = "block text-sm font-semibold text-text-main mb-1.5";
  const errorClass = "text-danger text-xs font-medium mt-1.5";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit(handleForgotSubmit)} noValidate className="space-y-6">
        <p className="text-sm text-text-muted leading-relaxed font-medium bg-bg-main p-4 rounded-xl">
          Đừng lo lắng! Hãy nhập email của bạn và chúng tôi sẽ gửi hướng dẫn thiết lập lại mật khẩu đến hộp thư của bạn ngay lập tức.
        </p>

        <div>
          <label className={labelClass}>Email đã đăng ký</label>
          <input
            type="email"
            placeholder="ví dụ: fitfud@example.com"
            className={`${inputClass} ${errors.email ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
            {...register('email')}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3.5 text-center text-sm font-bold text-white shadow-md hover:bg-primary-dark hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Đang gửi...' : 'Gửi yêu cầu khôi phục'}
        </button>
      </form>

      <div className="text-center mt-8">
        <button
          type="button"
          onClick={() => { resetMessages(); setMode('login'); }}
          className="text-sm text-primary font-bold hover:text-primary-dark flex items-center justify-center w-full gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Quay lại đăng nhập
        </button>
      </div>
    </div>
  );
}
