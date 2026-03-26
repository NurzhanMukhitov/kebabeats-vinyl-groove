import { Music, Users } from 'lucide-react';
import type { ReactNode } from 'react';

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

export type BottomTab = "mixes" | "crew";

interface BottomNavProps {
  activeTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const tabs: Array<{ id: BottomTab; icon: ReactNode; label: string }> = [
    { id: "mixes", icon: <Music size={24} />, label: "Mixes" },
    { id: "crew", icon: <Users size={24} />, label: "Crew" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-background/90 backdrop-blur-xl border-t border-border px-6 py-4 flex justify-around items-center z-50">
      {tabs.map((tab) => (
        <NavItem
          key={tab.id}
          icon={tab.icon}
          label={tab.label}
          active={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </nav>
  );
};

export default BottomNav;
