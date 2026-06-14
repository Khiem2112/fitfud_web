import { LoginInput, LoginOutput, RegisterInput, RegisterOutput, ResetPasswordInput, ResetPasswordOutput } from '../type/auth.types';

// Mock database in localStorage
const STORAGE_USERS_KEY = 'fitfud_mock_users';
const CURRENT_USER_KEY = 'fitfud_current_user';
const TOKEN_KEY = 'fitfud_jwt_token';

const getMockUsers = () => {
  const users = localStorage.getItem(STORAGE_USERS_KEY);
  if (!users) {
    // Default mock user
    const defaultUsers = [
      {
        id: 'user_1',
        email: 'email@example.com',
        password_hash: '123456',
        full_name: 'Nguyễn Minh Tuấn',
        phone: '0901234567',
        has_surveyed: true
      },
      {
        id: 'user_2',
        email: 'guest@fitfud.vn',
        password_hash: '123456',
        full_name: 'Khách Hàng Thử Nghiệm',
        phone: '0909999999',
        has_surveyed: false
      }
    ];
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(users);
};

export const loginUser = async (input: LoginInput): Promise<LoginOutput> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const users = getMockUsers();
  const matchedUser = users.find(
    (u: any) => u.email.toLowerCase() === input.email.toLowerCase() && u.password_hash === input.password_hash
  );

  if (!matchedUser) {
    throw new Error('Email hoặc mật khẩu không chính xác!');
  }

  const session = {
    jwt: 'mock_jwt_token_' + Date.now(),
    user: {
      id: matchedUser.id,
      email: matchedUser.email,
      full_name: matchedUser.full_name,
      phone: matchedUser.phone,
      has_surveyed: matchedUser.has_surveyed
    }
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session.user));
  localStorage.setItem(TOKEN_KEY, session.jwt);

  return session;
};

export const registerUser = async (input: RegisterInput): Promise<RegisterOutput> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const users = getMockUsers();
  const exists = users.some((u: any) => u.email.toLowerCase() === input.email.toLowerCase());

  if (exists) {
    throw new Error('Email này đã được sử dụng!');
  }

  const newUser = {
    id: 'user_' + Date.now(),
    email: input.email,
    password_hash: input.password_hash,
    full_name: input.full_name,
    phone: input.phone,
    has_surveyed: false
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

  const session = {
    jwt: 'mock_jwt_token_' + Date.now(),
    user: {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      phone: newUser.phone,
      has_surveyed: false
    }
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session.user));
  localStorage.setItem(TOKEN_KEY, session.jwt);

  return session;
};

export const forgotPassword = async (input: ResetPasswordInput): Promise<ResetPasswordOutput> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const users = getMockUsers();
  const matched = users.some((u: any) => u.email.toLowerCase() === input.email.toLowerCase());

  if (!matched) {
    throw new Error('Không tìm thấy tài khoản gắn liền với email này!');
  }

  return {
    success: true,
    message: 'Mật khẩu khôi phục đã được gửi về email của bạn!'
  };
};

export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const updateCurrentUserSurveyStatus = (status: boolean): void => {
  const user = getCurrentUser();
  if (user) {
    user.has_surveyed = status;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    // Update in mock db
    const users = getMockUsers();
    const index = users.findIndex((u: any) => u.id === user.id);
    if (index !== -1) {
      users[index].has_surveyed = status;
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    }
  }
};
