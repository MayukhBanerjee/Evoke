"use client";

import React, { useState, useEffect } from 'react';
import { Shield, UserCheck, Users, Eye } from 'lucide-react';

export type RoleType = 'LivingSubject' | 'FamilyContributor' | 'FamilyAuditor';

interface RoleSwitcherProps {
  onRoleChange?: (role: RoleType) => void;
  className?: string;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ onRoleChange, className = '' }) => {
  const [currentRole, setCurrentRole] = useState<RoleType>('LivingSubject');

  useEffect(() => {
    const saved = localStorage.getItem('evoke-role') as RoleType;
    if (saved) {
      setCurrentRole(saved);
      onRoleChange?.(saved);
    }
  }, [onRoleChange]);

  const handleSelect = (role: RoleType) => {
    setCurrentRole(role);
    localStorage.setItem('evoke-role', role);
    onRoleChange?.(role);
  };

  const ROLES: { id: RoleType; label: string; invariant: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'LivingSubject',
      label: 'Primary Author',
      invariant: 'Invariant I3 (Primary Authorship)',
      icon: <UserCheck className="w-3.5 h-3.5 text-[#4ECCA3]" />,
      color: 'border-[#4ECCA3]/40 text-[#4ECCA3] bg-[#4ECCA3]/10'
    },
    {
      id: 'FamilyContributor',
      label: 'Family Contributor',
      invariant: 'Advisory Contribution Mode',
      icon: <Users className="w-3.5 h-3.5 text-[#C5A880]" />,
      color: 'border-[#C5A880]/40 text-[#C5A880] bg-[#C5A880]/10'
    },
    {
      id: 'FamilyAuditor',
      label: 'Auditor',
      invariant: 'Invariant I4 (Read-Only Audit)',
      icon: <Eye className="w-3.5 h-3.5 text-[#7C6AFF]" />,
      color: 'border-[#7C6AFF]/40 text-[#7C6AFF] bg-[#7C6AFF]/10'
    }
  ];

  return (
    <div className={`flex items-center gap-1.5 p-1 rounded-[100px] bg-evoke-surface border border-evoke-border text-xs ${className}`}>
      <span className="text-[10px] font-mono text-evoke-text-muted px-2 flex items-center gap-1">
        <Shield className="w-3 h-3 text-[#4ECCA3]" />
        Cognito I1:
      </span>
      {ROLES.map((r) => {
        const isActive = currentRole === r.id;
        return (
          <button
            key={r.id}
            onClick={() => handleSelect(r.id)}
            title={r.invariant}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-[100px] text-[11px] font-medium transition-all ${
              isActive
                ? r.color
                : 'text-evoke-text-muted hover:text-evoke-text-primary'
            }`}
          >
            {r.icon}
            <span>{r.label}</span>
          </button>
        );
      })}
    </div>
  );
};
