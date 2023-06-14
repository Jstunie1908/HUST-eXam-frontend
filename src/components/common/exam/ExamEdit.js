import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import { Button, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, IconButton, Paper, Radio, RadioGroup, TextField } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from "react-toastify";

export default function ExamEdit(props) {
    const [listQuestion, setListQuestion] = useState([]);
    const [openSetQuestion, setOpenSetQuestion] = useState(false);
    // Các biến phần tạo câu hỏi
    const [typeQuestion, setTypeQuestion] = useState("Singular choice");
    const [titleQuestion, setTitleQuestion] = useState("");
    const [numberAnswer, setNumberAnswer] = useState(1);
    const [selectedAnswer, setSelectedAnswer] = useState(''); // Đối với Radio
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]); // Đối với checkbox
    const [scoreQuestion, setScoreQuestion] = useState(0);
    // Lấy ra id của bài thi
    const id = props.id;

    // Lấy dữ liệu câu hỏi hiện tại
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`http://localhost:8001/api/exam/${id}`);
                const arrExams = response.data.exams;
                const exam = arrExams[0];
                const lstQuest = exam.Questions;
                // console.log(lstQuest);
                setListQuestion(lstQuest);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [id])

    const handleScoreChange = (event) => {
        let value = event.target.value;
        value = value.replace(/\D/g, '');
        value = Math.min(Math.max(value, 0), 100);
        setScoreQuestion(value);
    };

    const handleIncrease = () => {
        setSelectedAnswer('');
        setNumberAnswer((prevNumber) => (prevNumber < 10 ? prevNumber + 1 : prevNumber));
    };

    const handleDecrease = () => {
        setSelectedAnswer('');
        setNumberAnswer((prevNumber) => (prevNumber > 1 ? prevNumber - 1 : prevNumber));
    };

    const handleToggleSetQuestion = () => {
        setOpenSetQuestion((prevState) => !prevState);
    };

    const handleCheckboxChange = (event, index) => {
        if (event.target.checked) {
            setSelectedCheckboxes((prevSelectedCheckboxes) => [...prevSelectedCheckboxes, index]);
        }
        else {
            setSelectedCheckboxes((prevSelectedCheckboxes) =>
                prevSelectedCheckboxes.filter((checkboxIndex) => checkboxIndex !== index)
            );
        }
    };

    const ChangeTypeQuestion = (e) => {
        setTypeQuestion(e.target.value);
        if (e.target.value === "Singular choice") {
            setSelectedCheckboxes([]); // Reset selected checkboxes
        } else {
            setSelectedAnswer(''); // Reset selected radio button
        }
    }

    const handleClickAddQuestion = async () => {
        if (titleQuestion === '') {
            toast.info("You have not entered a question title", { autoClose: 1000 });
            return;
        }
        if (typeQuestion === 'Singular choice') {
            const selectedTextFieldValue = selectedAnswer ? document.getElementById(`answer-option-${selectedAnswer.split('-')[1]}`).value : '';
            if (selectedTextFieldValue === "") {
                toast.info("The correct answer to this question is currently an empty string", { autoClose: 1000 });
                return;
            }
        }
        else {
            const selectedTextFields = selectedCheckboxes.map((checkboxIndex) =>
                document.getElementById(`answer-option-${checkboxIndex + 1}`).value
            );
            if (selectedTextFields.length === 0) {
                toast.info("The correct answer to this question is currently an empty string", { autoClose: 1000 });
                return;
            }
            for (let i = 0; i < selectedTextFields.length; i++) {
                if (selectedTextFields[i] === '') {
                    toast.info("The correct answer to this question is currently an empty string", { autoClose: 1000 });
                    return;
                }
            }
        }
        // Vượt qua được các kiểm tra, tiếp tục lấy danh sách đáp án
        const listAnswer = [...Array(numberAnswer)].map((_, index) =>
            document.getElementById(`answer-option-${index + 1}`).value
        );

        // console.log("list answer:", listAnswer);

        // Gửi dữ liệu đến server
        try {
            let dataSendToServer = {}
            if (typeQuestion === "Singular choice") {
                const selectedTextFieldValue = selectedAnswer ? document.getElementById(`answer-option-${selectedAnswer.split('-')[1]}`).value : '';
                const keyList = [selectedTextFieldValue];
                // console.log(keyList);
                dataSendToServer = {
                    questions: [
                        {
                            image_link: "none",
                            quiz_question: titleQuestion,
                            point: scoreQuestion,
                            quiz_type: "true_false",
                            answer_list: listAnswer,
                            key_list: keyList,
                        }
                    ]

                }

                // console.log(dataSendToServer);
            }
            else {
                const selectedTextFields = selectedCheckboxes.map((checkboxIndex) =>
                    document.getElementById(`answer-option-${checkboxIndex + 1}`).value
                );
                const keyList = [...selectedTextFields];
                // console.log(keyList);
                dataSendToServer = {
                    questions: [
                        {
                            image_link: "none",
                            quiz_question: titleQuestion,
                            point: scoreQuestion,
                            quiz_type: "multiple_choice",
                            answer_list: listAnswer,
                            key_list: keyList,
                        }
                    ]

                }
                // console.log(dataSendToServer);
            }
            const url = `http://localhost:8001/api/exam/${id}/questions`;
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            };
            const response = await axios.post(
                url,
                dataSendToServer,
                config
            );
            console.log(response);
            if (response.data.code === 0) {
                toast.success(response.data.message, { autoClose: 1500 });
                // Reset
                setTypeQuestion("Singular choice");
                setTitleQuestion("");
                setNumberAnswer(1);
                setSelectedAnswer('');
                setSelectedCheckboxes([]);
                setScoreQuestion(0);
                setOpenSetQuestion(false);
            }
        } catch (error) {
            toast.error("An error occurred while connecting to the server", { autoClose: 1000 })
        }
    }

    const checkLogin = (Cookies.get('isLogin') === 'true');

    if (!checkLogin) {
        return <Navigate replace to="/login" />
    }
    else {
        return (
            <>
                <div>
                    <Header page="Edit exam" />
                </div>
                <div style={{ paddingTop: '90px', paddingLeft: '20px', paddingRight: '20px' }}>
                    <Paper sx={{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px' }}>
                        {
                            (listQuestion.length === 0) ?
                                (
                                    // Nếu chưa có câu hỏi nào trong exam
                                    <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                                        <h4 >Hiện tại chưa có câu hỏi nào trong exam</h4>
                                    </div>

                                )
                                :
                                (
                                    // Hiển thị danh sách câu hỏi hiện tại của exam
                                    <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                                        <h4>Hiển thị danh sách câu hỏi hiện tại của exam</h4>
                                    </div>
                                )
                        }
                        {/* Tạo form để người dùng thêm câu hỏi */}
                        <div
                            style={{
                                display: `${openSetQuestion === true ? 'inline' : 'none'}`,

                            }}
                        >
                            <Grid
                                container
                                sx={{
                                    border: '2px solid black',
                                    marginBottom: '20px',
                                    borderRadius: '10px',
                                    boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.4), 0 10px 20px 0 rgba(0, 0, 0, 0.4)"
                                }}
                            >
                                {/* Select question type */}
                                <Grid item xs={12} sx={{ margin: '10px' }}>
                                    <FormControl>
                                        <FormLabel>Select type question</FormLabel>
                                        <RadioGroup
                                            row
                                            name="row-radio-buttons-group"
                                            value={typeQuestion}
                                            onChange={(e) => ChangeTypeQuestion(e)}
                                        >
                                            <FormControlLabel value="Singular choice" control={<Radio />} label="Singular choice" />
                                            <FormControlLabel value="Multiple choices" control={<Radio />} label="Multiple choices" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                {/* Viết đề bài */}
                                <Grid item xs={12} sx={{ margin: '10px' }}>
                                    <FormControl>
                                        <FormLabel htmlFor="titlequestion">Title question</FormLabel>
                                        <textarea
                                            id="titlequestion"
                                            style={{
                                                width: '500%',
                                                minHeight: '1em',
                                                overflow: 'hidden',
                                                resize: 'none', // Disable mouse resizing 
                                            }}
                                            value={titleQuestion}
                                            onChange={(e) => setTitleQuestion(e.target.value)}
                                            onInput={(event) => {
                                                const textarea = event.target;
                                                textarea.style.height = 'auto'; // Reset the height to calculate actual scroll height
                                                textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
                                            }}
                                        ></textarea>
                                    </FormControl>
                                </Grid>
                                {/* Điền số lượng đáp án */}
                                <Grid item xs={12} sx={{ margin: '10px' }}>
                                    <FormControl component="fieldset">
                                        <FormLabel htmlFor="numberanswser">Number answser</FormLabel>
                                        <div>
                                            <button onClick={handleDecrease}>-</button>
                                            <input
                                                style={{ width: '40px', textAlign: 'center', justifyContent: 'center' }}
                                                type="number"
                                                id="numberanswser"
                                                name="numberanswser"
                                                min="1"
                                                max="10"
                                                value={numberAnswer}
                                                readOnly
                                            />
                                            <button onClick={handleIncrease}>+</button>
                                        </div>
                                    </FormControl>
                                </Grid>
                                {/* Form điền đáp án */}
                                <Grid item xs={12} sx={{ margin: '10px' }}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Answer options</FormLabel>
                                        {
                                            (typeQuestion === 'Singular choice') ?
                                                (
                                                    <RadioGroup value={selectedAnswer} onChange={(event) => setSelectedAnswer(event.target.value)}>
                                                        {[...Array(numberAnswer)].map((_, index) => (
                                                            <div key={index}>
                                                                <FormControlLabel
                                                                    control={<Radio />}
                                                                    label={
                                                                        <TextField
                                                                            id={`answer-option-${index + 1}`}
                                                                            label={`Answer ${index + 1}`}
                                                                            variant="outlined"
                                                                            size="small"
                                                                        />
                                                                    }
                                                                    value={`answer-${index + 1}`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                )
                                                :
                                                (
                                                    <div>
                                                        {[...Array(numberAnswer)].map((_, index) => (
                                                            <div key={index}>
                                                                <FormControlLabel
                                                                    control={<Checkbox onChange={(event) => handleCheckboxChange(event, index)} />}
                                                                    label={
                                                                        <TextField
                                                                            id={`answer-option-${index + 1}`}
                                                                            label={`Answer ${index + 1}`}
                                                                            variant="outlined"
                                                                            size="small"
                                                                        />
                                                                    }
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                        }
                                    </FormControl>
                                </Grid>
                                {/* Điền điểm của câu hỏi */}
                                <Grid item xs={12} sx={{ margin: '10px' }}>
                                    <FormControl>
                                        <FormLabel htmlFor="scorequestion">Score of question (0-100)</FormLabel>
                                        <input
                                            id="scorequestion"
                                            style={{ width: '36px', textAlign: 'center' }}
                                            value={scoreQuestion}
                                            onChange={handleScoreChange}
                                        />
                                    </FormControl>
                                </Grid>
                                {/* Tạo nút để đồng ý thêm câu hỏi vào bài thi */}
                                <Grid item xs={12} sx={{ margin: '10px' }}>
                                    <div style={{ paddingTop: '0px' }}>
                                        <IconButton
                                            className="icon-button"
                                            onClick={handleClickAddQuestion}
                                            style={{ width: 'auto', maxWidth: 'fit-content', padding: 0 }}
                                        >
                                            <AddCircleIcon sx={{ fontSize: 45, color: 'green' }} />
                                        </IconButton>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                        {/* Button Xử lý add question và cancel */}
                        <div>
                            <Button
                                style={{ display: `${openSetQuestion === true ? 'none' : ''}` }}
                                variant="contained"
                                className="icon-button"
                                startIcon={<AddBoxIcon />}
                                onClick={handleToggleSetQuestion}
                            >
                                Add Question
                            </Button>
                        </div>
                        <div>
                            <Button
                                style={{ display: `${openSetQuestion === true ? '' : 'none'}` }}
                                variant="contained"
                                className="icon-button"
                                startIcon={<CancelIcon />}
                                onClick={handleToggleSetQuestion}
                            >
                                Cancel
                            </Button>
                        </div>

                    </Paper >
                </div >
            </>
        )
    }
}