import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { APP_NAME, ICONS } from '../../constants';
import { AuthContext } from '../../contexts/AuthContext';
import Button from '../common/Button';
import { AuthContextType } from '../../types';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: ICONS.DASHBOARD },
  { path: '/appointments', label: 'Agendamentos', icon: ICONS.APPOINTMENTS },
  { path: '/patients', label: 'Pacientes', icon: ICONS.PATIENTS },
  { path: '/exams', label: 'Exames', icon: ICONS.EXAMS },
  { path: '/financials', label: 'Financeiro', icon: ICONS.FINANCIALS },
  { path: '/inventory', label: 'Estoque', icon: ICONS.INVENTORY },
  { path: '/settings', label: 'Configurações', icon: ICONS.SETTINGS },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useContext(AuthContext) as AuthContextType;

  return (
    <aside className="w-64 bg-clinic-secondary text-white flex flex-col">
      <div className="p-6 text-center border-b border-clinic-primary">
        <h1 className="text-2xl font-semibold text-clinic-accent">{APP_NAME}</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg hover:bg-clinic-primary transition-colors duration-200 ease-in-out ${
                isActive ? 'bg-clinic-primary font-semibold shadow-md' : 'hover:bg-opacity-75'
              }`
            }
          >
            {React.cloneElement(item.icon, { className: "w-5 h-5" })}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-clinic-primary mt-auto">
        {user && (
          <div className="flex items-center space-x-3 mb-3">
            {React.cloneElement(ICONS.USER_CIRCLE, { className: "w-10 h-10 text-clinic-accent"})}
            <div>
              <p className="text-sm font-medium">{user.name || user.email}</p>
              <p className="text-xs text-gray-300">{user.email}</p>
              {user.role && <p className="text-xs text-gray-400 capitalize">Cargo: {user.role.toLowerCase()}</p>}
            </div>
          </div>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={logout} 
          className="w-full text-white border-white hover:bg-white hover:text-clinic-secondary"
          leftIcon={ICONS.LOGOUT}
        >
          Sair
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;