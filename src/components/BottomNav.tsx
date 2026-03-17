import { Music, Heart, Users, Share2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-primary' : 'text-nav-muted'}`}
  >
    {icon}
    <span className="text-[9px] font-medium uppercase tracking-tight">{label}</span>
  </button>
);

const BottomNav = () => {
  const [activeTab, setActiveTab] = useState('mixes');

  const tabs = [
    { id: 'mixes', icon: <Music size={24} />, label: 'Mixes' },
    { id: 'favs', icon: <Heart size={24} />, label: 'Favs' },
    { id: 'crew', icon: <Users size={24} />, label: 'Crew' },
    { id: 'share', icon: <Share2 size={24} />, label: 'Share' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-background/90 backdrop-blur-xl border-t border-border px-6 py-4 flex justify-between items-center z-50">
      {tabs.map((tab) => (
        <NavItem
          key={tab.id}
          icon={tab.icon}
          label={tab.label}
          active={activeTab === tab.id}
          onClick={() => setActiveTab(tab.id)}
        />
      ))}
    </nav>
  );
};

export default BottomNav;
