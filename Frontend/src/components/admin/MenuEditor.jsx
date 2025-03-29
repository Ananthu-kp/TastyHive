import { useState, useEffect } from "react";
import axiosInstance from "../../config/axios";
import AdminSidebar from "./AdminSidebar";
import { toast } from "sonner";
import { PlusCircle, ChevronDown, ChevronUp, Edit, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";

const MenuEditor = () => {
  const initialMenuItem = {
    name: "",
    category: "",
    price: "",
    isSubItem: false,
    parentCategory: ""
  };

  const [menuItem, setMenuItem] = useState(initialMenuItem);
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const isEditMode = Boolean(editingItem);

  const fetchMenuItems = async () => {
    try {
      const { data } = await axiosInstance.get("/api/menu");
      setMenuList(data);
    } catch (error) {
      toast.error("Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'isSubItem' && { category: checked ? "" : prev.category })
    }));
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setMenuItem({
      name: item.name,
      category: item.category,
      price: item.price,
      isSubItem: Boolean(item.isSubItem),
      parentCategory: item.parentCategory || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingItem(null);
    setMenuItem(initialMenuItem);
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!isConfirmed) return;

    try {
      await axiosInstance.delete(`/api/menu/${id}`);
      toast.success("Menu item deleted successfully");
      await fetchMenuItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete menu item");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!menuItem.name || !menuItem.price) {
      toast.error("Name and price are required");
      return;
    }

    if (menuItem.isSubItem && !menuItem.parentCategory) {
      toast.error("Please select a parent category for subitems");
      return;
    }

    if (!isEditMode && !menuItem.isSubItem && !menuItem.category) {
      toast.error("Category is required for main items");
      return;
    }

    try {
      const payload = isEditMode
        ? { ...menuItem, category: editingItem.category }
        : menuItem;

      await axiosInstance[isEditMode ? 'put' : 'post'](
        isEditMode ? `/api/menu/${editingItem._id}` : "/api/menu/add",
        payload
      );

      toast.success(`Menu item ${isEditMode ? 'updated' : 'added'} successfully`);
      await fetchMenuItems();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process menu item");
    }
  };

  if (loading) return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 p-6 w-full flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );

  const renderFormField = (label, name, type = "text", options = {}) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {isEditMode && name === 'category' && (
          <span className="text-gray-500 text-xs ml-1">(Cannot be changed)</span>
        )}
      </label>
      {type === 'select' ? (
        <select
          name={name}
          value={menuItem[name]}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg ${isEditMode ? "bg-gray-100 cursor-not-allowed" : "focus:ring-blue-500 focus:border-blue-500"
            }`}
          required
          disabled={isEditMode}
          {...options}
        >
          {options.children}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={menuItem[name]}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg ${(isEditMode && (name === 'category' || name === 'parentCategory'))
            ? "bg-gray-100 cursor-not-allowed"
            : "focus:ring-blue-500 focus:border-blue-500"
            }`}
          required={!isEditMode || name !== 'category'}
          readOnly={isEditMode && (name === 'category' || name === 'parentCategory')}
          {...options}
        />
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="ml-64 p-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Menu Editor</h1>
          {isEditMode && (
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <X className="mr-1" size={18} />
              Cancel Edit
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <PlusCircle className="mr-2 text-blue-500" size={20} />
            {isEditMode ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isEditMode && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isSubItem"
                  name="isSubItem"
                  checked={menuItem.isSubItem}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isSubItem" className="ml-2 block text-sm text-gray-700">
                  This is a subcategory item
                </label>
              </div>
            )}

            {menuItem.isSubItem && renderFormField(
              "Parent Category",
              "parentCategory",
              "select",
              {
                children: (
                  <>
                    <option value="">Select Parent Category</option>
                    {menuList
                      .filter(item => !item.isSubItem)
                      .map(item => (
                        <option key={item._id} value={item._id}>{item.category}</option>
                      ))}
                  </>
                )
              }
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFormField("Item Name", "name", "text", { placeholder: "e.g., Margherita Pizza" })}

              {!menuItem.isSubItem && renderFormField(
                "Category",
                "category",
                "text",
                { placeholder: "e.g., Pizza" }
              )}

              {renderFormField(
                "Price (₹)",
                "price",
                "number",
                { placeholder: "e.g., 12.99", min: "0", step: "0.01" }
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
              >
                <PlusCircle className="mr-2" size={18} />
                {isEditMode ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">Current Menu</h2>
          </div>

          {menuList.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No menu items available. Add your first item above.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {menuList.map(item => (
                <div key={item._id} className="p-6 hover:bg-gray-50 transition duration-150">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      {item.subcategories?.length > 0 && (
                        <button
                          onClick={() => toggleCategory(item._id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {expandedCategories[item._id] ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </button>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-green-600">
                        ₹{item.price}
                      </span>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {item.subcategories?.length > 0 && expandedCategories[item._id] && (
                    <div className="mt-4 ml-12 space-y-3">
                      {item.subcategories.map(subItem => (
                        <div key={subItem._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                            <span className="text-sm font-medium text-gray-700">{subItem.name}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-green-600">₹{subItem.price}</span>
                            <button
                              onClick={() => handleEdit(subItem)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(subItem._id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuEditor;