export const mockLogin = (email: string, _password: string) => {
  return {
    user: {
      id: 1,
      email: email,
      name: email.split('@')[0] || 'Тестовый пользователь',
    },
    token: 'mock-token-12345',
  };
};

export const mockRegister = (email: string, _password: string, name: string) => {
  return {
    user: {
      id: 1,
      email: email,
      name: name || email.split('@')[0],
    },
    token: 'mock-token-12345',
  };
};
