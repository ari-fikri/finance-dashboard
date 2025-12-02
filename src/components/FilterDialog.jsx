import React, { useState } from 'react';

const FilterDialog = ({
  title,
  values,
  onApply,
  onClose,
}) => {
  const [searchText, setSearchText] = useState('');
  const [checkedValues, setCheckedValues] = useState(values);

  const handleCheckboxChange = (value) => {
    setCheckedValues((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const filteredValues = values.filter((value) =>
    value.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{
      position: 'absolute',
      top: '40px',
      left: '0',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      zIndex: 100,
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      width: '250px',
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Filter by {title}</h3>
      <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <div style={{ maxHeight: '200px', overflowY: 'auto', textAlign: 'left' }}>
        {filteredValues.map((value) => (
          <div key={value}>
            <input
              type="checkbox"
              id={value}
              checked={checkedValues.includes(value)}
              onChange={() => handleCheckboxChange(value)}
            />
            <label htmlFor={value} style={{ marginLeft: '8px' }}>{value}</label>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc' }}>Cancel</button>
        <button onClick={() => onApply(checkedValues)} style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: '#2563eb', color: 'white' }}>Apply</button>
      </div>
    </div>
  );
};

export default FilterDialog;