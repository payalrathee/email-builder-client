
import { useState } from "react";
import Editor from "./components/Editor";
import Template from "./components/Template";
import "./resources/styles/style.css";

const App = () => {

let [templateData, setTemplateData] = useState({
    name: "",
    description: "",
    header: "Welcome to Our Service!",
    imageUrl: "",
    content: "Thank you for signing up! We're excited to have you on board. Our service is designed to make your life easier and help you achieve your goals.",
    link: "",
    footer: "© 2025 Our Service. All rights reserved.",
});

return (
    <div className="app">
    <Editor templateData={templateData} setTemplateData={setTemplateData} />
    <Template templateData={templateData} />
    </div>
);
};

export default App;
