'use client';

import { AdminNav } from './admin-nav';

const navigation = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Orders', href: '/admin/orders' },
    { name: 'Distribution', href: '/admin/distribution' },
    { name: 'Products (CMS)', href: '/admin/cms' },
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
