import { Cloudinary } from '@cloudinary/url-gen';

const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const cloudinary = new Cloudinary({
    cloud: {
        cloudName: CLOUDINARY_CLOUD_NAME
    },
    url: {
        secure: true
    }
});

export const uploadImageToCloudinary = async (
    imageUri: string,
    folder: string = 'posts'
): Promise<string> => {
    try {
        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
            throw new Error('Cloudinary credentials not configured');
        }

        const formData = new FormData();
        
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // @ts-ignore
        formData.append('file', {
            uri: imageUri,
            type: type,
            name: filename,
        });

        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', folder);

        const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
        
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Upload failed: ${response.status}`;
            
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error?.message || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }
            
            console.error('Cloudinary error:', errorMessage);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        console.log('Image uploaded to Cloudinary:', data.secure_url);
        
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

export const deleteImageFromCloudinary = async (publicId: string): Promise<boolean> => {
    try {
        console.warn('Delete image should be done from backend for security');
        return false;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        return false;
    }
};

export const extractPublicIdFromUrl = (url: string): string | null => {
    try {
        const regex = /\/v\d+\/(.+)\.\w+$/;
        const match = url.match(regex);
        return match ? match[1] : null;
    } catch (error) {
        console.error('Error extracting public_id:', error);
        return null;
    }
};

export const validateCloudinaryConfig = (): boolean => {
    return !!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET);
};
