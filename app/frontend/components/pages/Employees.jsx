import React, { useState, useEffect } from 'react';
import ApiService from '../../services/ApiService';

const RESOURCE = 'employees';

const INITIAL_FORM_STATE = {
    full_name: '',
    position: '',
    phone: ''
};

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingEmployee, setEditingEmployee] = useState(null);
    const [employeeForm, setEmployeeForm] = useState(INITIAL_FORM_STATE);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ApiService.get(RESOURCE);
            setEmployees(data);
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
        const formState = editingEmployee ? editingEmployee : employeeForm;
        const setFormState = editingEmployee ? setEditingEmployee : setEmployeeForm;

        setFormState({ ...formState, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const data = editingEmployee ? editingEmployee : employeeForm;

        try {
            if (editingEmployee) {
                const updatedEmployee = await ApiService.update(
                    RESOURCE,
                    data.id,
                    { employee: data }
                );
                setEmployees(employees.map(e =>
                    e.id === updatedEmployee.id ? updatedEmployee : e
                ));
                setEditingEmployee(null);

            } else {
                const newEmployee = await ApiService.post(
                    RESOURCE,
                    { employee: data }
                );
                setEmployees([...employees, newEmployee]);
                setEmployeeForm(INITIAL_FORM_STATE);
            }
        } catch (e) {
            setError(`Помилка збереження: ${e.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цього співробітника?')) {
            try {
                await ApiService.delete(RESOURCE, id);
                setEmployees(employees.filter(e => e.id !== id));
            } catch (e) {
                setError(`Помилка видалення: ${e.message}`);
            }
        }
    };

    const handleEditClick = (employee) => {
        setEditingEmployee({ ...employee });
        setEmployeeForm(INITIAL_FORM_STATE);
    };

    const handleCancelEdit = () => {
        setEditingEmployee(null);
        setError(null);
    };

    const formData = editingEmployee || employeeForm;
    const formTitle = editingEmployee ? 'Редагувати співробітника' : 'Додати нового співробітника';

    if (loading) return <div className="text-center p-4">Завантаження...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Керування Співробітниками</h1>

            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded shadow-md">
                <h2 className="text-xl font-semibold mb-4">{formTitle}</h2>

                {error && <div className="text-red-600 p-2 mb-4 bg-red-100 rounded">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="full_name"
                        placeholder="ПІБ Співробітника"
                        value={formData.full_name}
                        onChange={handleFormChange}
                        className="p-2 border rounded border-gray-300"
                        required
                    />
                    <input
                        type="text"
                        name="position"
                        placeholder="Посада"
                        value={formData.position}
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
                    />
                </div>
                <div className="flex items-center space-x-2 mt-4">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        {editingEmployee ? 'Оновити' : 'Створити'}
                    </button>
                    {editingEmployee && (
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Посада</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Телефон</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Дії</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.full_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button
                                    onClick={() => handleEditClick(employee)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    Редагувати
                                </button>
                                <button
                                    onClick={() => handleDelete(employee.id)}
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

export default Employees;
