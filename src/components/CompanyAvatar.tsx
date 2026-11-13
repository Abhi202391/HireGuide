import React from 'react';

interface CompanyAvatarProps {
  company: string;
  brandColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CompanyAvatar: React.FC<CompanyAvatarProps> = ({
  company,
  brandColor = '#4F46E5',
  size = 'sm',
}) => {
  const initials = company
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const sizeClasses =
    size === 'lg'
      ? 'w-11 h-11 text-sm rounded-xl'
      : size === 'md'
        ? 'w-8 h-8 text-xs rounded-lg'
        : 'w-6 h-6 text-[11px] rounded-md';

  return (
    <div
      className={`${sizeClasses} inline-flex items-center justify-center font-display font-bold text-white shrink-0 select-none shadow-xs`}
      style={{ backgroundColor: brandColor }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
};
