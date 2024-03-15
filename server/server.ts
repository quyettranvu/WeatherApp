import express from "express";
import { client } from "./elasticsearch/client";
import data from "./data_management/retrieve_and_ingest_data";

const app = express();
const port = 3001;

app.use('/ingest_data', data);

app.listen(port, ()=>{
    console.log(`Server is listening on ${port}`);
})