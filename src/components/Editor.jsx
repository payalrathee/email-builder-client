import axios from 'axios';
import React, { useState } from 'react'

const Editor = (props) => {

let { template, setTemplate } = props;
const [files, setFiles] = useState([]);
let [error, setError] = useState(null);
let [success, setSuccess] = useState(null);
let [loading, setLoading] = useState(false);
let [fieldErrors, setFieldErrors] = useState({});

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTemplate((prevData) => {
        return {
            ...prevData,
            [name]: value
        }
    })
}

const handleSectionInputChange = (e) => {
    const { name, value } = e.target;

    let updatedSections = template.sections.map((section) => {
        if(name === section.name) {
            return {
                ...section,
                content: value
            }
        } else {
            return {...section};
        }
    })

    setTemplate((prevData) => {
        return {
            ...prevData,
            sections: updatedSections
        }
    })
}

const handleFileChange = (e, name) => {
    const selectedFile = e.target.files[0];
    
        setFiles((prevFiles) => [...prevFiles, { name, file: selectedFile }]);

        if (selectedFile) {
            const previewUrl = URL.createObjectURL(selectedFile);

            setTemplate((prevData) => {
                let updatedSections = template.sections.map((section) => (
                    section.category === name 
                        ? {...section,content: previewUrl}
                        : section
                ))

                return {
                    ...prevData,
                    sections: updatedSections
                }
            });
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
        let uploadedFiles = [];

        // Upload files first
        if (files.length > 0) {
            const uploadPromises = files.map(async (item) => {
                const formData = new FormData();
                formData.append("file", item.file);

                const uploadResponse = await axios.post(`${backendUrl}/file/upload`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                return {
                    name: item.name,
                    url: uploadResponse.data.file.url
                };
            });

            uploadedFiles = await Promise.all(uploadPromises);
        }

        // Update template sections with uploaded file URLs
        const updatedSections = template.sections.map((section) => {
            const uploadedFile = uploadedFiles.find((file) => file.name === section.category);
            return uploadedFile ? { ...section, content: uploadedFile.url } : section;
        });

        const updatedTemplate = {
            ...template,
            sections: updatedSections
        };

        // Save template after all files are uploaded
        let response = null;
        if (template.id !== undefined) {
            response = await axios.put(`${backendUrl}/template/${template.id}`, { template: updatedTemplate });
        } else {
            response = await axios.post(`${backendUrl}/template`, { template: updatedTemplate });
        }

        // Success message
        setSuccess(response.data.message || "Template saved successfully!");
        setTemplate(response.data.template);
        setFiles([]);

        // Clear success message after 3 seconds
        setTimeout(() => {
            setSuccess(null);
        }, 3000);

    } catch (err) {
        console.log(err);
        if (err.response?.data?.fieldErrors) {
            setFieldErrors(err.response?.data?.fieldErrors || {});
        } else {
            setError(err.response?.data?.message || "An error occurred while saving the template.");
            setTimeout(() => setError(null), 3000);
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

    if(!template.id) {
        setError('Template not saved yet. Please save the template and download.');
        setTimeout(() => {
            setError(null);
          }, 5000);
        return;
    }

    try {
        const response = await axios.get(`${backendUrl}/template/render/${template.id}`);
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
                value={template.name}
                placeholder='Enter template name'
                onChange={handleInputChange}/>
            {fieldErrors?.["template.name"] && (<p style={{ color: 'red' }}>{fieldErrors["template.name"]}</p>)}

        </div>
        <div className='editor-item'>
            <h4>Description</h4>
            <input 
                type='text' 
                name="description"
                value={template.description}
                placeholder='Enter template description'
                onChange={handleInputChange}/>
            {fieldErrors?.["template.description"] && (<p style={{ color: 'red' }}>{fieldErrors["template.description"]}</p>)}

        </div>

        <div className='editor-header'>Sections</div>

        {
            template.sections.map((section) => {
                return (<div key={section.order} className='editor-item'>
                    <h4>{section.category}</h4>

                    {section.category === "image" && (
                        <input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => {handleFileChange(e, section.name)}}
                        />
                    )}
                    
                    <input 
                        type={section.type} 
                        name={section.name}
                        value={section.category === 'image' ? decodeURIComponent(section.content) : section.content}
                        placeholder='Enter value'
                        onChange={handleSectionInputChange}/>
                    {fieldErrors?.[`template.${section.type}`] && (<p style={{ color: 'red' }}>{fieldErrors[`template.${section.type}`]}</p>)}
                </div>)
            })
        }
    </div>
)
}

export default Editor