import React, { useEffect, useState } from "react";
import axios from "axios";
import loadingIcon from "../resources/images/loading.gif";
import defaultImage from "../resources/images/default.jpg";

const Template = ({ templateData }) => {
  const [templateHTML, setTemplateHTML] = useState("");
  const [rawTemplateHTML, setRawTemplateHTML] = useState(""); 
  const [error, setError] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(`${backendUrl}/template/default`);
        setRawTemplateHTML(response.data.template); 
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTemplate();
  }, [backendUrl]);

  useEffect(() => {
    if (rawTemplateHTML) {
      const updatedHTML = rawTemplateHTML
        .replace("{{heading}}", templateData.header)
        .replace("{{imageUrl}}", decodeURIComponent(templateData.imageUrl) || defaultImage)
        .replace("{{content}}", templateData.content)
        .replace("{{link}}", templateData.link || "#")
        .replace("{{footer}}", templateData.footer);

      setTemplateHTML(updatedHTML);
    }
  }, [templateData, rawTemplateHTML]);

  return (
    <div className="template">
      {error ? (
        <p>Error: {error}</p>
      ) : templateHTML ? (
        <div dangerouslySetInnerHTML={{ __html: templateHTML }}></div>
      ) : (
        <img className="loading" src={loadingIcon} alt="loading" />
      )}
    </div>
  );
};

export default Template;
