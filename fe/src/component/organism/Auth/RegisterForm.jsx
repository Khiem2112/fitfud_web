import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const registerSchema = z.object({
  fullName: z.string().min(1, 'Họ và tên không được để trống.'),
  email: z.string().min(1, 'Email không được để trống.').email('Email không đúng định dạng.'),
  phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ.'),
  password: z.string().min(6, 'Mật khẩu phải chứa ít nhất 6 ký tự.'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu.'),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: 'Bạn phải đồng ý với Điều khoản dịch vụ.' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp.",
  path: ["confirmPassword"],
});

export default function RegisterForm({
  handleRegisterSubmit,
  loading,
  setMode,
  resetMessages
}) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const inputClass = "w-full rounded-xl border border-border-light bg-bg-card px-4 py-3.5 text-sm text-text-main shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200";
  const labelClass = "block text-sm font-semibold text-text-main mb-1.5";
  const errorClass = "text-danger text-xs font-medium mt-1.5";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit(handleRegisterSubmit)} noValidate className="space-y-4">
        <div>
          <label className={labelClass}>Họ và tên</label>
          <input
            type="text"
            placeholder="Nguyễn Văn A"
            className={`${inputClass} ${errors.fullName ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
            {...register('fullName')}
          />
          {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
        </div>

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
          <label className={labelClass}>Số điện thoại</label>
          <input
            type="text"
            placeholder="0901234567"
            className={`${inputClass} ${errors.phone ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
            {...register('phone')}
          />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              className={`${inputClass} ${errors.password ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
              {...register('password')}
            />
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Xác nhận</label>
            <input
              type="password"
              placeholder="••••••••"
              className={`${inputClass} ${errors.confirmPassword ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <div className="pt-2 pb-1">
          <div className="flex items-start">
            <input
              id="agree-terms"
              type="checkbox"
              className="h-4.5 w-4.5 rounded border-border-light text-primary focus:ring-primary/20 transition-all cursor-pointer mt-0.5"
              {...register('agreeTerms')}
            />
            <label htmlFor="agree-terms" className="ml-2.5 text-sm font-medium text-text-muted cursor-pointer select-none leading-relaxed">
              Tôi đồng ý với <span className="text-primary font-bold hover:underline">Điều khoản dịch vụ</span> và <span className="text-primary font-bold hover:underline">Chính sách bảo mật</span> của FitFud.
            </label>
          </div>
          {errors.agreeTerms && <p className={errorClass}>{errors.agreeTerms.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3.5 text-center text-sm font-bold text-white shadow-md hover:bg-primary-dark hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
        </button>
      </form>

      <div className="text-center mt-8">
        <span className="text-sm text-text-muted font-medium">
          Đã có tài khoản?{' '}
          <button
            type="button"
            onClick={() => { resetMessages(); setMode('login'); }}
            className="text-primary font-bold hover:text-primary-dark transition-colors"
          >
            Đăng nhập ngay
          </button>
        </span>
      </div>
    </div>
  );
}
