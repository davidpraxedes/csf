import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import {
  LayoutDashboard,
  Package,
  Settings,
  Bell,
  Key,
  DollarSign,
  Palette,
  BarChart3,
  Users,
  TrendingUp,
  Clock,
  FileText,
  LogOut,
  Menu,
  X,
  Globe,
  Activity,
  Eye,
  CreditCard,
  AlertCircle,
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAdminStore((state) => state.logout);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      badge: null,
    },
    {
      id: 'orders',
      label: 'Pedidos',
      icon: Package,
      path: '/admin/orders',
      badge: null,
    },
    {
      id: 'statistics',
      label: 'Estatísticas',
      icon: BarChart3,
      path: '/admin/statistics',
      badge: null,
    },
    {
      id: 'notifications',
      label: 'Notificações',
      icon: Bell,
      path: '/admin/notifications',
      badge: null,
    },
    {
      id: 'analytics',
      label: 'Analytics Ao Vivo',
      icon: Activity,
      path: '/admin/analytics',
      badge: 'LIVE',
    },
    {
      id: 'kyc',
      label: 'KYC / Documentos',
      icon: FileText,
      path: '/admin/kyc',
      badge: null,
    },
    {
      type: 'divider',
      label: 'Configurações',
    },
    {
      id: 'gateway',
      label: 'Gateway de Pagamento',
      icon: Key,
      path: '/admin/settings/gateway',
      badge: null,
    },
    {
      id: 'fees',
      label: 'Taxas',
      icon: DollarSign,
      path: '/admin/settings/fees',
      badge: null,
    },
    {
      id: 'notification-settings',
      label: 'Config. Notificações',
      icon: Bell,
      path: '/admin/settings/notifications',
      badge: null,
    },
    {
      id: 'appearance',
      label: 'Aparência',
      icon: Palette,
      path: '/admin/settings/appearance',
      badge: null,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'
          }`}
      >
        {/* Logo/Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-carrefour-blue">Admin Panel</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item, index) => {
            if (item.type === 'divider') {
              return (
                <div key={`divider-${index}`} className="px-4 py-2">
                  {sidebarOpen && (
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {item.label}
                    </p>
                  )}
                </div>
              );
            }

            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${active
                  ? 'bg-carrefour-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${!sidebarOpen ? 'justify-center' : ''
              }`}
            title={!sidebarOpen ? 'Sair' : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-lg"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-64 bg-white">
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
              <h1 className="text-xl font-bold text-carrefour-blue">Admin Panel</h1>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              {menuItems.map((item, index) => {
                if (item.type === 'divider') {
                  return (
                    <div key={`divider-${index}`} className="px-4 py-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {item.label}
                      </p>
                    </div>
                  );
                }

                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${active
                      ? 'bg-carrefour-blue text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span>Sair</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'} transition-all duration-300`}>
        {children}
      </main>
    </div>
  );
}

