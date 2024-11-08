import React, { useEffect, useRef } from 'react';

interface AddGroupModalProps {
  show: boolean;
  groupName: string;
  selectedColor: string;
  colors: string[];
  usedColors: string[];
  onClose: () => void;
  onNameChange: (name: string) => void;
  onColorSelect: (color: string) => void;
  onSubmit: () => void;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({
  show,
  groupName,
  selectedColor,
  colors,
  usedColors,
  onClose,
  onNameChange,
  onColorSelect,
  onSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && groupName.trim()) {
      onSubmit();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Agregar Grupo</h2>
        
        <input
          ref={inputRef}
          type="text"
          value={groupName}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nombre del Grupo"
          className="w-full p-2 border rounded mb-4"
        />

        <div className="flex gap-2 mb-4">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => onColorSelect(color)}
              className={`w-8 h-8 rounded-full ${
                selectedColor === color ? 'ring-2 ring-offset-2 ring-black' : ''
              } ${usedColors.includes(color) ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ backgroundColor: color }}
              disabled={usedColors.includes(color)}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={!groupName.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGroupModal;