import { X } from 'lucide-react';
import React, { useState, useCallback } from 'react';

// Reusable form field component
const FormField = ({ id, label, name, type, value, onChange, options, required, placeholder }) => {
  if (type === 'select') {
    return (
      <div className="mb-1">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
        >
          {options.map((option, idx) => (
            <option key={`${id}-option-${idx}`} value={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="mb-1">
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        placeholder={placeholder}
      />
    </div>
  );
};

// Reusable form subsection component
const FormSubsection = ({ id, title, fields, formData, onChange }) => (
  <div className="mt-2 pt-2 border-t border-gray-200">
    {title && <h4 className="font-medium text-xs text-gray-700 mb-1">{title}</h4>}
    <div className="space-y-1">
      {fields.map(field => (
        <FormField 
          key={`${id}-field-${field.id}`}
          id={`${id}-field-${field.id}`}
          label={field.label}
          name={field.name}
          type={field.type}
          value={formData[field.name]}
          onChange={onChange}
          options={field.options}
          required={field.required}
          placeholder={field.placeholder}
        />
      ))}
    </div>
  </div>
);

// Reusable form section component
const FormSection = ({ id, title, subtitle, fields, subsections, formData, onChange }) => (
  <section className="bg-gray-50 p-2 rounded-lg shadow-sm mb-1">
    <h3 className="font-bold text-gray-800 mb-1 border-b pb-1 text-sm">{title}</h3>
    {subtitle && <h4 className="font-medium text-xs text-gray-700 mb-1">{subtitle}</h4>}
    <div className="space-y-1">
      {fields && fields.map(field => (
        <FormField 
          key={`${id}-field-${field.id}`}
          id={`${id}-field-${field.id}`}
          label={field.label}
          name={field.name}
          type={field.type}
          value={formData[field.name]}
          onChange={onChange}
          options={field.options}
          required={field.required}
          placeholder={field.placeholder}
        />
      ))}
      
      {subsections && subsections.map(subsection => (
        <FormSubsection 
          key={`${id}-subsection-${subsection.id}`}
          id={`${id}-subsection-${subsection.id}`}
          title={subsection.title}
          fields={subsection.fields}
          formData={formData}
          onChange={onChange}
        />
      ))}
    </div>
  </section>
);

const InputDock = ({ show, onClose, title = 'Input Parameters', sections = [], initialFormData = {}, actions = [] }) => {
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAction = useCallback((action) => {
    if (typeof action.onClick === 'function') {
      action.onClick(formData);
    }
  }, [formData]);

  const handleReset = useCallback(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  return (
    <div 
      className={`bg-white shadow-md ${show ? 'w-[320px]' : 'w-0'} transition-all duration-300 flex flex-col`}
      style={{ height: '97vh' }}
    >
      {show && (
        <>
          <div className="flex justify-between items-center px-3 py-2 bg-gray-800 text-white">
            <span className="font-medium text-sm">{title}</span>
            <button onClick={onClose} className="text-gray-300 hover:text-white">
              <X size={18} />
            </button>
          </div>
          
          <div 
            className="p-3 text-xs overflow-y-auto flex-1" 
            style={{ height: 'calc(100vh - 88px)' }}
          >
            {sections.map(section => (
              <FormSection
                key={`section-${section.id}`}
                id={`section-${section.id}`}
                title={section.title}
                subtitle={section.subtitle}
                fields={section.fields}
                subsections={section.subsections}
                formData={formData}
                onChange={handleInputChange}
              />
            ))}
            
            {sections.length > 0 && (
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-md border border-gray-200 mt-3">
                <span className="text-red-500">*</span> Required fields
              </div>
            )}
          </div>
          
          <div className="px-3 py-2 bg-gray-100 border-t">
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1.5 rounded transition-colors text-xs"
              >
                Reset
              </button>
              {actions.map(action => (
                <button 
                  key={`action-${action.id}`}
                  className={`flex-1 ${action.disabled ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-1.5 rounded transition-colors text-xs`}
                  onClick={() => handleAction(action)}
                  disabled={action.disabled}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InputDock;