import axios from 'axios';
import React, { useState } from 'react'

const Editor = (props) => {

let { templateData, setTemplateData } = props;
let [file, setFile] = useState(null);
let [error, setError] = useState(null);
let [success, setSuccess] = useState(null);
let [loading, setLoading] = useState(false);
let [fieldErrors, setFieldErrors] = useState({});

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTemplateData((prevData) => {
    return {
        ...prevData,
        [name]: value
    }
    })
}

const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const previewUrl = URL.createObjectURL(selectedFile);
            setTemplateData((prevData) => ({
                ...prevData,
                imageUrl: previewUrl,
            }));
        }
}

const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});
    setLoading(true);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    try {
        let uploadedFileUrl = null;
    
        // Upload file
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            const uploadResponse = await axios.post(`${backendUrl}/file/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            uploadedFileUrl = uploadResponse.data.file.url; 
    
            setTemplateData((prevData) => ({
                ...prevData,
                imageUrl: uploadedFileUrl,
            }));
            setFile(null);
        }
    
        const updatedTemplateData = {
            ...templateData,
            imageUrl: uploadedFileUrl || templateData.imageUrl, 
        };
    
        let response = null;
        if (templateData.id !== undefined) {
            response = await axios.put(`${backendUrl}/template/${templateData.id}`, { template: updatedTemplateData });
        } else {
            response = await axios.post(`${backendUrl}/template`, { template: updatedTemplateData });
        }
    
        // Success message
        setSuccess(response.data.message || 'Template saved successfully!');
        setTemplateData(response.data.template);
    
        // Clear success message after 3 seconds
        setTimeout(() => {
            setSuccess(null);
        }, 3000);
    
    } catch (err) {
        console.log(err);
        if(err.response?.data?.fieldErrors) {
            setFieldErrors(err.response?.data?.fieldErrors || {});
        } else {
            setError(
                err.response?.data?.message || 'An error occurred while saving the template.'
            );
            setTimeout(() => {
                setError(null);
              }, 3000);
        }
    
    } finally {
        setLoading(false);
    }
};

const fetchHtml = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    if(!templateData.id) {
        setError('Template not saved yet. Please save the template and download.');
        setTimeout(() => {
            setError(null);
          }, 5000);
        return;
    }

    try {
        const response = await axios.get(`${backendUrl}/template/render/${templateData.id}`);
        const htmlContent = response.data;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'template.html';
        link.click();
        URL.revokeObjectURL(url); 
    } catch (err) {
        console.log(err);
        if(err.response?.data?.fieldErrors) {
            setFieldErrors(err.response?.data?.fieldErrors || {});
        } else {
            setError(
                err.response?.data?.message || 'An error occurred while downloading the template.'
            );
            setTimeout(() => {
                setError(null);
              }, 3000);
        }
    }
};


return (
    <div className='editor'>
    {error && <p className='msg-error'>{error}</p>}
    {success && <p className='msg-success'>{success}</p>}
    <div className='editor-item buttons-wrapper'>
        <button type="submit" disabled={loading} onClick={handleSubmit}>
            {loading ? 'Saving...' : 'Save'}
        </button>
        <button onClick={fetchHtml}>Download</button>
    </div>
    <div className='editor-item'>
        <h4>Name</h4>
        <input 
            type='text' 
            name="name"
            value={templateData.name}
            placeholder='Enter template name'
            onChange={handleInputChange}/>
        {fieldErrors?.["template.name"] && (<p style={{ color: 'red' }}>{fieldErrors["template.name"]}</p>)}

    </div>
    <div className='editor-item'>
        <h4>Description</h4>
        <input 
            type='text' 
            name="description"
            value={templateData.description}
            placeholder='Enter template description'
            onChange={handleInputChange}/>
        {fieldErrors?.["template.description"] && (<p style={{ color: 'red' }}>{fieldErrors["template.description"]}</p>)}

    </div>
    <div className='editor-item'>
        <h4>Heading</h4>
        <input 
            type='text' 
            name="header"
            value={templateData.header}
            placeholder='Enter heading'
            onChange={handleInputChange}/>
        {fieldErrors?.["template.header"] && (<p style={{ color: 'red' }}>{fieldErrors["template.header"]}</p>)}
    </div>
    <div className='editor-item'>
        <h4>Image</h4>
        <input 
            type='file'
            onChange={handleFileChange}/>
    </div>
    <div className='editor-item'>
        <h4>Content</h4>
        <textarea
            name='content'
            value={templateData.content} 
            placeholder='Enter content'
            onChange={handleInputChange}>{templateData.content}</textarea>
        {fieldErrors?.["template.content"] && (<p style={{ color: 'red' }}>{fieldErrors["template.content"]}</p>)}
    </div>
    <div className='editor-item'>
        <h4>Link</h4>
        <input 
            type='text'
            name='link'
            value={templateData.link}
            placeholder='Enter url'
            onChange={handleInputChange}/>
        {fieldErrors?.["template.link"] && (<p style={{ color: 'red' }}>{fieldErrors["template.link"]}</p>)}
    </div>
    <div className='editor-item'>
        <h4>Footer</h4>
        <input 
            type='text'
            name='footer'
            value={templateData.footer} 
            placeholder='Enter footer text'
            onChange={handleInputChange}/>
        {fieldErrors?.["template.footer"] && (<p style={{ color: 'red' }}>{fieldErrors["template.footer"]}</p>)}
    </div>
    </div>
)
}

export default Editor