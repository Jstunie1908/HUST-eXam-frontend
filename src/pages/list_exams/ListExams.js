import React, { useEffect, useState } from "react";
import Header from "../../components/common/header/Header";
import { Box, Pagination } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import CardContainer from "../../components/card/CardContainer";
import styles from "./ListExams.module.css"
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

export default function ListExams() {

    // Danh sách toàn bộ Exams được lưu vào listExams
    const [listExams, setListExams] = useState([]);
    // Sẽ hiển thị "examsPerPage" bài thi trong một trang
    const [currentPage, setCurrentPage] = useState(1);
    const examsPerPage = 5;
    const startIndex = (currentPage - 1) * examsPerPage;
    const endIndex = startIndex + examsPerPage;
    // Lấy danh sách bài thi trong trang hiện tại
    const currentExams = listExams.slice(startIndex, endIndex);

    function handleTime(datetime) {
        const date = new Date(datetime);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');
        const formattedDate = `${day}/${month}/${year} - ${hour}:${minute}:${second}`;
        return formattedDate;
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get("http://localhost:8001/api/exams");
                const data = response.data;
                const exams = data.exams;
                setListExams(exams);
            } catch (error) {
                toast.error("An error occurred while connecting to the server", { autoClose: 500 })
                console.log(error);
            }
        }
        fetchData();
    }, []);

    const isLogin = (Cookies.get('isLogin') === 'true');

    if (!isLogin) {
        return <Navigate replace to='/' />
    }
    else {
        return (
            <div>
                <Header page="List exams" />
                <div className={`${styles.homeContainer}`} style={{ paddingTop: '30px' }}>
                    <div className={`${styles.content}`}>
                        <div className="row">
                            {/* Hiển thị danh sách tất cả bài thi trong hệ thống */}
                            <div className="col-7">
                                <Box>
                                    <div className="header font-weight-bold font h2" style={{ color: "white" }}>List of all exams</div>
                                </Box>
                                <Box>
                                    {currentExams.map((exam) => (
                                        <div className="mt-3" key={exam.id}>
                                            <CardContainer
                                                imgUrl={`https://img.uxwing.com/wp-content/themes/uxwing/download/education-school/online-exam-icon.svg`}
                                                name={exam.title}
                                                idExam={exam.id}
                                                startDate={handleTime(exam.start_time)}
                                                endDate={handleTime(exam.end_time)}
                                                status={exam.state}
                                                key={exam.title + exam.id}
                                                isOpen={exam.is_open}
                                                author={exam.author}
                                            />
                                        </div>
                                    ))}
                                    <Pagination
                                        count={Math.ceil(listExams.length / examsPerPage)}
                                        page={currentPage}
                                        onChange={(event, value) => setCurrentPage(value)}
                                    />
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>

                {/* </Paper>
                </div> */}
            </div>
        )
    }
}