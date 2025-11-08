import React, { useState, useEffect } from 'react';
import ApiService from '../../services/ApiService';

const RESOURCE = 'customers';

const INITIAL_FORM_STATE = {
    full_name: '',
    phone: '',
    email: '',
    address: ''
};

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingCustomer, setEditingCustomer] = useState(null);
    const [customerForm, setCustomerForm] = useState(INITIAL_FORM_STATE);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ApiService.get(RESOURCE);
            setCustomers(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        const formState = editingCustomer ? editingCustomer : customerForm;
        const setFormState = editingCustomer ? setEditingCustomer : setCustomerForm;

        setFormState({ ...formState, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const data = editingCustomer ? editingCustomer : customerForm;

        try {
            if (editingCustomer) {
                const updatedCustomer = await ApiService.update(
                    RESOURCE,
                    data.id,
                    { customer: data }
                );
                setCustomers(customers.map(c =>
                    c.id === updatedCustomer.id ? updatedCustomer : c
                ));
                setEditingCustomer(null);

            } else {
                const newCustomer = await ApiService.post(
                    RESOURCE,
                    { customer: data }
                );
                setCustomers([...customers, newCustomer]);
                setCustomerForm(INITIAL_FORM_STATE);
            }
        } catch (e) {
            setError(`Помилка збереження: ${e.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цього клієнта?')) {
            try {
                await ApiService.delete(RESOURCE, id);
                setCustomers(customers.filter(c => c.id !== id));
            } catch (e) {
                setError(`Помилка видалення: ${e.message}`);
            }
        }
    };

    const handleEditClick = (customer) => {
        setEditingCustomer({ ...customer });
        setCustomerForm(INITIAL_FORM_STATE);
    };

    const handleCancelEdit = () => {
        setEditingCustomer(null);
        setError(null);
    };

    const formData = editingCustomer || customerForm;
    const formTitle = editingCustomer ? 'Редагувати клієнта' : 'Додати нового клієнта';

    if (loading) return <div className="text-center p-4">Завантаження...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Керування Клієнтами</h1>

            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded shadow-md">
                <h2 className="text-xl font-semibold mb-4">{formTitle}</h2>

                {error && <div className="text-red-600 p-2 mb-4 bg-red-100 rounded">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="full_name"
                        placeholder="ПІБ Клієнта"
                        value={formData.full_name}
                        onChange={handleFormChange}
                        className="p-2 border rounded border-gray-300"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Телефон"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="p-2 border rounded border-gray-300"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="p-2 border rounded border-gray-300 md:col-span-2"
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Адреса доставки"
                        value={formData.address}
                        onChange={handleFormChange}
                        className="p-2 border rounded border-gray-300 md:col-span-2"
                    />
                </div>
                <div className="flex items-center space-x-2 mt-4">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        {editingCustomer ? 'Оновити' : 'Створити'}
                    </button>
                    {editingCustomer && (
                        <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                            Скасувати
                        </button>
                    )}
                </div>
            </form>

            <div className="bg-white rounded shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ПІБ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Телефон</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Дії</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.full_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button
                                    onClick={() => handleEditClick(customer)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    Редагувати
                                </button>
                                <button
                                    onClick={() => handleDelete(customer.id)}
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

export default Customers;
