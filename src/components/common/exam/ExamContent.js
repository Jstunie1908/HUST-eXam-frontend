import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Question from "../question/Question";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ExamContent(props) {
    //props.id
    const id = props.id;
    const [listQuestion, setListQuestion] = useState([]);
    // const [listCorrectAnswer, setListCorrectAnser] = useState(Array(listQuestion.length).fill(false));
    const [exam, setExam] = useState({});
    const [listAnswer, setListAnser] = useState([])
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);

    // useEffect(() => {
    //     // Khởi tạo giá trị cho listCorrectAnswer
    //     if (listQuestion.length > 0) {
    //         setListCorrectAnser(Array(listQuestion.length).fill(false));
    //     }
    // }, [listQuestion]);

    // useEffect(() => {
    //     // console.log(listCorrectAnswer);
    //     console.log(listAnswer);
    // }, [listAnswer])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`http://localhost:8001/api/exam/${id}`);
                const arrExams = response.data.exams;
                const exam = arrExams[0];
                setExam(exam);
                const lstQuest = exam.Questions;
                setListQuestion(lstQuest);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [id])

    // const handleCallBack = async (index, state) => {
    //     const newCheckedList = [...listCorrectAnswer];
    //     newCheckedList[index] = state;
    //     await setListCorrectAnser(newCheckedList);
    // }

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = async (choice) => {
        setOpenDialog(false);
        if (choice === "Yes") {
            const dataSendToServer = {
                user_id: Cookies.get('id'),
                answers: listAnswer.map((answer) => ({
                    question_id: answer.question_id,
                    selected_options: answer.selected_option,
                })),
            };

            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            };

            try {
                const response = await axios.post(`http://localhost:8001/api/exam/${id}/submit`, dataSendToServer, config);
                // console.log(response);
                toast.success(response.data.message, { autoClose: 1000 });
                navigate("/home");
            } catch (error) {
                console.log(error);
                toast.error("An error occurred while submitting the test", { autoClose: 1000 })
            }
        }
    };

    const handleCallBackTest = async (idQuestion, arrKeySelected) => {
        const listAnswerTmp = [...listAnswer];
        let exist = false;
        for (let i = 0; i < listAnswerTmp.length; i++) {
            if (listAnswerTmp[i]["question_id"] === idQuestion) {
                exist = true;
                listAnswerTmp[i]["selected_option"] = arrKeySelected;
                break;
            }
        }
        if (exist === false) {
            listAnswerTmp.push({ "question_id": idQuestion, "selected_option": arrKeySelected });
        }
        setListAnser(listAnswerTmp);
    }

    const handleSubmit = async () => {
        // const count = listCorrectAnswer.filter((answer) => answer === true).length;
        // console.log(`Số câu trả lời đúng là: ${count}`);
        handleOpenDialog();
    }

    return (
        <div>
            <Paper variant="24" sx={{ marginTop: '20px', marginLeft: '40px', marginRight: '40px' }}>
                {/* Hiển thị tiêu đề */}
                <Box sx={{ borderBottom: '2px solid grey', paddingTop: '20px', paddingBottom: '20px' }}>
                    <div className="header font-weight-bold font h4" style={{ color: "black", marginLeft: '20px' }}>Title Exam : <span>{exam.title}</span></div>
                </Box>
                {/* Hiển thị nội dung câu hỏi */}
                {listQuestion.map((item, index) => (
                    <div className="mt-3" key={index}>
                        <Question
                            id={item.id}
                            index={index} // Truyền index cho component con
                            quizType={item.quiz_type}
                            answerList={item.answer_list}
                            keyList={item.key_list}
                            quizQuestion={item.quiz_question}
                            // onChangeAnswer={(index, state) => handleCallBack(index, state)} // Truyền hàm callback cho component con
                            onChangeListAnswer={(idQuestion, listAnswer) => handleCallBackTest(idQuestion, listAnswer)}
                        />
                    </div>
                ))}
                {/* Nộp bài */}
                <Grid container>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                sx={{ marginBottom: '10px' }}
                                className="icon-button"
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
            <Dialog open={openDialog} onClose={() => handleCloseDialog("")} disableEscapeKeyDown={true}>
                <DialogTitle>Confirm</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Confirm sending the test results?
                        {/* <div> */}
                            <span style={{ color: "red" }}>{(listAnswer.length < listQuestion.length) ? " \nThere are some unanswered questions" : ""}</span>
                        {/* </div> */}

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCloseDialog("Yes")}>Yes</Button>
                    <Button onClick={() => handleCloseDialog("No")}>No</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}