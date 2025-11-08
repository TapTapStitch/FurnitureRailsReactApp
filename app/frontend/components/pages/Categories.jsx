import React, {useState, useEffect} from 'react';
import ApiService from '../../services/ApiService';

const RESOURCE = 'categories';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await ApiService.get(RESOURCE);
            setCategories(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (editingCategory) {
                const updatedCategory = await ApiService.update(
                    RESOURCE,
                    editingCategory.id,
                    {category: {name: editingCategory.name}}
                );
                setCategories(categories.map(cat =>
                    cat.id === updatedCategory.id ? updatedCategory : cat
                ));
                setEditingCategory(null);

            } else {
                const newCategory = await ApiService.post(
                    RESOURCE,
                    {category: {name: newCategoryName}}
                );
                setCategories([...categories, newCategory]);
                setNewCategoryName('');
            }
        } catch (e) {
            setError(`Помилка збереження: ${e.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цю категорію?')) {
            try {
                await ApiService.delete(RESOURCE, id);
                setCategories(categories.filter(cat => cat.id !== id));
            } catch (e) {
                setError(`Помилка видалення: ${e.message}`);
            }
        }
    };

    const handleEditClick = (category) => {
        setEditingCategory({...category});
        setNewCategoryName('');
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
    };

    const handleEditFormChange = (e) => {
        setEditingCategory({...editingCategory, name: e.target.value});
    };

    if (loading) return <div className="text-center p-4">Завантаження...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Керування Категоріями</h1>

            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded shadow-md">
                <h2 className="text-xl font-semibold mb-2">
                    {editingCategory ? 'Редагувати категорію' : 'Додати нову категорію'}
                </h2>

                {error && <div className="text-red-600 p-2 mb-2 bg-red-100 rounded">{error}</div>}

                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Назва категорії"
                        value={editingCategory ? editingCategory.name : newCategoryName}
                        onChange={editingCategory ? handleEditFormChange : (e) => setNewCategoryName(e.target.value)}
                        className="flex-1 p-2 border rounded border-gray-300"
                        required
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        {editingCategory ? 'Оновити' : 'Створити'}
                    </button>
                    {editingCategory && (
                        <button type="button" onClick={handleCancelEdit}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                            Скасувати
                        </button>
                    )}
                </div>
            </form>

            <div className="bg-white rounded shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Назва</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дії</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button
                                    onClick={() => handleEditClick(category)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    Редагувати
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
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

export default Categories;
