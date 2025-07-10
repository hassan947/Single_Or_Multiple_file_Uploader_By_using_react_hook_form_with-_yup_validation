import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { IconButton, Typography, Box } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { Start } from "@mui/icons-material";

const SinglePdfUploader = ({
    isMultiple = false,
    label = "FILE UPLOADER",
    name = "fileUploader",
    setValue,
    error

}) => {
    const [file, setFile] = useState(isMultiple ? [] : null);

    const onDrop = useCallback((acceptedFiles) => {
        const pdfFile = acceptedFiles[0];
        if (pdfFile && pdfFile.type === "application/pdf") {
            const withPreview = Object.assign(pdfFile, {
                preview: URL.createObjectURL(pdfFile),
            });
            setFile(withPreview);
        } else {
            alert("Only PDF files are allowed.");
        }
    }, []);

    const onDrop1 = useCallback((acceptedFiles) => {
        const validPdfs = acceptedFiles.filter(file => file.type === "application/pdf");
        const filesWithPreview = validPdfs.map(file =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
        );

        const updatedFiles = [...file, ...filesWithPreview];
        setFile(updatedFiles);
    }, [file]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: isMultiple ? onDrop1 : onDrop,
        multiple: isMultiple ? true : false,
        accept: {
            "application/pdf": [".pdf"]
        },
    });


    useEffect(() => {
        if (setValue && name) setValue(name, file);
    }, [file, name, setValue]);


    const handleView = (props) => {
        if (!isMultiple && file?.preview) {
            window.open(file.preview, "_blank");
        }
        else if (isMultiple && props) {
            window.open(props, "_blank")

        }
    };

    const handleRemove = (index) => {
        const fileToRemove = file[index];
        if (!isMultiple && file?.preview) {
            URL.revokeObjectURL(file.preview); // Clean up memory
            setFile(null);
        }
        else if (isMultiple && fileToRemove?.preview) {
            URL.revokeObjectURL(fileToRemove.preview);

            const updated = file.filter((_, i) => i !== index);
            setFile(updated);
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{
                paddingTop: 6,
                textAlign: "center",
                width: "54vw",
            }} >
                <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}> {label}</Typography>

                <Box
                    {...getRootProps()}
                    sx={{
                        border: "2px dashed #ccc",
                        padding: 6,
                        textAlign: "center",
                        borderRadius: 2,
                        cursor: "pointer",
                        // m: 60,
                        mb: 1,
                        mt: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"

                    }}
                >
                    {(isMultiple || (!isMultiple && !file)) && (<>
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <Typography>Drop the PDF here...</Typography>
                        ) : (
                            <Typography>Drag & drop a PDF file here, or click to select</Typography>
                        )}
                    </>
                    )}


                    {(!isMultiple && file) && (
                        <Box
                            sx={{
                                border: "1px solid #ccc",
                                padding: 1,
                                pl: 2,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                backgroundColor: "#1565c0",
                                color: "#ffff",
                                width: "100%"

                            }}
                        >
                            <Typography>{file.name}</Typography>
                            <Box>
                                <IconButton onClick={handleView}>
                                    <VisibilityIcon sx={{ color: "#ffffff" }} />
                                </IconButton>
                                <IconButton onClick={handleRemove}>
                                    <DeleteIcon sx={{ color: "#ffffff" }} />
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                </Box>

                <Box sx={{ backgroundColor: "", display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 1 }}>
                    {isMultiple && Array.isArray(file) && file.length > 0 && file.map(
                        (itm, index) => (

                            <Box
                                key={index}
                                sx={{
                                    border: "1px solid #ccc",
                                    padding: 1,
                                    pl: 2,
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    backgroundColor: "#1565c0",
                                    color: "#ffff",
                                    width: "350px",

                                }}
                            >
                                <Typography>{itm.name}</Typography>
                                <Box>
                                    <IconButton onClick={() => handleView(itm.preview)} >
                                        <VisibilityIcon sx={{ color: "#ffffff" }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleRemove(index)} >
                                        <DeleteIcon sx={{ color: "#ffffff" }} />
                                    </IconButton>
                                </Box>
                            </Box>
                        )
                    )
                    }

                </Box>
                    {error && (
                        <Typography sx={{ color: "red", mt: 1, fontSize: "14px", display:"flex", justifyContent:"start" }}>
                            {error.message}
                        </Typography>
                    )}
            </Box>
        </Box>
    );
};

export default SinglePdfUploader;
