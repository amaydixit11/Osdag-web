import { X } from 'lucide-react';
import React, { useCallback } from 'react';


const Field = ({ label, value, unit = '', onClick = null, required = false, type = 'result' }) => {
  const isInput = type === 'input';
  
  if (onClick) {
    return (
      <div className="mb-1">
        <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
        <button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded px-2 py-1.5 text-xs text-center font-medium"
          onClick={onClick}
        >
          {label} Details
        </button>
      </div>
    );
  }
  
  return (
    <div className="mb-1">
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className={`w-full rounded px-2 py-1.5 text-xs ${isInput ? 'border border-gray-300 bg-white' : 'bg-gray-200'}`}>
        <span>{unit ? `${value} ${unit}` : value}</span>
      </div>
    </div>
  );
};

const Subsection = ({ title, fields }) => (
  <div className="mt-2 pt-2 border-t border-gray-200">
    {title && <h4 className="font-medium text-xs text-gray-700 mb-1">{title}</h4>}
    <div className="space-y-1">
      {fields.map(field => (
        <Field 
          key={field.id}
          label={field.label}
          value={field.value}
          unit={field.unit}
          onClick={field.onClick}
          required={field.required}
          type={field.type}
        />
      ))}
    </div>
  </div>
);

const Section = ({ title, subtitle, fields = [], subsections = [] }) => (
  <section className="bg-gray-50 p-2 rounded-lg shadow-sm mb-1">
    <h3 className="font-bold text-gray-800 mb-1 border-b pb-1 text-sm">{title}</h3>
    {subtitle && <h4 className="font-medium text-xs text-gray-700 mb-1">{subtitle}</h4>}
    <div className="space-y-1">
      {fields.map(field => (
        <Field 
          key={field.id}
          label={field.label}
          value={field.value}
          unit={field.unit}
          onClick={field.onClick}
          required={field.required}
          type={field.type}
        />
      ))}
      
      {subsections.map(subsection => (
        <Subsection 
          key={subsection.id}
          title={subsection.title}
          fields={subsection.fields}
        />
      ))}
    </div>
  </section>
);

const OutputDock = ({ show, onClose, data, actions }) => {
  const handleAction = useCallback((action) => {
    if (typeof action.onClick === 'function') {
      action.onClick();
    }
  }, []);

  return (
    <div 
      className={`bg-white shadow-md ${show ? 'w-[320px]' : 'w-0'} transition-all duration-300 flex flex-col`}
      style={{ height: '97vh' }}
    >
      {show && (
        <>
          <div className="flex justify-between items-center px-3 py-2 bg-gray-800 text-white">
            <span className="font-medium text-sm">{data?.title || 'Output Results'}</span>
            <button onClick={onClose} className="text-gray-300 hover:text-white">
              <X size={18} />
            </button>
          </div>
          
          <div 
            className="p-3 text-xs overflow-y-auto" 
            style={{ height: 'calc(100vh - 88px)' }}
          >
            {data?.sections?.map(section => (
              <Section
                key={section.id}
                title={section.title}
                subtitle={section.subtitle}
                fields={section.fields}
                subsections={section.subsections}
              />
            ))}
          </div>
          
          <div className="px-3 py-2 bg-gray-100 border-t">
            <div className="flex gap-2">
              {actions?.map(action => (
                <button 
                  key={action.id}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 rounded transition-colors text-xs flex items-center justify-center"
                  onClick={() => handleAction(action)}
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

export default OutputDock;