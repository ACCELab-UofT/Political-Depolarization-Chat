import React, { useState } from 'react';
import { UseChatHelpers } from 'ai/react';
import { Message } from 'ai'

export interface FormState {
    userAlignment: string;
    partnerAlignment: string;
    discussionTopics: string[];
}


const politicalAlignments = [
    'Conservative',
    'Liberal',
    'Libertarian',
    'Socialist',
];

const discussionTopics = [
    'Healthcare',
    'Immigration',
    'Taxes',
    'Climate Change',
];

export function EmptyScreen({ onSubmitForm }) {
    const [formState, setFormState] = useState<FormState>({
        userAlignment: '',
        partnerAlignment: '',
        discussionTopics: []
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleMultiSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const options = event.target.options;
        const values: string[] = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                values.push(options[i].value);
            }
        }
        setFormState(prevState => ({
            ...prevState,
            discussionTopics: values
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const seedPrompt = {
            role: 'system',
            content: `You are a political ${formState.partnerAlignment} who is open to having a fair and friendly discussion with political partisans who do not share your views such as ${formState.userAlignment}. You are interested in the following topics ${formState.discussionTopics.join(', ')}. You share your moral values and beliefs openly and honestly and invite others to do the same. When there are disagreements, you present your view and invite others to do the same.`
        };
        const firstMessage = {
            role: 'assistant',
            content: `Hi, I'm a ${formState.partnerAlignment}. I hear your political views are ${formState.userAlignment}. I would love the opportunity to have an open and fair discussion about the topics you listed: ${formState.discussionTopics} and anything else you'd like to get a ${formState.partnerAlignment}
s views on.`
        };
        let messages = [seedPrompt, firstMessage]
        onSubmitForm(messages)
    };

    return (
        <div className="mx-auto max-w-2xl px-4">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="userAlignment" className="block mb-2">Your Political Alignment</label>
                    <select
                        name="userAlignment"
                        id="userAlignment"
                        value={formState.userAlignment}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    >
                        {politicalAlignments.map(align => (
                            <option key={align} value={align}>{align}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="partnerAlignment" className="block mb-2">Conversational Partner's Alignment</label>
                    <select
                        name="partnerAlignment"
                        id="partnerAlignment"
                        value={formState.partnerAlignment}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    >
                        {politicalAlignments.map(align => (
                            <option key={align} value={align}>{align}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="discussionTopics" className="block mb-2">Preferred Discussion Topics</label>
                    <select
                        name="discussionTopics"
                        id="discussionTopics"
                        multiple
                        value={formState.discussionTopics}
                        onChange={handleMultiSelectChange}
                        className="border rounded p-2 w-full"
                    >
                        {discussionTopics.map(topic => (
                            <option key={topic} value={topic}>{topic}</option>
                        ))}
                    </select>
                    {formState.discussionTopics.includes('Other') && (
                        <input
                            type="text"
                            placeholder="Specify other topics"
                            name="discussionTopicsOther"
                            className="border rounded p-2 w-full mt-2"
                            onChange={handleInputChange}
                        />
                    )}
                </div>

                <button type="submit" className="bg-blue-500 text-white rounded p-2">Submit</button>
            </form>
        </div>
    );
}
