import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import defaultImage from "../resources/images/default.jpg";

const SortableItem = ({ id, section }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

      const renderSection = (section) => {
        switch(section.category) {
            case "header": 
                return <div className="header">
                            <h1>{section.content || ''}</h1>
                        </div>
                
            case "footer": 
                return <div className="footer">
                            <p>{section.content || ''}</p>
                        </div>

            case "paragraph": 
                return <div className="content">
                            <p>{section.content || ''}</p>
                        </div>

            case "link": 
                return <div className="link">
                            <a href={section.content || ''} className="cta-button">Get Started</a>
                        </div>
                
            case "image":
                return <div class="image-container">
                            <img src={decodeURIComponent(section.content) || defaultImage} alt="Header Image" style={{maxWidth: '100%', height: "auto"}}/>
                        </div>
        }
    }

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className="sortable-item section"
        >
            {renderSection(section)}
        </div>
    );
};

export default SortableItem;
