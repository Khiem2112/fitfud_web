export type ConsultationRequestInput = {
  fullName: string;
  phone: string;
  note?: string;
};

export type ConsultationRequestOutput = {
  success: boolean;
  message: string;
};
