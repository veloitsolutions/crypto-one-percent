
const Task = require('../Models/Task');
const User = require('../Models/User');

// Create a new task (Admin)
exports.createTask = async (req, res) => {
    try {
        const { title, url, rewardAmount } = req.body;

        const task = await Task.create({
            title,
            url,
            rewardAmount: Number(rewardAmount),
            type: 'video'
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating task",
            error: error.message
        });
    }
};

// Get all tasks (User/Admin)
// For users, it also flags if they have completed it
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ active: true }).sort({ createdAt: -1 });
        const user = await User.findById(req.user.id);

        const tasksWithStatus = tasks.map(task => ({
            ...task.toObject(),
            completed: user.completedTasks.includes(task._id)
        }));

        res.status(200).json({
            success: true,
            tasks: tasksWithStatus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching tasks",
            error: error.message
        });
    }
};

// Complete a task (User)
exports.completeTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        const task = await Task.findById(taskId);
        if (!task || !task.active) {
            return res.status(404).json({
                success: false,
                message: "Task not found or inactive"
            });
        }

        const user = await User.findById(userId);
        if (user.completedTasks.includes(taskId)) {
            return res.status(400).json({
                success: false,
                message: "Task already completed"
            });
        }

        // Verify video watch? (Simplified: Trust the client call for now, usually requires webhook or timed delay)
        // Here we assume the frontend calls this after the video ends.

        user.completedTasks.push(taskId);
        user.tokenBalance += task.rewardAmount;
        await user.save();

        res.status(200).json({
            success: true,
            message: `Task completed! You earned ${task.rewardAmount} tokens.`,
            newBalance: user.tokenBalance
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error completing task",
            error: error.message
        });
    }
};

// Delete Task (Admin)
exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.taskId);
        res.status(200).json({
            success: true,
            message: "Task deleted"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting task" });
    }
};
