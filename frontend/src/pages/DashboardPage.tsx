import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import { Button, Card, Typography, Space } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const DashboardPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={1}>Дашборд TaskFlow</Title>
          {user && (
            <div>
              <UserOutlined style={{ fontSize: 24, marginRight: 8 }} />
              <Text strong style={{ fontSize: 18 }}>Добро пожаловать, {user.name}!</Text>
            </div>
          )}
          <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
            Выйти
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default DashboardPage;