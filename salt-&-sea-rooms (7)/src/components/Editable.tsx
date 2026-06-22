import React from 'react';
import { useCustomizer, EditElement } from '../context/CustomizerContext';
import { Pencil } from 'lucide-react';

interface EditableTextProps {
  fieldKey: string;
  label: string;
  value: string;
  type?: 'text' | 'textarea';
  onSave: (value: string) => void;
  className?: string;
  as?: React.ElementType;
  children?: React.ReactNode;
}

export const EditableText: React.FC<EditableTextProps> = ({
  fieldKey,
  label,
  value,
  type = 'text',
  onSave,
  className = '',
  as: Component = 'span',
  children,
}) => {
  const { isEditingMode, setSelectedEditElement } = useCustomizer();

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditingMode) return;
    e.preventDefault();
    e.stopPropagation();
    setSelectedEditElement({
      id: fieldKey,
      label,
      value,
      type,
      onSave,
    });
  };

  const content = children || value;

  if (!isEditingMode) {
    return <Component className={className}>{content}</Component>;
  }

  return (
    <Component
      onClick={handleClick}
      className={`group/editable relative inline-block cursor-pointer border border-dashed border-transparent hover:border-brand/50 hover:bg-brand/5 rounded px-1 transition-all duration-150 ${className}`}
      title={`Κάντε κλικ για επεξεργασία: ${label}`}
    >
      {content}
      <span className="absolute -top-3 -right-2 opacity-0 group-hover/editable:opacity-100 bg-brand text-white p-1 rounded-full shadow-xs transition-opacity duration-150 z-20 pointer-events-none">
        <Pencil className="h-2.5 w-2.5" />
      </span>
    </Component>
  );
};

interface EditableImageProps {
  fieldKey: string;
  label: string;
  src: string;
  onSave: (value: string) => void;
  className?: string;
  alt?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  fieldKey,
  label,
  src,
  onSave,
  className = '',
  alt = '',
  referrerPolicy,
}) => {
  const { isEditingMode, setSelectedEditElement } = useCustomizer();

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditingMode) return;
    e.preventDefault();
    e.stopPropagation();
    setSelectedEditElement({
      id: fieldKey,
      label,
      value: src,
      type: 'image',
      onSave,
    });
  };

  if (!isEditingMode) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        referrerPolicy={referrerPolicy}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`group/editable relative cursor-pointer overflow-hidden border-2 border-dashed border-transparent hover:border-brand hover:shadow-md transition-all duration-200 rounded-xl ${className}`}
      title={`Κάντε κλικ για αλλαγή φωτογραφίας: ${label}`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-all duration-300 group-hover/editable:scale-105 group-hover/editable:brightness-95"
        referrerPolicy={referrerPolicy}
      />
      <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover/editable:opacity-100 flex items-center justify-center transition-all duration-200">
        <div className="bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-warm-border shadow-md flex items-center space-x-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider scale-90 group-hover/editable:scale-100 transition-transform duration-200">
          <Pencil className="h-3.5 w-3.5 text-brand" />
          <span>Αλλαγή Φωτογραφίας 📷</span>
        </div>
      </div>
    </div>
  );
};
