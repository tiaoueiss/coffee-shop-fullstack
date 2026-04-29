const Category = require("../models/Category.js");

// Show all categories
exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.render("category/index", { categories });
};

// Show form to create new category
exports.newCategoryForm = (req, res) => {
if(req.user.role !== "admin") {
  return res.status(403).render("error", { message: "Forbidden" });
}
  res.render("category/new");
};
// Create new category
exports.createCategory = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).render("error", { message: "Forbidden" });
  }

  const { name, description } = req.body;

  try {
    await Category.create({ name, description });
    res.redirect("/categories");
  } catch (err) {
    res.status(500).send("Error creating category");
  }
};
// Show form to edit category
exports.editCategoryForm = async (req, res) => {
  if(req.user.role !== "admin") {
    return res.status(403).render("error", { message: "Forbidden" });
  }
  const category = await Category.findById(req.params.id);
  res.render("category/edit", { category });
};

// Update category
exports.updateCategory = async (req, res) => {
  if(req.user.role !== "admin") {
    return res.status(403).render("error", { message: "Forbidden" });
  }
  const { name, description } = req.body;
  await Category.findByIdAndUpdate(req.params.id, { name });
  res.redirect("/categories");
};

// Delete category
exports.deleteCategory = async (req, res) => {
    if(req.user.role !== "admin") {
    return res.status(403).render("error", { message: "Forbidden" });
  }
  await Category.findByIdAndDelete(req.params.id);
  res.redirect("/categories");
};
