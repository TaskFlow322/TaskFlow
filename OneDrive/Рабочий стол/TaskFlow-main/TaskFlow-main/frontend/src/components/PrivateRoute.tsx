import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;