import { HealthGoal, ActivityLevel, DietPreference } from '../type/survey.types';

export const healthGoals: { id: HealthGoal; name: string; description: string }[] = [
  { id: 'Weight Loss', name: 'Giảm cân', description: 'Tập trung giảm lượng calo nạp vào, giảm mỡ thừa an toàn.' },
  { id: 'Muscle Gain', name: 'Tăng cơ', description: 'Chế độ ăn giàu protein, cung cấp đủ năng lượng để xây dựng cơ bắp.' },
  { id: 'Healthy Eating', name: 'Ăn uống lành mạnh', description: 'Cân bằng dinh dưỡng, cải thiện sức khỏe tổng thể.' },
  { id: 'Calorie Control', name: 'Kiểm soát calories', description: 'Quản lý chặt chẽ lượng calo nạp vào hàng ngày.' },
  { id: 'Maintain Weight', name: 'Duy trì vóc dáng', description: 'Cung cấp năng lượng vừa đủ để giữ mức cân nặng lý tưởng.' },
  { id: 'Convenience', name: 'Tiện lợi / tiết kiệm', description: 'Các bữa ăn nhanh gọn, tối ưu thời gian và chi phí.' }
];

export const activityLevels: { id: ActivityLevel; name: string; description: string }[] = [
  { id: 'Sedentary', name: 'Ít vận động', description: 'Chủ yếu ngồi học/làm việc, rất ít đi lại, hầu như không tập luyện.' },
  { id: 'Lightly Active', name: 'Vận động nhẹ', description: 'Có đi bộ nhẹ hoặc vận động nhẹ trong ngày, tập luyện 1-2 buổi/tuần.' },
  { id: 'Moderately Active', name: 'Vận động vừa', description: 'Có tập luyện đều đặn 3-4 buổi/tuần hoặc thường xuyên đi lại, hoạt động vừa phải.' },
  { id: 'Very Active', name: 'Vận động nhiều', description: 'Tập luyện cường độ cao 5-6 buổi/tuần, công việc hoặc sinh hoạt khá năng động.' },
  { id: 'Extra Active', name: 'Vận động rất nhiều', description: 'Tập nặng gần như mỗi ngày, vận động viên, người lao động thể lực cao hoặc tập 2 buổi/ngày.' }
];

export const dietPreferences: { id: DietPreference; name: string }[] = [
  { id: 'Bình thường', name: 'Bình thường' },
  { id: 'Eat Clean', name: 'Eat Clean' },
  { id: 'Keto', name: 'Keto' },
  { id: 'Chay', name: 'Chay' }
];


