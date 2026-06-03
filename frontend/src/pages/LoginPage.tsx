import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axiosInstance';
import { setCredentials } from '../store/authSlice';
import { Button, Input, Card, Typography, message } from 'antd';

const { Title } = Typography;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      dispatch(setCredentials(response.data));
      message.success('Вход выполнен успешно!');
      navigate('/dashboard');
    } catch (err) {
      message.error('Ошибка входа. Проверьте email и пароль.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center' }}>Вход в TaskFlow</Title>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="large"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <Input.Password
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              size="large"
            />
          </div>
          <Button type="primary" htmlType="submit" loading={loading} block size="large">
            Войти
          </Button>
        </form>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Button type="link" onClick={() => navigate('/register')}>
            Нет аккаунта? Зарегистрироваться
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;