export interface AdminMeData {
  accountId: string;
  roleId: string;
  name: string;
  avatar: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
  deviceId: string;
}

export interface LoginData {
  twoFactorActive: boolean;
  sessionId: string;
  deviceId: string;
  name: string;
  avatar: string;
  roleId: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  error: string | null;
}
