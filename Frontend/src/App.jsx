import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';

// Layouts
import UserLayout from './components/shared/UserLayout';
import AdminLayout from './components/shared/AdminLayout';

// Pages
import Home from './modules/user/pages/Home';
import Rooms from './modules/user/pages/Rooms';
import Wallet from './modules/user/pages/Wallet';
import About from './modules/user/pages/About';
import Gallery from './modules/user/pages/Gallery';
import Contact from './modules/user/pages/Contact';
import Login from './modules/user/pages/Login';
import Signup from './modules/user/pages/Signup';
import Profile from './modules/user/pages/Profile';
import MyBookings from './modules/user/pages/MyBookings';
import AccountDetails from './modules/user/pages/AccountDetails';
import BookingFlow from './modules/user/pages/BookingFlow';
import Dashboard from './modules/admin/pages/Dashboard';
import AdminLogin from './modules/admin/pages/AdminLogin';
import RoomMgmt from './modules/admin/pages/RoomMgmt';
import Bookings from './modules/admin/pages/Bookings';
import Users from './modules/admin/pages/Users';
import Discounts from './modules/admin/pages/Discounts';
import Transactions from './modules/admin/pages/Transactions';

// Route Guards
const AdminRoute = ({ children }) => {
  const { role, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return role === 'admin' ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <Router>
          <Routes>
            {/* User Module */}
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="rooms" element={<Rooms />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="about" element={<About />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/bookings" element={<MyBookings />} />
              <Route path="profile/details" element={<AccountDetails />} />
              <Route path="book" element={<BookingFlow />} />
              {/* Additional user routes will be added here */}
            </Route>

            {/* Admin Module */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="rooms" element={<RoomMgmt />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="users" element={<Users />} />
              <Route path="discounts" element={<Discounts />} />
              <Route path="wallet" element={<Transactions />} />
              {/* Additional admin routes will be added here */}
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;
