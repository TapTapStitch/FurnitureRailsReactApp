import React, { useState, useEffect } from 'react';
import ApiService from '../../services/ApiService';

const RESOURCE = 'products';
const CATEGORIES_RESOURCE = 'categories';

const INITIAL_FORM_STATE = {
    name: '',
    description: '',
    price: '',
    dimensions: '',
    material: '',
    category_id: ''
};

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState(INITIAL_FORM_STATE);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const productsData = await ApiService.get(RESOURCE);
            const categoriesData = await ApiService.get(CATEGORIES_RESOURCE);
            setProducts(productsData);
            setCategories(categoriesData);
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
        const formState = editingProduct ? editingProduct : productForm;
        const setFormState = editingProduct ? setEditingProduct : setProductForm;

        setFormState({ ...formState, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const data = editingProduct ? editingProduct : productForm;

        try {
            if (editingProduct) {
                const updatedProduct = await ApiService.update(
                    RESOURCE,
                    data.id,
                    { product: data }
                );

                const fullCategory = categories.find(cat => cat.id === parseInt(updatedProduct.category_id, 10));
                const productWithCategory = { ...updatedProduct, category: fullCategory };

                setProducts(products.map(p =>
                    p.id === productWithCategory.id ? productWithCategory : p
                ));
                setEditingProduct(null);

            } else {
                const newProduct = await ApiService.post(
                    RESOURCE,
                    { product: data }
                );

                const fullCategory = categories.find(cat => cat.id === parseInt(newProduct.category_id, 10));
                const productWithCategory = { ...newProduct, category: fullCategory };

                setProducts([...products, productWithCategory]);
                setProductForm(INITIAL_FORM_STATE);
            }
        } catch (e) {
            setError(`Помилка збереження: ${e.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей товар?')) {
            try {
                await ApiService.delete(RESOURCE, id);
                setProducts(products.filter(p => p.id !== id));
            } catch (e) {
                setError(`Помилка видалення: ${e.message}`);
            }
        }
    };

    const handleEditClick = (product) => {
        const productToEdit = { ...product, category_id: product.category?.id.toString() || '' };
        setEditingProduct(productToEdit);
        setProductForm(INITIAL_FORM_STATE);
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setError(null);
    };

    const formData = editingProduct || productForm;
    const categoryIdValue = formData.category_id || '';

    const formTitle = editingProduct ? 'Редагувати товар' : 'Додати новий товар';

    if (loading) return <div className="text-center p-4">Завантаження...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Керування Товарами</h1>

            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded shadow-md">
                <h2 className="text-xl font-semibold mb-4">{formTitle}</h2>

                {error && <div className="text-red-600 p-2 mb-4 bg-red-100 rounded">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Назва товару"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="p-2 border rounded border-gray-300"
                        required
                    />
                    <select
                        name="category_id"
                        value={categoryIdValue}
                        onChange={handleFormChange}
                        className="p-2 border rounded border-gray-300"
                        required
                    >
                        <option value="">Оберіть категорію</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        name="price"
                        placeholder="Ціна"
                        value={formData.price}
                        onChange={handleFormChange}
                        className="p-2 border rounded border-gray-300"
                        required
                        step="0.01"
                    />
                    <input
                        type="text"
                        name="dimensions"
                        placeholder="Габарити (напр. 120x80x75)"
                        value={formData.dimensions}
                        onChange={handleFormChange}
                        className="p-2 border rounded border-gray-300"
                    />
                    <input
                        type="text"
                        name="material"
                        placeholder="Матеріал"
                        value={formData.material}
                        onChange={handleFormChange}
                        className="p-2 border rounded border-gray-300"
                    />
                    <textarea
                        name="description"
                        placeholder="Опис"
                        value={formData.description}
                        onChange={handleFormChange}
                        className="p-2 border rounded border-gray-300 md:col-span-2"
                        rows="3"
                    />
                </div>
                <div className="flex items-center space-x-2 mt-4">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        {editingProduct ? 'Оновити' : 'Створити'}
                    </button>
                    {editingProduct && (
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Назва</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Категорія</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ціна</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Дії</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category?.name || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price} грн</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button
                                    onClick={() => handleEditClick(product)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    Редагувати
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
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

export default Products;
