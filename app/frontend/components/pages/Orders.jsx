import React, { useState, useEffect } from 'react';
import ApiService from '../../services/ApiService';
import { Link } from 'react-router-dom';

const RESOURCE = 'orders';
const EMPLOYEES_RESOURCE = 'employees';

const STATUS_OPTIONS = [
    'в обробці',
    'підтверджено',
    'виконано',
    'скасовано'
];

function Orders() {
    const [orders, setOrders] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingOrder, setEditingOrder] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const ordersData = await ApiService.get(RESOURCE);
            const employeesData = await ApiService.get(EMPLOYEES_RESOURCE);
            setOrders(ordersData);
            setEmployees(employeesData);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditClick = (order) => {
        setEditingOrder({ ...order, employee_id: order.employee?.id || '' });
    };

    const handleCancelEdit = () => {
        setEditingOrder(null);
        setError(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditingOrder({ ...editingOrder, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editingOrder) return;

        setError(null);
        const { id, status, employee_id } = editingOrder;

        try {
            const updatedOrderFromApi = await ApiService.update(
                RESOURCE,
                id,
                { order: { status, employee_id: employee_id || null } } // Надсилаємо null, якщо id порожній
            );

            let fullEmployee = null;
            if (updatedOrderFromApi.employee_id) {
                fullEmployee = employees.find(emp => emp.id === parseInt(updatedOrderFromApi.employee_id, 10));
            }

            setOrders(orders.map(order => {
                if (order.id === updatedOrderFromApi.id) {
                    // Це правильний спосіб:
                    // 1. Беремо старий `order` (щоб зберегти `customer`)
                    // 2. Додаємо `updatedOrderFromApi` (щоб оновити `status`, `employee_id`)
                    // 3. Явно додаємо `employee` (об'єкт або null)
                    return {
                        ...order,
                        ...updatedOrderFromApi,
                        employee: fullEmployee
                    };
                }
                return order;
            }));

            setEditingOrder(null);

        } catch (e) {
            setError(`Помилка оновлення: ${e.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити це замовлення?')) {
            try {
                await ApiService.delete(RESOURCE, id);
                setOrders(orders.filter(o => o.id !== id));
            } catch (e) {
                setError(`Помилка видалення: ${e.message}`);
            }
        }
    };

    if (loading) return <div className="text-center p-4">Завантаження...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Керування Замовленнями</h1>

            {editingOrder && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Редагування Замовлення #{editingOrder.id}</h2>

                    {error && <div className="text-red-600 p-2 mb-4 bg-red-100 rounded">{error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            name="status"
                            value={editingOrder.status}
                            onChange={handleFormChange}
                            className="p-2 border rounded border-gray-300"
                        >
                            {STATUS_OPTIONS.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        <select
                            name="employee_id"
                            value={editingOrder.employee_id || ''}
                            onChange={handleFormChange}
                            className="p-2 border rounded border-gray-300"
                        >
                            <option value="">Оберіть відповідального</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Оновити
                        </button>
                        <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                            Скасувати
                        </button>
                    </div>
                </form>
            )}

            {error && !editingOrder && <div className="text-red-600 p-2 mb-4 bg-red-100 rounded">{error}</div>}

            <div className="bg-white rounded shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Клієнт</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сума</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Співробітник</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Дії</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer?.full_name || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.order_date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'виконано' ? 'bg-green-100 text-green-800' :
                          order.status === 'скасовано' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total_amount || 0} грн</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.employee?.full_name || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button
                                    onClick={() => handleEditClick(order)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    Змінити статус
                                </button>
                                <button
                                    onClick={() => handleDelete(order.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Видалити
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Orders;
