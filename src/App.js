
import { useState } from "react";
import Editor from "./components/Editor";
import Template from "./components/Template";
import "./resources/styles/style.css";

const App = () => {

let [template, setTemplate] = useState({
    name: "",
    description: "",
    sections: [
        {
            name: "header",
            category: "header",
            type: "text",
            content: "Welcome to Our Service!",
            order: 1
        },
        {
            name: "image",
            category: "image",
            type: "text",
            content: "",
            order: 2
        },
        {
            name: "paragraph",
            category: "paragraph",
            type: "text",
            content: "Thank you for signing up! We're excited to have you on board. Our service is designed to make your life easier and help you achieve your goals.",
            order: 3
        },
        {
            name: "link",
            category: "link",
            type: "text",
            content: "",
            order: 4
        },
        {
            name: "footer",
            category: "footer",
            type: "text",
            content: "© 2025 Our Service. All rights reserved.",
            order: 5
        },
    ]
});

return (
    <div className="app">
    <Editor template={template} setTemplate={setTemplate} />
    <Template template={template} setTemplate={setTemplate} />
    </div>
);
};

export default App;
