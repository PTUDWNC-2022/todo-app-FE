import { createContext, useState } from "react";

const ListContext = createContext(null);

const ListProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState({ name: "All", todos: [] });

  const value = {
    lists,
    setLists,
    selectedList,
    setSelectedList,
  };

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
};

export { ListContext, ListProvider };
