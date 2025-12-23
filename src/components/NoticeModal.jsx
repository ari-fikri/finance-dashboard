import React from 'react';

const NoticeMessage = ({ from, fromDept, to, toDept, timestamp, message }) => (
  <div style={{
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '0.25rem',
    padding: '1rem',
    margin: '1rem',
    maxWidth: '80%',
    alignSelf: 'flex-start',
    position: 'relative',
  }}>
    <div style={{ fontSize: 12, color: '#6c757d', position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
      <i className="far fa-clock"></i> {timestamp}
    </div>
    <div style={{fontSize: 12, textAlign: 'left'}}>
      <span style={{ fontWeight: 'bold' }}>From: {from}</span>
      <br />
      <span>{fromDept}</span>
      <br />
      <span style={{ fontWeight: 'bold' }}>To: {to}</span>
      <br />
      <span>{toDept}</span>
    </div>
    <p style={{fontSize: 12, marginTop: '1rem', textAlign: 'left'}}>{message}</p>
  </div>
);

const NoticeModal = ({ isOpen, onClose, isDphUser }) => {
  if (!isOpen) {
    return null;
  }

  const notices = [
    {
      from: '09105014 - YOPI PARADA E.H.',
      fromDept: 'Finance Dept',
      to: '01526996 - Yunita Aldora',
      toDept: 'Finance Dept',
      timestamp: '16/12/2025 13:50',
      message: 'Tolong lengkapi Remark utk Material Cost',
    },
      {
      from: '09105014 - YOPI PARADA E.H.',
      fromDept: 'Finance Dept',
      to: '2010456 - Suharno',
      toDept: 'Finance Dept',
      timestamp: '17/12/2025 09:50',
      message: 'Periksa kembali Total Material Cost value, pastikan tidak lewat threshold lebih dari 7%',
    },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        width: '500px',
        background: '#fff',
        borderRadius: '5px',
        border: '1px solid #ccc',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ 
            padding: '10px', 
            backgroundColor: '#357ab7', 
            color: 'white', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px'
        }}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <i className="far fa-comment-alt" style={{ marginRight: '8px' }}></i>
              <h3 style={{margin: 0, fontSize: '16px'}}>Notice</h3>
            </div>
            <button onClick={onClose} style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer'
            }}>
              &times;
            </button>
        </div>
        {isDphUser && (
          <div style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', background: '#e9ecef' }}>
            <input id="to-input" type="text" defaultValue="Yunita Aldora" style={{ flexGrow: 1, border: '1px solid #ccc', borderRadius: '3px', padding: '5px' }} />
            <button style={{ marginLeft: '10px', border: '1px solid #ccc', borderRadius: '3px', padding: '5px', background: '#f0f0f0' }}>
              <i className="fas fa-search"></i>
            </button>
            <button style={{ marginLeft: '5px', border: '1px solid #ccc', borderRadius: '3px', padding: '5px', background: '#f0f0f0' }}>
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
        )}
        <div className="messages" style={{ maxHeight: '300px', overflowY: 'auto', background: '#fff' }}>
          {notices.map((notice, index) => (
            <NoticeMessage key={index} {...notice} />
          ))}
        </div>
        {isDphUser && (
          <div style={{ padding: '10px', borderTop: '1px solid #ccc', display: 'flex', background: '#f8f9fa' }}>
            <input
              type="text"
              placeholder="Type your message here..."
              style={{ flexGrow: 1, border: '1px solid #ccc', borderRadius: '3px', padding: '5px' }}
            />
            <button style={{ marginLeft: '10px', border: 'none', borderRadius: '3px', padding: '5px 10px', background: '#ffc107', color: 'white', cursor: 'pointer' }}>
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeModal;