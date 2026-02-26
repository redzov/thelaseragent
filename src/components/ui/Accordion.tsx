"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Minus } from "lucide-react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  section?: string;
}

function AccordionRow({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [isOpen]);

  return (
    <div className="border-b border-[#333] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-1 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span className="text-white font-medium pr-4 group-hover:text-[#2196F3] transition-colors">
          {item.question}
        </span>
        <span className="flex-shrink-0 text-[#2196F3]">
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </span>
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <div className="pb-5 px-1 text-[#c9c9c9] leading-relaxed">{item.answer}</div>
      </div>
    </div>
  );
}

export default function Accordion({ items, section }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <div>
      {section && (
        <h3 className="text-xl font-semibold text-white mb-4">{section}</h3>
      )}
      <div className="border-t border-[#333]">
        {items.map((item, index) => (
          <AccordionRow
            key={index}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </div>
  );
}
