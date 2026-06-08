# Quy tắc Kiến trúc và Thói quen Lập trình (Architecture Rules & Habits)

## Quy tắc Cốt lõi (Core Guardrails)
* **NÊN** định nghĩa màu sắc bằng các biến CSS (CSS variables) và ánh xạ chúng vào các biến theme của Tailwind v4 (sử dụng `@theme`) trong file stylesheet toàn cục. **KHÔNG NÊN** gán cứng (hardcode) giá trị theme trực tiếp vào các utility class của Tailwind (ví dụ: `text-[#ff0000]`).* **NÊN** luôn thực hiện tìm kiếm file (ví dụ: trong `src/components/`) để tìm và tái sử dụng các component đã có trước khi viết code. **KHÔNG NÊN** mù quáng tạo component mới mà không kiểm tra các component tương đương đã tồn tại.
* **NÊN** viết các UI component trong file `.jsx` hoặc `.tsx` và các logic service độc quyền trong file `.ts`. **KHÔNG NÊN** trộn lẫn logic UI và service trong cùng một định dạng file.
* **NÊN** trích xuất toàn bộ định nghĩa input/output của service và props của UI component vào một file `[name].types.ts` riêng biệt, đặt trong thư mục `types/`. **KHÔNG NÊN** định nghĩa type trong cùng một file chứa logic UI hoặc service.
* **NÊN** ủy quyền toàn bộ việc gọi dữ liệu (data fetching) cho tầng service. **KHÔNG NÊN** gọi API trực tiếp (ví dụ: `fetch()`, `axios`) từ bên trong các UI component.
* **NÊN** sử dụng bí danh `type` và tận dụng các toán tử union (`|`) và intersection (`&`) để tạo ra các kiểu dữ liệu linh hoạt. **KHÔNG NÊN** sử dụng khai báo `interface`.

---

## Tiêu chuẩn Triển khai Code (Code Implementation Standards)
* **NÊN** ánh xạ các biến toàn cục vào Tailwind trong CSS, và áp dụng chúng thông qua các utility class trong JSX/TSX. **KHÔNG NÊN** trộn lẫn inline styling với các giá trị tiện ích được gán cứng.

```css
/* 📄 global.css */
:root {
  --primary-base: #ff5733;
}

@theme {
  --color-primary: var(--primary-base);
}
```
### Kiến trúc 3-File và Cú pháp Type
FILE 1: types/[name].types.ts
```jsx
// ❌ KHÔNG NÊN: Sử dụng interface
// interface GetUserReq { id: string; }

// ✅ NÊN: Sử dụng type kết hợp intersection (&) và union (|)
export type GetUserReq = { id: string };
export type BaseUser = { name: string };
export type GetUserRes = BaseUser & { lastLogin?: string }; // Intersection
export type UserProfileProps = { userId: string } | { username: string }; // Union

```

📄 FILE 2: [name]Service.ts
```jsx
import { GetUserReq, GetUserRes } from './types/[name].types';

// ✅ NÊN: Xử lý toàn bộ logic gọi API (fetch) tại đây
export const getUser = async (req: GetUserReq): Promise<GetUserRes> => {
  const res = await fetch(`/api/users/${req.id}`);
  return res.json();
};
```

📄 FILE 3: [name].jsx (hoặc .tsx)

```jsx
import { useEffect, useState } from 'react';
import { getUser } from './[name]Service';

/** 
 * ✅ NÊN: Áp dụng type từ file types riêng thông qua JSDoc cho các file .jsx
 * @param {import('./types/[name].types').UserProfileProps} props 
 */
export const UserProfile = (props) => {
  /** @type {[import('./types/[name].types').GetUserRes | null, Function]} */
  const [data, setData] = useState(null);

  useEffect(() => {
    // ❌ KHÔNG NÊN: sử dụng fetch() tại đây
    // ✅ NÊN: Gọi hàm từ service đã được tách biệt
    if ('userId' in props) {
      getUser({ id: props.userId }).then(setData);
    }
  }, [props]);

  return <div style={{ color: 'var(--text-main)' }}>{data?.name}</div>;
};
```