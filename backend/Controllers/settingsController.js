
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
const cloudinary = require("cloudinary").v2;

function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder, quality) {
    const options = { folder };
    if (quality) {
        options.quality = quality;
    }
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// Update dashboard images (Admin only)
exports.updateDashboardImages = async (req, res) => {
    try {
        const files = req.files; // Access uploaded files

        if (!files || Object.keys(files).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded"
            });
        }

        const uploadedImages = [];
        const supportedTypes = ["jpg", "jpeg", "png", "gif"];

        // Handle both single and multiple file uploads (express-fileupload can return an array or object)
        let fileList = [];
        if (Array.isArray(files.images)) {
            fileList = files.images;
        } else {
            fileList = [files.images];
        }

        if (fileList.length > 4) {
            return res.status(400).json({
                success: false,
                message: "Max 4 images allowed"
            });
        }


        for (const file of fileList) {
            const fileType = file.name.split('.').pop().toLowerCase();

            if (!isFileTypeSupported(fileType, supportedTypes)) {
                return res.status(400).json({
                    success: false,
                    message: "File format not supported"
                });
            }

            const response = await uploadFileToCloudinary(file, "OnePercent");
            uploadedImages.push(response.secure_url);
        }

        const settings = await Settings.findOneAndUpdate(
            { key: 'dashboard_images' },
            {
                value: uploadedImages,
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
