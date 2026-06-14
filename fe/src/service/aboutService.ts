import { ConsultationRequestInput, ConsultationRequestOutput } from '../type/about.types';

export const requestConsultation = async (input: ConsultationRequestInput): Promise<ConsultationRequestOutput> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  if (!input.fullName || !input.phone) {
    throw new Error('Họ tên và số điện thoại là bắt buộc.');
  }

  return {
    success: true,
    message: 'Yêu cầu tư vấn của bạn đã được ghi nhận.'
  };
};
