# agents.md

Nguyên tắc hành vi giúp giảm thiểu các lỗi viết code phổ biến của LLM. Cần kết hợp với các hướng dẫn riêng của dự án khi cần.

**Sự đánh đổi:** Các nguyên tắc này thiên về sự cẩn trọng hơn là tốc độ. Đối với các tác vụ đơn giản, hãy sử dụng phán đoán[cite: 2].

## 1. Suy nghĩ Trước khi Code
**Không giả định[cite: 2]. Không che giấu sự bối rối[cite: 2]. Trình bày rõ các sự đánh đổi (tradeoffs)[cite: 2].**

Trước khi triển khai:
- Nêu rõ các giả định của bạn[cite: 2]. Nếu không chắc chắn, hãy hỏi[cite: 2].
- Nếu có nhiều cách hiểu, hãy trình bày chúng - đừng âm thầm lựa chọn[cite: 2].
- Nếu có cách tiếp cận đơn giản hơn, hãy nói ra[cite: 2]. Phản biện khi cần thiết[cite: 2].
- Nếu có gì đó không rõ ràng, hãy dừng lại[cite: 2]. Gọi tên điều gây bối rối[cite: 2]. Hãy hỏi[cite: 2].

## 2. Ưu tiên Sự Đơn giản
**Đoạn code ngắn nhất có thể giải quyết được vấn đề[cite: 2]. Không suy đoán[cite: 2].**

- Không thêm tính năng ngoài những gì được yêu cầu[cite: 2].
- Không tạo abstraction cho code chỉ dùng một lần[cite: 2].
- Không thêm sự "linh hoạt" hay "cấu hình được" nếu không được yêu cầu[cite: 2].
- Không xử lý lỗi cho các kịch bản bất khả thi[cite: 2].
- Nếu bạn viết 200 dòng mà có thể rút gọn thành 50 dòng, hãy viết lại[cite: 2].

Tự hỏi bản thân: "Một kỹ sư senior có nói rằng điều này là phức tạp quá mức không?"[cite: 2]. Nếu có, hãy đơn giản hóa[cite: 2].

## 3. Thay đổi Cục bộ (Surgical Changes)
**Chỉ chạm vào những gì bắt buộc[cite: 2]. Chỉ dọn dẹp mớ hỗn độn của chính bạn[cite: 2].**

Khi chỉnh sửa code có sẵn:
- Không "cải thiện" các đoạn code, comment, hoặc định dạng lân cận[cite: 2].
- Không refactor những thứ không bị lỗi[cite: 2].
- Tuân thủ style hiện tại, ngay cả khi bạn có cách làm khác[cite: 2].
- Nếu bạn nhận thấy dead code không liên quan, hãy đề cập đến nó - đừng xóa nó[cite: 2].

Khi các thay đổi của bạn tạo ra các đoạn code thừa (orphans):
- Hãy xóa các imports/variables/functions mà NHỮNG THAY ĐỔI CỦA BẠN làm cho không còn được sử dụng[cite: 2].
- Không xóa dead code có từ trước trừ khi được yêu cầu[cite: 2].

Bài kiểm tra: Mỗi dòng bị thay đổi phải truy vết trực tiếp đến yêu cầu của người dùng[cite: 2].

## 4. Thực thi Hướng Mục tiêu
**Định nghĩa tiêu chí thành công[cite: 2]. Lặp lại đến khi được xác minh[cite: 2].**

Biến các tác vụ thành các mục tiêu có thể xác minh được:
- "Thêm validation" → "Viết test cho các input không hợp lệ, sau đó code để test pass"[cite: 2]
- "Sửa bug" → "Viết một test để tái tạo bug, sau đó code để test pass"[cite: 2]
- "Refactor X" → "Đảm bảo các test vẫn pass trước và sau khi làm"[cite: 2]

Đối với các tác vụ nhiều bước, hãy nêu ra một kế hoạch ngắn gọn:[cite: 2]
1. [Bước] → xác minh: [kiểm tra][cite: 2]
2. [Bước] → xác minh: [kiểm tra][cite: 2]
3. [Bước] → xác minh: [kiểm tra][cite: 2]

Tiêu chí thành công rõ ràng cho phép bạn tự lặp lại (loop) một cách độc lập[cite: 2]. Tiêu chí mơ hồ ("làm cho nó chạy được") đòi hỏi phải liên tục làm rõ[cite: 2].

---

**Các nguyên tắc này đang hoạt động hiệu quả nếu:** có ít thay đổi không cần thiết trong diffs hơn, ít phải viết lại code do làm phức tạp quá mức, và các câu hỏi làm rõ được đặt ra trước khi triển khai thay vì sau khi xảy ra lỗi[cite: 2].