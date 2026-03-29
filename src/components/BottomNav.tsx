import { Music, Radio, Users } from 'lucide-react';
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

export type BottomTab = "mixes" | "crew" | "radio";

interface BottomNavProps {
  activeTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const tabs: Array<{ id: BottomTab; icon: ReactNode; label: string }> = [
    { id: "mixes", icon: <Music size={24} />, label: "Mixes" },
    { id: "crew", icon: <Users size={24} />, label: "Crew" },
    { id: "radio", icon: <Radio size={24} strokeWidth={1.75} />, label: "Radio" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-background/90 backdrop-blur-xl border-t border-border px-4 pt-3 flex justify-around items-center z-50 gap-1"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <NavItem
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            active={active}
            onClick={() => onTabChange(tab.id)}
          />
        );
      })}
    </nav>
  );
};

export default BottomNav;
