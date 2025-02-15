import React, { useEffect, useState } from "react";
import "../resources/styles/template.css"
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";

const Template = ({ template, setTemplate }) => {

    // Handle drag and drop sorting
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = template.sections.findIndex((s) => s.order === active.id);
        const newIndex = template.sections.findIndex((s) => s.order === over.id);

        const newSections = arrayMove(template.sections, oldIndex, newIndex).map((section, index) => ({
            ...section,
            order: index + 1, 
        }));

        setTemplate((prev) => ({
            ...prev,
            sections: newSections,
        }));
    };

    return (
        <div className="template">    
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={template.sections.map((s) => s.order)} strategy={verticalListSortingStrategy}>
                    <div className="sortable-container email-container">
                        {template.sections.map((section) => (
                            <SortableItem key={section.order} id={section.order} section={section} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default Template;
