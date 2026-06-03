import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axiosInstance';
import { setCredentials } from '../store/authSlice';
import { Button, Input, Card, Typography, message } from 'antd';

const { Title } = Typography;

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/register', { email, password, name });
      dispatch(setCredentials(response.data));
      message.success('Регистрация прошла успешно!');
      navigate('/dashboard');
    } catch (err) {
      message.error('Ошибка регистрации. Попробуйте другой email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center' }}>Регистрация</Title>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              size="large"
            />
          </div>
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
            Зарегистрироваться
          </Button>
        </form>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Button type="link" onClick={() => navigate('/login')}>
            Уже есть аккаунт? Войти
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;