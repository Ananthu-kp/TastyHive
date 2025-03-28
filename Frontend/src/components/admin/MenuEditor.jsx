import AdminSidebar from "./AdminSidebar";

const MenuEditor = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Content Area */}
      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold">Menu Editor</h1>
        <p className="mt-4">This is the menu editor page.</p>
      </div>
    </div>
  );
};

export default MenuEditor;
