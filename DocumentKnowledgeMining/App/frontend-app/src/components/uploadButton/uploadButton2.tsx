import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Text, Input, Button } from "@fluentui/react-components";
import { ArrowUpload24Filled, Cloud24Filled } from "@fluentui/react-icons";

// Define the dropzone component
const UploadFilesButton = () => {
  // Handle file drop
  const onDrop = useCallback((acceptedFiles: string | any[]) => {
    if (acceptedFiles.length > 0) {
      
      alert("Files uploaded successfully");
    }
  }, []);

  // Use Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div>
      {/* Header */}
      <Text>
        Upload Documents
      </Text>

      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
          backgroundColor: isDragActive ? "#f0f0f0" : "#ffffff",
        }}
      >
        <input {...getInputProps()} />
        <Cloud24Filled style={{ fontSize: "48px", color: "#6A0DAD" }} />
        <Text>
          {isDragActive
            ? "Drop the files here..."
            : "Drag and drop files here or"}
        </Text>
        <Button appearance="primary" icon={<ArrowUpload24Filled />}>
          Browse files
        </Button>
      </div>

      {/* Upload Link */}
      <div style={{ marginTop: "16px", display: "flex", alignItems: "center" }}>
        <Input
          placeholder="Paste a link here"
          style={{ flexGrow: 1, marginRight: "8px" }}
        />
        <Button icon={<ArrowUpload24Filled />} appearance="primary" />
      </div>
    </div>
  );
};

export default UploadFilesButton;
