// AvatarCropper.js
import React, { useState } from 'react';
import Avatar from 'react-avatar-edit';

const AvatarCropper = ({ onCrop, onClose }) => {
    const [src, setSrc] = useState(null);

    return (
        <Avatar
            width={390}
            height={295}
            onCrop={onCrop}
            onClose={onClose}
            src={src}
            onFileLoad={(file) => setSrc(file)}
        />
    );
};

export default AvatarCropper;
