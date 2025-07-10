import React from 'react'
import FileUpload from '../src/components/fileUpload'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, Paper, Typography } from "@mui/material";
import { blueGrey } from '@mui/material/colors';

const validationSchema = yup.object().shape({
  multiPdf: yup
    .array()
    .min(1, "Please upload at least one PDF file")
    .required("PDF is required"),
  singlePdf: yup
    .mixed()
    .required("Please upload a single PDF file")
    .test("is-pdf", "Only PDF allowed", (value) =>
      value && value.type === "application/pdf"
    ),
});


function App() {

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      multiPdf: [],
      singlePdf: null,
    },
  });

  const onSubmit = (data) => {
    console.log("✅ Final Form Data:", data);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" , mt:20}}>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 800,
          bgcolor: "#f9f9f9",
          borderRadius: 3,
        }}
      >

            <Typography variant="h5" gutterBottom align="center">
          Upload PDF Files
        </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>

        <FileUpload
          isMultiple
          label="Upload Multiple PDF Files"
          name="multiPdf"
          setValue={setValue}
          error={errors.multiPdf}
        />

        <br />
        <br />

        <FileUpload
          label="Upload Single PDF"
          name="singlePdf"
          setValue={setValue}
          error={errors.singlePdf}
        />

        <br />
        <Button sx={{color: "#ffff", backgroundColor:"#0d47a1"}} type="submit">Submit Form</Button>
      </form>

   </Paper>
    </Box>
  )
}

export default App
