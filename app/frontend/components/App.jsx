import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Employees from './pages/Employees';
import Orders from './pages/Orders';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="products" element={<Products />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="employees" element={<Employees />} />
                    <Route path="orders" element={<Orders />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
