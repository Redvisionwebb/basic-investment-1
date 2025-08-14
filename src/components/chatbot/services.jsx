'use client';
import { useState } from 'react';

const ServiceCheckboxStep = ({ steps, triggerNextStep, options }) => {
    const [selected, setSelected] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    const handleToggle = (serviceName) => {
        setSelected((prev) =>
            prev.includes(serviceName)
                ? prev.filter((s) => s !== serviceName)
                : [...prev, serviceName]
        );
    };

    const handleSubmit = () => {
        if (selected.length > 0) {
            setSubmitted(true);
            triggerNextStep({ value: selected });
        }
    };

    return (
        <div>
            <p>Select your services:</p>
            <div className="flex flex-col space-y-2">
                {options?.map((service) => (
                    <label key={service._id || service.name} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            value={service.name}
                            checked={selected.includes(service.name)}
                            onChange={() => handleToggle(service.name)}
                        />
                        <span>{service.name}</span>
                    </label>
                ))}
            </div>
            <button
                onClick={handleSubmit}
                disabled={selected.length === 0 || submitted}
                className="mt-4 bg-green-500 text-white py-1 px-3 rounded"
            >
                Submit
            </button>
        </div>
    );
};

export default ServiceCheckboxStep;
