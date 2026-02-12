import { API_BASE_URL } from "../services/apiConfig";
import React, { useState } from "react";

export default function Document({ documents }) {
  const docs = Array.isArray(documents) ? documents : [];
  const [openDoc, setOpenDoc] = useState(null);

  if (docs.length === 0) return null;

  return (
    <div className="info-card">
  

      {docs.map((doc, index) => (
        <div key={index}>
          <span
            className="document-link"
            style={{ cursor: "pointer" }}
            onClick={() => setOpenDoc(`${API_BASE_URL}${doc.url}`)}
          >
            📄 {doc.name || `Document ${index + 1}`}
          </span>
        </div>
      ))}

      {openDoc && (
        <div className="document-modal">
          <button
            className="close-modal"
            onClick={() => setOpenDoc(null)}
            aria-label="Close document"
          >
            ✕
          </button>

          <iframe
            src={openDoc}
            title="Document Viewer"
            className="document-iframe"
          />
        </div>
      )}
    </div>
  );
}
