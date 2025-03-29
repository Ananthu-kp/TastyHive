import Menu from "../model/menu.model.js";

const addMenuItem = async (req, res) => {
    try {
        const { name, category, price, isSubItem, parentCategory } = req.body;
        if (!name || !price) {
            return res.status(400).json({ message: "Name and price are required" });
        }

        if (isSubItem && !parentCategory) {
            return res.status(400).json({ message: "Parent category is required for subitems" });
        }

        let menuItem;

        if (isSubItem) {
            const parent = await Menu.findById(parentCategory);
            if (!parent) {
                return res.status(404).json({ message: "Parent category not found" });
            }

            menuItem = new Menu({
                name,
                category: parent.category,
                price,
                isSubItem: true,
                parentCategory
            });
            await Menu.findByIdAndUpdate(
                parentCategory,
                { $push: { subcategories: menuItem._id } },
                { new: true }
            );
        } else {
            if (!category) {
                return res.status(400).json({ message: "Category is required for main items" });
            }
            menuItem = new Menu({ name, category, price });
        }

        await menuItem.save();
        res.status(201).json({ message: "Menu item added successfully", menuItem });
    } catch (error) {
        console.error("Error adding menu item:", error);
        res.status(500).json({
            message: error.message || "Internal Server Error",
            details: error.errors
        });
    }
};

const getMenuItems = async (req, res) => {
    try {
        const menu = await Menu.find({
            isSubItem: false 
        }).populate({
            path: 'subcategories',
            select: 'name price isAvailable' 
        });

        res.status(200).json(menu);
    } catch (error) {
        console.error("Error fetching menu:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateMenuItem = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, price, isAvailable } = req.body;
  
      const menuItem = await Menu.findById(id);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
  
      // For subitems, prevent changing category
      if (menuItem.isSubItem) {
        const updatedItem = await Menu.findByIdAndUpdate(
          id,
          { name, price, isAvailable },
          { new: true }
        );
        return res.status(200).json({ message: "Menu item updated", menuItem: updatedItem });
      }
  
      // For main items
      const updatedItem = await Menu.findByIdAndUpdate(
        id,
        { name, category, price, isAvailable },
        { new: true }
      );
  
      res.status(200).json({ message: "Menu item updated", menuItem: updatedItem });
    } catch (error) {
      console.error("Error updating menu item:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  const deleteMenuItem = async (req, res) => {
    try {
      const { id } = req.params;
  
      const menuItem = await Menu.findById(id);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
  
      // If it's a main category, delete all its subitems first
      if (!menuItem.isSubItem) {
        await Menu.deleteMany({ _id: { $in: menuItem.subcategories } });
      } else {
        // If it's a subitem, remove reference from parent
        await Menu.findByIdAndUpdate(
          menuItem.parentCategory,
          { $pull: { subcategories: id } }
        );
      }
  
      await Menu.findByIdAndDelete(id);
      res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

export default {
    addMenuItem,
    getMenuItems,
    updateMenuItem,
    deleteMenuItem
};