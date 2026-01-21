import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CenteredPageLayoutProps {
    children: ReactNode;
    className?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full';
    noPadding?: boolean;
}

const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    '4xl': 'max-w-[1400px]',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
};

export function CenteredPageLayout({
    children,
    className,
    maxWidth = '7xl',
    noPadding = false,
}: CenteredPageLayoutProps) {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <div
                className={cn(
                    'w-full mx-auto',
                    maxWidthClasses[maxWidth],
                    !noPadding && 'px-4 md:px-6 py-8 md:py-12',
                    className
                )}
            >
                {children}
            </div>
        </div>
    );
}
