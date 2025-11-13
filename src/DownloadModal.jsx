import React from 'react';

const DownloadModal = ({ isOpen, onClose, files, title, onDelete }) => {
  if (!isOpen) return null;

  const handleDownload = (file) => {
    // This simulates a download. In a real app, you'd fetch the file from a server.
    const csvContent = `This is a placeholder for the content of ${file.name}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>{title}</h2>
          <button onClick={onClose} style={styles.closeButton}>&times;</button>
        </div>
        <div style={styles.body}>
          {files.length > 0 ? (
            files.map((file, index) => (
              <div key={index} style={styles.fileCard}>
                <div>
                  <div style={styles.fileName}>{file.name}</div>
                  <div style={styles.fileMeta}>
                    Uploaded: {new Date(file.uploadDate).toLocaleString()}
                  </div>
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                  <button onClick={() => handleDownload(file)} style={styles.downloadButton}>
                    Download
                  </button>
                  <button onClick={() => onDelete(file.name)} style={styles.deleteButton}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No files have been uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '500px',
    maxWidth: '90%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  body: {
    maxHeight: '400px',
    overflowY: 'auto',
  },
  fileCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    marginBottom: '10px',
  },
  fileName: {
    fontWeight: 'bold',
  },
  fileMeta: {
    fontSize: '12px',
    color: '#666',
  },
  downloadButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default DownloadModal;