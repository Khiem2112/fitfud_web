import { z } from 'zod';

export const checkoutSchema = z.object({
  contact_name: z.string().min(1, 'Vui lòng nhập họ và tên'),
  contact_phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(11, 'Số điện thoại tối đa 11 số')
    .regex(/^[0-9]+$/, 'Số điện thoại không hợp lệ'),
  cityId: z.string().min(1, 'Vui lòng chọn Tỉnh/Thành phố'),
  districtId: z.string().min(1, 'Vui lòng chọn Quận/Huyện'),
  wardId: z.string().min(1, 'Vui lòng chọn Phường/Xã'),
  shipping_address: z.string().min(5, 'Vui lòng nhập địa chỉ chi tiết'),
  delivery_time: z.string().min(1, 'Vui lòng chọn thời gian giao hàng'),
  isDefaultAddress: z.boolean().optional().default(false),
  payment_method: z.enum(['COD', 'Online'], {
    errorMap: () => ({ message: 'Vui lòng chọn phương thức thanh toán' }),
  }),
  has_transferred: z.boolean().optional().default(false),
});
