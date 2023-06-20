import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Question from "../question/Question";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ResultExamContent(props) {
    const id = props.id;
    const timeExam = Cookies.get("timeExam");
    const [listQuestion, setListQuestion] = useState([]);
    const [keyList, setKeyList] = useState([])
    const [exam, setExam] = useState({});
    const [listAnswer, setListAnswer] = useState([]);
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(timeExam <= 0 ? 60 : timeExam); // Thời gian còn lại (tính bằng giây)\
    const [timerID, setTimerID] = useState(null);
    // const [completeTime, setCompleteTime] = useState(null);

    // const handleSubmit = useCallback(() => {
    //     handleOpenDialog();
    // }, []);

    // const handleAutoSubmit = useCallback(async () => {
    //     clearInterval(timerID); // Dừng bộ đếm thời gian
    //     // Gán giá trị thời gian hoàn thành bài thi
    //     // setCompleteTime(timeExam - timeRemaining);

    //     const dataSendToServer = {
    //         user_id: Cookies.get("id"),
    //         answers: listAnswer.map((answer) => ({
    //             question_id: answer.question_id,
    //             selected_options: answer.selected_option,
    //         })),
    //         complete_time: timeExam - timeRemaining,
    //     };

    //     const config = {
    //         headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/json;charset=UTF-8",
    //             Authorization: `Bearer ${Cookies.get('token')}`,
    //         },
    //     };

    //     try {
    //         const response = await axios.post(
    //             `http://localhost:8001/api/exam/${id}/submit`,
    //             dataSendToServer,
    //             config
    //         );
    //         toast.success(response.data.message, { autoClose: 1000 });
    //         Cookies.remove("timeExam");
    //         localStorage.removeItem("initialTime");
    //         navigate("/home");
    //     } catch (error) {
    //         console.log(error);
    //         toast.error(error.response.data.message, { autoClose: 1000 });
    //     }
    // }, [listAnswer, id, navigate, timerID, timeRemaining, timeExam]);

    // useEffect(() => {
    //     const initialTime = localStorage.getItem("initialTime");
    //     if (!initialTime) {
    //         localStorage.setItem("initialTime", Date.now());
    //     } else {
    //         const elapsedTime = Math.floor((Date.now() - parseInt(initialTime)) / 1000);
    //         setTimeRemaining((prevTime) => Math.max(prevTime - elapsedTime, 0));
    //     }

    //     const timer = setInterval(() => {
    //         setTimeRemaining((prevTime) => prevTime - 1);
    //     }, 1000);

    //     setTimerID(timer); // Lưu ID của bộ đếm thời gian

    //     return () => {
    //         clearInterval(timer);
    //     };
    // }, []);

    // useEffect(() => {
    //     if (timeRemaining === 0) {
    //         handleAutoSubmit();
    //         localStorage.removeItem("initialTime");
    //     }
    // }, [timeRemaining, handleAutoSubmit]);

    useEffect(() => {
        async function fetchData() {
            try {
                const config = {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json;charset=UTF-8",
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                };
                const response = await axios.post(`http://localhost:8001/api/exam/${id}`, { password: Cookies.get("passwordOfExam") }, config);
                

                const arrExams = response.data.exams;
                const exam = arrExams[0];
                setExam(exam);
                const lstQuest = exam.Questions;
                setListQuestion(lstQuest);
            } catch (error) {
                console.log(error);
            }
        }
        const getResult = async () => {
            const config = {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            };
            const results = await axios.post(`http://localhost:8001/api/exam/${id}/result`,{user_id: Cookies.get("id")}, config);
            const data= results.data.keys
            // console.log(data)
            // console.log(results)
            // console.log(data.map((e) => {
            //     return ['A','B','C','D']. map((ans) => {
            //         if(e.keys.includes(ans)){
            //             return true
            //         }else{
            //             return false
            //         }
            //     })
            // }))
            setKeyList(data.map((e) => {
                return e.answerList.map((ans) => {
                    if(e.keys.includes(ans)){
                        return true
                    }else{
                        return false
                    }
                })
            }))
        }
        getResult();
        fetchData();
    }, [id]);

    useEffect(()=> {console.log(keyList)}, [keyList])

    // const handleOpenDialog = () => {
    //     setOpenDialog(true);
    // };

    // const handleCloseDialog = async (choice) => {
    //     setOpenDialog(false);
    //     if (choice === "Yes") {
    //         handleAutoSubmit();
    //     }
    // };

    // const handleCallBackTest = (idQuestion, arrKeySelected) => {
    //     const listAnswerTmp = [...listAnswer];
    //     let exist = false;
    //     for (let i = 0; i < listAnswerTmp.length; i++) {
    //         if (listAnswerTmp[i].question_id === idQuestion) {
    //             exist = true;
    //             listAnswerTmp[i].selected_option = arrKeySelected;
    //             break;
    //         }
    //     }
    //     if (!exist) {
    //         listAnswerTmp.push({ question_id: idQuestion, selected_option: arrKeySelected });
    //     }
    //     setListAnswer(listAnswerTmp);
    // };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div>
            <Paper variant="24" sx={{ marginTop: "20px", marginLeft: "40px", marginRight: "40px" }}>
                <Box sx={{ borderBottom: "2px solid grey", paddingTop: "20px", paddingBottom: "20px" }}>
                    <div className="header font-weight-bold font h4" style={{ color: "black", marginLeft: "20px" }}>
                        Title Exam : <span>{exam.title}</span>
                    </div>
                </Box>
                {listQuestion.map((item, index) => (
                    <div className="mt-3" key={index}>
                        <Question
                            id={item.id}
                            index={index}
                            quizType={item.quiz_type}
                            answerList={item.answer_list}
                            keyList={item.key_list}
                            quizQuestion={item.quiz_question}
                            keyAns = {keyList[index]}
                            // onChangeListAnswer={(idQuestion, listAnswer) => handleCallBackTest(idQuestion, listAnswer)}
                            result={true}
                        />
                    </div>
                ))}
                {/* <Grid container>
                    <Grid item xs={12}>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Button variant="contained" sx={{ marginBottom: "10px" }} className="icon-button" onClick={handleSubmit}>
                                Submit
                            </Button>
                        </Box>
                    </Grid>
                </Grid> */}
            </Paper>
            {/* <div className="time-remaining-container">
                <strong style={{ color: `${timeRemaining < 60 ? "red" : "green"}` }}>
                    Time Remaining: {formatTime(timeRemaining)}
                </strong>
            </div> */}
            {/* {completeTime !== null && (
                <div className="complete-time-container">
                    <strong>Complete Time: {formatTime(completeTime)}</strong>
                </div>
            )} */}
            {/* <Dialog open={openDialog} onClose={() => handleCloseDialog("")} disableEscapeKeyDown={true}>
                <DialogTitle>Confirm</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Confirm sending the test results?
                        <span style={{ color: "red" }}>
                            {listAnswer.length < listQuestion.length ? " \nThere are some unanswered questions" : ""}
                        </span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCloseDialog("Yes")}>Yes</Button>
                    <Button onClick={() => handleCloseDialog("No")}>No</Button>
                </DialogActions>
            </Dialog> */}
        </div>
    );
}
