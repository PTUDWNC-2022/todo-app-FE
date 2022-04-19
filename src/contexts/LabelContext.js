import { createContext, useState } from "react";

const LabelContext = createContext(null);

const LabelProvider = ({ children }) => {
  const [labels, setLabels] = useState([]);
  const [documentId, setDocumentId] = useState(null);

  const value = {
    labels,
    setLabels,
    documentId,
    setDocumentId,
  };

  return (
    <LabelContext.Provider value={value}>{children}</LabelContext.Provider>
  );
};

export { LabelContext, LabelProvider };
