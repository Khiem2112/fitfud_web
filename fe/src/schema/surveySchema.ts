import { z } from 'zod';

export const surveySchema = z.object({
  health_goal: z.enum(['Weight Loss', 'Muscle Gain', 'Healthy Eating', 'Calorie Control', 'Maintain Weight', 'Convenience']),
  gender: z.enum(['Male', 'Female', 'Other']),
  age: z.coerce.number().min(12, 'Tuổi tối thiểu là 12').max(100, 'Tuổi tối đa là 100'),
  height: z.coerce.number().min(100, 'Chiều cao tối thiểu là 100cm').max(250, 'Chiều cao tối đa là 250cm'),
  weight: z.coerce.number().min(30, 'Cân nặng tối thiểu là 30kg').max(300, 'Cân nặng tối đa là 300kg'),
  activity_level: z.enum(['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extra Active']),
  allergyIds: z.array(z.string()),
});

export type SurveyFormValues = z.infer<typeof surveySchema>;
