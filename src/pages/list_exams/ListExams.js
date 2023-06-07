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
    // Tìm kiếm
    const [searchText, setSearchText] = useState("");
    // Danh sách toàn bộ Exams được lưu vào listExams
    const [listExams, setListExams] = useState([]);
    const [listExamsReal, setListExamsReal] = useState([]) // Lưu danh sách exam thực tế (sau khi tìm kiếm thì listExams bị thay đổi)
    // Sẽ hiển thị "examsPerPage" bài thi trong một trang
    const [currentPage, setCurrentPage] = useState(1);
    const examsPerPage = 5;
    const startIndex = (currentPage - 1) * examsPerPage;
    const endIndex = startIndex + examsPerPage;
    // Lấy danh sách bài thi trong trang hiện tại
    const currentExams = listExams.slice(startIndex, endIndex);

    useEffect(() => {
        if (searchText === "") {
            setListExams(listExamsReal);
        }
    }, [searchText, listExamsReal])

    const handleSearch = (text) => {
        setListExams(listExamsReal.filter((e) => e.title.toLowerCase().includes(text.toLowerCase())));
    };

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
                setListExamsReal(exams);
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
            <>
                <div>
                    <Header page="List exams" />
                </div>
                <div className={`${styles.listExamContainer}`} style={{ paddingTop: '30px' }}>
                    <div className={`${styles.content}`}>
                        <div className="row">
                            {/* Hiển thị danh sách tất cả bài thi trong hệ thống */}
                            <div className="col-7">
                                <Box>
                                    <div className="header font-weight-bold font h2" style={{ color: "black" }}>List of all exams</div>
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
                            {/* Tìm kiếm khóa học */}
                            <div className="col-5">
                                <div className="header font-weight-bold font h2" style={{ color: "white" }}>Search for exams</div>
                                <div className="form-inline" style={{ paddingTop: '10px' }}>
                                    <input
                                        className="form-control mr-sm-2 w-75 mr-4"
                                        type="search"
                                        placeholder="Enter information of the course to search"
                                        aria-label="Search"
                                        onChange={(e) => {
                                            setSearchText(e.target.value);
                                        }}
                                        id={`${styles.myInput}`}
                                        title="Enter information of the course to search"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch(searchText);
                                            }
                                        }}
                                    />
                                    <button
                                        className="btn btn-outline-primary my-2 my-sm-0"
                                        onClick={() => handleSearch(searchText)}
                                        id={`${styles.buttonSearch}`}
                                        title="Click to search"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* </Paper>
                </div> */}
            </>
        )
    }
}