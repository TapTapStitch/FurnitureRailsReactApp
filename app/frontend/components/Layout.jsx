import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function Layout() {
    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-2xl font-bold mb-6">Меблі-Салон</h2>
                <nav>
                    <ul>
                        <li className="mb-2"><Link to="/" className="hover:bg-gray-700 p-2 block rounded">Головна</Link></li>
                        <li className="mb-2"><Link to="/categories" className="hover:bg-gray-700 p-2 block rounded">Категорії</Link></li>
                        <li className="mb-2"><Link to="/products" className="hover:bg-gray-700 p-2 block rounded">Товари</Link></li>
                        <li className="mb-2"><Link to="/customers" className="hover:bg-gray-700 p-2 block rounded">Клієнти</Link></li>
                        <li className="mb-2"><Link to="/employees" className="hover:bg-gray-700 p-2 block rounded">Співробітники</Link></li>
                        <li className="mb-2"><Link to="/orders" className="hover:bg-gray-700 p-2 block rounded">Замовлення</Link></li>
                    </ul>
                </nav>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
