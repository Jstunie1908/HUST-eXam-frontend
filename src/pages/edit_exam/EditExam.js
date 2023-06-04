import { useParams } from "react-router-dom";
import NewExam from "../new_exam/NewExam";
import axios from "axios";
import React, { useEffect, useState } from "react";

const EditExam = () => {
    const {id}= useParams()
    const [exam, setExam] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8001/api/exam/${id}`);
                const arrExams = response.data.exams;
                const exam = arrExams[0];
                setExam(exam);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    }, [id]) 
    return (
        <NewExam edit={exam}/>
    )
}

export default EditExam