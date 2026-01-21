import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
    children: ReactNode;
    className?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full';
    noPadding?: boolean;
    centerContent?: boolean;
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

export function PageContainer({
    children,
    className,
    maxWidth = '7xl',
    noPadding = false,
    centerContent = false,
}: PageContainerProps) {
    return (
        <div
            className={cn(
                'w-full mx-auto',
                maxWidthClasses[maxWidth],
                !noPadding && 'px-4 md:px-6 py-8 md:py-12',
                centerContent && 'flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]',
                className
            )}
        >
            {children}
        </div>
    );
}
