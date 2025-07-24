import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterChoice from './pages/RegisterChoice';
import UserRegister from './pages/UserRegister';
import ProviderRegister from './pages/ProviderRegister';
import ProviderForm from './pages/ProviderForm';
import EditProfile from './pages/EditProfile';
import Dashboard from './pages/Dashboard';
import ServiceList from './pages/ServiceList';
import MapView from './components/MapView';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './utils/ProtectedAdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import ProviderProfile from './pages/ProviderProfile';
import ProviderDetails from './components/ProviderDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><RegisterChoice /></Layout>} />
        <Route path="/user-register" element={<Layout><UserRegister /></Layout>} />
        <Route path="/provider-register" element={<Layout><ProviderRegister /></Layout>} />
        <Route path="/szolgaltatok" element={
          <ProtectedRoute>
            <Layout><ServiceList /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/szolgaltato/:providerId" element={
          <ProtectedRoute>
            <Layout><ProviderDetails /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/create-profile" element={
          <ProtectedRoute>
            <Layout><ProviderForm /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <Layout><EditProfile /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/terkep" element={
          <ProtectedRoute>
            <Layout><MapView /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/profil" element={
          <ProtectedRoute>
            <Layout><ProviderProfile /></Layout>
          </ProtectedRoute>
        } />
        {/* Admin útvonal */}
        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <Layout><AdminDashboard /></Layout>
          </ProtectedAdminRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
