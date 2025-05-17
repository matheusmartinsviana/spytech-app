'use client';

import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface FormatInsightProps {
    text?: string;
}

const FormatInsight: React.FC<FormatInsightProps> = ({ text }) => {
    const [sections, setSections] = useState<{ title?: string; html: string }[]>([]);
    const [openSections, setOpenSections] = useState<Set<number>>(new Set());

    useEffect(() => {
        const parseText = async () => {
            if (!text) return;

            const tokens = marked.lexer(text);
            let currentSection: { title?: string; content: string } = { content: '' };
            const tempSections: { title?: string; html: string }[] = [];

            for (const token of tokens) {
                if (token.type === 'heading' && token.depth === 2) {
                    // salva a seção anterior, se existir
                    if (currentSection.content) {
                        tempSections.push({
                            title: currentSection.title,
                            html: DOMPurify.sanitize(await marked.parse(currentSection.content)),
                        });
                    }
                    // inicia nova seção com título separado
                    currentSection = { title: token.text, content: '' };
                } else {
                    currentSection.content += token.raw;
                }
            }

            // adiciona última seção
            if (currentSection.content) {
                tempSections.push({
                    title: currentSection.title,
                    html: DOMPurify.sanitize(await marked.parse(currentSection.content)),
                });
            }

            setSections(tempSections);
        };

        parseText();
    }, [text]);

    const toggleSection = (index: number) => {
        const newOpenSections = new Set(openSections);
        if (newOpenSections.has(index)) {
            newOpenSections.delete(index);
        } else {
            newOpenSections.add(index);
        }
        setOpenSections(newOpenSections);
    };

    if (sections.length === 0) {
        return <p>Não há insights disponíveis para esta análise. Verifique o site enviado.</p>;
    }

    return (
        <div className="space-y-6">
            {sections.map((section, idx) => (
                <div
                    key={idx}
                    className="border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm bg-white dark:bg-zinc-900"
                >
                    <div
                        className="flex justify-between items-center p-4 cursor-pointer"
                        onClick={() => toggleSection(idx)}
                    >
                        <span className="font-semibold">{section.title}</span>
                        <span>{openSections.has(idx) ? '−' : '+'}</span>
                    </div>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out max-h-[0px] opacity-0 ${openSections.has(idx) ? 'max-h-[1000px] opacity-100' : ''
                            }`}
                    >
                        <div
                            className="prose prose-sm dark:prose-invert p-4"
                            dangerouslySetInnerHTML={{ __html: section.html }} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FormatInsight;
