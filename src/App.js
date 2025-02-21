import React, { useState } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Button } from "@mui/material";


const initialFileSystem = {
  name: "root",
  type: "folder",
  children: [
    {
      name: "Documents",
      type: "folder",
      children: [
        { name: "resume.pdf", type: "file" },
        { name: "notes.txt", type: "file" },
      ],
    },
    {
      name: "Pictures",
      type: "folder",
      children: [{ name: "photo.jpg", type: "file" }],
    },
    { name: "todo.txt", type: "file" },
  ],
};

const App = () => {
  const [fileSystem, setFileSystem] = useState(initialFileSystem);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [openedFile, setOpenedFile] = useState(null);


  const toggleFolder = (item) => {
    console.log(item, "item")
    setSelectedItem(item)
    setExpandedFolders((prev) => ({
      ...prev,
      [item.name]: !prev[item?.name],
    }));
  };


  const handleSelect = (item) => {
    console.log(item, "item")
    setSelectedItem(item);
    if (item.type === "folder") {
      setOpenedFile(null);
    } else {

      setOpenedFile((prev) => (prev === item ? null : item));
    }
  };




  const addItem = (type) => {
    if (!selectedItem || selectedItem.type !== "folder") {
      alert("Select a folder first.");
      return;
    }

    const name = prompt(`Enter new ${type} name:`);
    if (!name) return; // Exit if no input

    const newItem = { name, type, children: type === "folder" ? [] : undefined };


    const updateFileSystem = (folder) => {
      if (folder.name === selectedItem.name) {
        return { ...folder, children: [...(folder.children || []), newItem] };
      }
      if (folder.children) {
        return { ...folder, children: folder.children.map(updateFileSystem) };
      }
      return folder;
    };

    setFileSystem(updateFileSystem(fileSystem));
  };





  const renameItem = () => {
    if (!selectedItem) return alert("Select an item first.");

    const newName = prompt(`Rename "${selectedItem.name}" to:`);
    if (!newName) return;

    selectedItem.name = newName;
    setFileSystem({ ...fileSystem });
  };

  // Delete file or folder
  const deleteItem = () => {
    if (!selectedItem) return alert("Select an item first.");

    const parent = findParent(fileSystem, selectedItem);
    if (!parent) return;

    parent.children = parent.children.filter((child) => child !== selectedItem);
    setSelectedItem(null);
    setOpenedFile(null);
    setFileSystem({ ...fileSystem });
  };


  const findParent = (folder, target) => {
    if (!folder.children) return null;
    for (let child of folder.children) {
      if (child === target) return folder;
      if (child.type === "folder") {
        const found = findParent(child, target);
        if (found) return found;
      }
    }
    return null;
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      <div style={{ width: "30%", padding: "10px", borderRight: "1px solid #ccc" }}>
        <h3>File Explorer</h3>
        <FolderTree data={fileSystem} expandedFolders={expandedFolders} toggleFolder={toggleFolder} onSelect={handleSelect} />

        {/* File Operations */}
        <div style={{ marginTop: "10px" }}>
          <Button variant="contained" color="primary" onClick={() => addItem("folder")}>
            + New Folder
          </Button>
          <Button variant="contained" color="secondary" onClick={() => addItem("file")} style={{ marginLeft: "5px" }}>
            + New File
          </Button>
          <Button variant="contained" onClick={renameItem} style={{ marginLeft: "5px" }}>
            Rename
          </Button>
          <Button variant="contained" color="error" onClick={deleteItem} style={{ marginLeft: "5px" }}>
            Delete
          </Button>
        </div>
      </div>


      <div style={{ flex: 1, padding: "10px" }}>
        <h3>File Preview</h3>
        <FileViewer file={openedFile} />
      </div>
    </div>
  );
};


const FolderTree = ({ data, expandedFolders, toggleFolder, onSelect }) => {
  return (
    <div style={{ marginLeft: "15px" }}>
      <FolderItem item={data} expandedFolders={expandedFolders} toggleFolder={toggleFolder} onSelect={onSelect} />
    </div>
  );
};


const FolderItem = ({ item, expandedFolders, toggleFolder, onSelect }) => {
  const isFolder = item.type === "folder";
  const isExpanded = expandedFolders[item.name] || false;

  return (
    <div>

      <div
        onClick={() => (isFolder ? toggleFolder(item) : onSelect(item))}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", padding: "5px" }}
      >
        {isFolder ? isExpanded ? <FolderOpenIcon color="warning" /> : <FolderIcon color="primary" /> : <InsertDriveFileIcon />}
        <span style={{ marginLeft: "8px" }}>{item.name}</span>
      </div>

      {/* Render Children if Folder is Expanded */}
      {isFolder && isExpanded && (
        <div style={{ marginLeft: "20px" }}>
          {item.children &&
            item.children.map((child, index) => (
              <FolderItem key={index} item={child} expandedFolders={expandedFolders} toggleFolder={toggleFolder} onSelect={onSelect} />
            ))}
        </div>
      )}
    </div>
  );
};


const FileViewer = ({ file }) => {
  if (!file) return null;

  return (
    <div>
      <h4>{file.name}</h4>
      {file.name.endsWith(".jpg") || file.name.endsWith(".png") ? (
        <img src={`https://via.placeholder.com/400?text=${file.name}`} alt={file.name} style={{ maxWidth: "100%" }} />
      ) : (
        <pre style={{ background: "#f4f4f4", padding: "10px" }}>This is a preview of {file.name}</pre>
      )}
    </div>
  );
};


export default App;
