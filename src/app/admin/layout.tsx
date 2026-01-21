'use client';

import { AdminNav } from './admin-nav';

const navigation = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Orders', href: '/admin/orders' },
    { name: 'Products (CMS)', href: '/admin/cms' },
    // Add other admin routes here as they are created
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="light min-h-screen bg-background">
            <AdminNav navigation={navigation} />
            <div className="py-10">
                <main>
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
