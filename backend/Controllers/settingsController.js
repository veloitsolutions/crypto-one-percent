
const Settings = require('../Models/Settings');

// Get all dashboard images
exports.getDashboardImages = async (req, res) => {
    try {
        let settings = await Settings.findOne({ key: 'dashboard_images' });

        // Return defaults if not found
        if (!settings) {
            return res.status(200).json({
                success: true,
                images: []
            });
        }

        res.status(200).json({
            success: true,
            images: settings.value
        });
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching images"
        });
    }
};

// Update dashboard images (Admin only)
exports.updateDashboardImages = async (req, res) => {
    try {
        const { images } = req.body;

        if (!Array.isArray(images) || images.length > 4) {
            return res.status(400).json({
                success: false,
                message: "Invalid images array (max 4 allowed)"
            });
        }

        const settings = await Settings.findOneAndUpdate(
            { key: 'dashboard_images' },
            {
                value: images,
                updatedAt: Date.now()
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            message: "Images updated successfully",
            images: settings.value
        });
    } catch (error) {
        console.error("Error updating images:", error);
        res.status(500).json({
            success: false,
            message: "Error updating images"
        });
    }
};
