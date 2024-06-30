var router = require("express").Router();
const taskModal = require("../models/tasksModal");
const userModal = require("../models/userModal");
const { authenticateToken } = require("./auth");

// Create-Task
router.post("/create-task", authenticateToken, async (req, res) => {
  try {
    const { title, desc } = req.body;
    const { id } = req.headers;
    const task = new taskModal({ title: title, desc: desc });
    const saveTask = await task.save();
    const taskId = saveTask._id;

    await userModal.findByIdAndUpdate(id, { $push: { tasks: taskId } });

    return res.status(200).json({ message: "Task created successfully..." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

// Get-all-tasks
router.get("/get-all-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const tasks = await userModal
      .findById(id)
      .populate({ path: "tasks", options: { sort: { createdAt: -1 } } });
    res.status(200).json({ message: tasks });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

// Delete-Tasks
router.delete("/delete-task/:id", authenticateToken, async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.headers.id;

    await taskModal.findByIdAndDelete(bookId);
    await userModal.findByIdAndUpdate(userId, { $pull: { tasks: bookId } });
    res.status(200).json({ message: "Task Deleted successfully..." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

// Update-task
router.put("/update-task/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc } = req.body;

    await taskModal.findByIdAndUpdate(id, { title: title, desc: desc });
    res.status(200).json({ message: "Task Updated successfully..." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

// Update-Imp-Task
router.put("/update-imp-task/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const taskData = await taskModal.findById(id);
    const impTask = taskData.important;
    await taskModal.findByIdAndUpdate(id, { important: !impTask });
    res.status(200).json({ message: "impTask Updated successfully..." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

// Update-comp-Task
router.put("/update-comp-task/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const taskData = await taskModal.findById(id);
    const compTask = taskData.incomplete;
    await taskModal.findByIdAndUpdate(id, { incomplete: !compTask });
    res.status(200).json({ message: "impTask Updated successfully..." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

// Get-imp-task
router.get("/get-imp-task", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await userModal
      .findById(id)
      .populate({
        path: "tasks",
        match: { important: true},
        options: { sort: { createdAt: -1 } } ,
      });
    const impTask = user.tasks;

    res.status(200).json({ data: impTask });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});


// Get-comp-task
router.get("/get-comp-task", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await userModal
      .findById(id)
      .populate({
        path: "tasks",
        match: { incomplete: true},
        options: { sort: { createdAt: -1 } } ,
      });
    const compTask = user.tasks;

    res.status(200).json({ data: compTask });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});


// Get-Incomp-task
router.get("/get-inComp-task", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await userModal
      .findById(id)
      .populate({
        path: "tasks",
        match: { incomplete: false},
        options: { sort: { createdAt: -1 } } ,
      });
    const compTask = user.tasks;

    res.status(200).json({ data: compTask });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
