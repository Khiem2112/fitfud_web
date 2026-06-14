export type LoginInput = {
  email: string;
  password_hash: string;
};

export type UserSession = {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  has_surveyed: boolean;
};

export type LoginOutput = {
  jwt: string;
  user: UserSession;
};

export type RegisterInput = {
  full_name: string;
  email: string;
  phone: string;
  password_hash: string;
};

export type RegisterOutput = LoginOutput;

export type ResetPasswordInput = {
  email: string;
};

export type ResetPasswordOutput = {
  success: boolean;
  message: string;
};
