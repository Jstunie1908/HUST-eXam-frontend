import React, { useEffect, useRef, useState } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, IconButton } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AddImage(props) {
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        console.log(files);
    });

    const handleFileUpload = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const fileList = event.target.files;
        const newFiles = Array.from(fileList).map((file) => ({
            file,
            name: file.name,
        }));
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const handleDeleteFile = (fileIndex) => {
        setFiles((prevFiles) => prevFiles.filter((_, index) => index !== fileIndex));
    };

    const uploadFile = async () => {
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const sendFile = files[i].file;
                const formData = new FormData();
                formData.append('filename', sendFile);
                try {
                    const response = await axios.post(`http://localhost:8001/api/upload/question/${props.questionID}`, formData);
                    console.log(response.data);
                } catch (error) {
                    console.error(error);
                }
                props.setRefresh(!props.refresh);
            }
            toast.success("Saved Image", { autoClose: 2000 });
        }
        else {
            toast.info("No image upload", { autoClose: 2000 });
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple // Cho phép người dùng chọn nhiều file
            />
            <IconButton onClick={handleFileUpload} className="icon-button">
                <FileUploadIcon />
            </IconButton>
            {files.map((file, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontStyle: "italic" }}>{file.name}</span>
                    <IconButton onClick={() => handleDeleteFile(index)} className="icon-button">
                        <DeleteIcon />
                    </IconButton>
                </div>
            ))}
            <Button variant="contained" className="icon-button" onClick={uploadFile}>
                Save Image
            </Button>
        </div>
    );
}
