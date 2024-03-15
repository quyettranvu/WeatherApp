import express from "express";
import { client } from "./elasticsearch/client";

const app = express();
const port = 3001;

app.listen(port, ()=>{
    console.log(`Server is listening on ${port}`);
})