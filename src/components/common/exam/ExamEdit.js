import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, IconButton, MenuItem, Paper, Radio, RadioGroup, Select, TextField } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { MultiInputDateTimeRangeField } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import AddImage from "./AddImage";
import ImageGallery from "./ImageGallery";

export default function ExamEdit(props) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);
    const [listQuestion, setListQuestion] = useState([]);
    const [openSetQuestion, setOpenSetQuestion] = useState(false);
    // Các biến phần tạo câu hỏi
    const [typeQuestion, setTypeQuestion] = useState("Singular choice");
    const [titleQuestion, setTitleQuestion] = useState("");
    const [numberAnswer, setNumberAnswer] = useState(1);
    const [selectedAnswer, setSelectedAnswer] = useState(''); // Đối với Radio
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]); // Đối với checkbox
    const [scoreQuestion, setScoreQuestion] = useState(0);
    // Dialog Edit
    const [openDialogEdit, setOpenDialogEdit] = useState(false);
    const [questionEdit, setQuestionEdit] = useState({})
    const [typeQuestionEdit, setTypeQuestionEdit] = useState("");
    const [titleQuestionEdit, setTitleQuestionEdit] = useState("");
    const [numberAnswerEdit, setNumberAnswerEdit] = useState(1);
    const [selectedAnswerEdit, setSelectedAnswerEdit] = useState('');
    const [selectedCheckboxesEdit, setSelectedCheckboxesEdit] = useState([]); // Đối với checkbox
    const [scoreQuestionEdit, setScoreQuestionEdit] = useState(0);
    // Lấy ra id của bài thi
    const id = props.id;
    // Update Exam
    const [newTitle, setNewTitle] = useState("");
    const [newDuration, setNewDuration] = useState("");
    const [newOpen, setNewOpen] = useState(false);
    const [newState, setNewState] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [startTimeConvert, setStartTimeConvert] = useState("");
    const [endTimeConvert, setEndTimeCovert] = useState("");
    // Delete exam
    const [openDialogDeleteExam, setOpenDialogDeleteExam] = useState(false);

    // useEffect(() => {
    //     console.log(startTimeConvert && startTimeConvert);
    //     console.log(endTimeConvert && endTimeConvert);
    // })

    //CSS Textarea
    useEffect(() => {
        // Hàm xử lý khi kích thước cửa sổ thay đổi
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // Đăng ký sự kiện khi kích thước cửa sổ thay đổi
        window.addEventListener('resize', handleResize);

        // Hủy đăng ký sự kiện khi component bị unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const textarea = document.getElementById('titlequestion');

        // Kiểm tra nếu kích thước chiều rộng nhỏ hơn 959px
        if (windowWidth < 535) {
            textarea.style.width = '125%';
        }
        else if (windowWidth < 959) {
            textarea.style.width = '250%';
        } else {
            textarea.style.width = '500%'; // Width mặc định khi kích thước chiều rộng >= 959px
        }
    }, [windowWidth]);


    useEffect(() => {
        setStartTimeConvert(startTime && dayjs(startTime).format('YYYY/MM/DD HH:mm:ss'));
        setEndTimeCovert(endTime && dayjs(endTime).format('YYYY/MM/DD HH:mm:ss'));
    }, [startTime, endTime])

    // Lấy dữ liệu câu hỏi hiện tại
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.post(`http://localhost:8001/api/exam/${id}`, { password: Cookies.get("passwordOfExam") }, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    }
                });
                const arrExams = response.data.exams;
                const exam = arrExams[0];
                // console.log(exam);
                setNewTitle(exam.title);
                setNewDuration(exam.duration);
                setNewOpen(exam.is_open)
                setNewState(exam.state);
                setNewPassword(exam.state === "private" ? `${exam.password}` : "");
                const startDateTime = dayjs(exam.start_time); // Convert start_time to dayjs object
                const endDateTime = dayjs(exam.end_time); // Convert end_time to dayjs object
                setStartTime(startDateTime);
                setEndTime(endDateTime);
                const lstQuest = exam.Questions;
                // console.log(lstQuest);
                setListQuestion(lstQuest);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [id, refresh])

    const handleClickUpdate = async () => {
        if (newTitle === "") {
            toast.info("Title of exam not empty", { autoClose: 2000 });
            return;
        }
        if (newState === "private" && newPassword === "") {
            toast.info("Password of exam not empty", { autoClose: 2000 });
            return;
        }
        if (newDuration <= 0) {
            toast.info("Duration of exam not empty", { autoClose: 2000 });
            return;
        }
        try {
            const url = `http://localhost:8001/api/exam/${id}`;
            let dataSendToServer = {}
            if (newState === "private") {
                dataSendToServer = {
                    title: newTitle,
                    start_time: startTimeConvert,
                    end_time: endTimeConvert,
                    is_open: newOpen,
                    state: newState,
                    password: newPassword,
                    author: parseInt(Cookies.get('id')),
                    duration: newDuration,
                }
            }
            else {
                dataSendToServer = {
                    title: newTitle,
                    start_time: startTimeConvert,
                    end_time: endTimeConvert,
                    is_open: newOpen,
                    state: newState,
                    password: null,
                    author: parseInt(Cookies.get('id')),
                    duration: newDuration,
                }
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`
                }
            }
            const response = await axios.put(url, dataSendToServer, config);
            // console.log(response);
            if (response.data.code === 0) {
                toast.success("Update Succesfully", { autoClose: 2000 });
                const passwordNewOfExam = (newState === "public") ? null : newPassword;
                Cookies.set('passwordOfExam', passwordNewOfExam);
            }
        }
        catch (error) {
            toast.error("An error occurred while connecting to the server", { autoClose: 1500 })
        }
    }

    const handleClickDeleteExam = () => {
        setOpenDialogDeleteExam(true);
    }

    const handleCloseDialogDeleteExam = async (choice) => {
        if (choice === "Accept") {
            try {
                const url = `http://localhost:8001/api/exam/${id}`;
                const config = {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`
                    }
                }
                const response = await axios.delete(url, config);
                // console.log(response);
                if (response.data.code === 0) {
                    toast.success(response.data.message, { autoClose: 2000 });
                    navigate('/list_exams');
                }
            } catch (error) {
                toast.error("An error occurred while connecting to the server", { autoClose: 1500 })
            }
        }
        setOpenDialogDeleteExam(false);
    }

    const handleScoreChange = (event) => {
        let value = event.target.value;
        value = value.replace(/\D/g, '');
        value = Math.min(Math.max(value, 0), 100);
        setScoreQuestion(value);
    };

    const handleScoreChangeEdit = (event) => {
        let value = event.target.value;
        value = value.replace(/\D/g, '');
        value = Math.min(Math.max(value, 0), 100);
        setScoreQuestionEdit(value);
    };

    const handleIncrease = () => {
        setSelectedAnswer('');
        setNumberAnswer((prevNumber) => (prevNumber < 10 ? prevNumber + 1 : prevNumber));
    };

    const handleIncreaseEdit = () => {
        setSelectedAnswerEdit('');
        setNumberAnswerEdit((prevNumber) => (prevNumber < 10 ? prevNumber + 1 : prevNumber));
    };

    const handleDecrease = () => {
        setSelectedAnswer('');
        setNumberAnswer((prevNumber) => (prevNumber > 1 ? prevNumber - 1 : prevNumber));
    };

    const handleDecreaseEdit = () => {
        setSelectedAnswerEdit('');
        setNumberAnswerEdit((prevNumber) => (prevNumber > 1 ? prevNumber - 1 : prevNumber));
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

    const handleCheckboxChangeEdit = (event, index) => {
        if (event.target.checked) {
            setSelectedCheckboxesEdit((prevSelectedCheckboxes) => [...prevSelectedCheckboxes, index]);
        }
        else {
            setSelectedCheckboxesEdit((prevSelectedCheckboxes) =>
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
                            image_link: "",
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
                            image_link: "",
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
                    'Content-Type': 'application/json;charset=UTF-8',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                }
            };
            const response = await axios.post(
                url,
                dataSendToServer,
                config
            );
            // console.log(response);
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
                setRefresh(!refresh);
            }
        } catch (error) {
            toast.error("An error occurred while connecting to the server", { autoClose: 1000 })
        }
    }

    const clickDeleteQuestion = async (idQuestion) => {
        try {
            const url = `http://localhost:8001/api/exam/${id}/questions/${idQuestion}`;
            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                }
            });
            console.log(response);
            toast.success("Successfully deleted!", { autoClose: 1000 });
            setRefresh(!refresh);
        } catch (error) {
            toast.error("An error occurred while connecting to the server", { autoClose: 1000 })
            // console.log(error);
        }
    }

    const handleCloseDialogEdit = async (choice) => {
        if (choice === "Save") {
            if (titleQuestionEdit === '') {
                toast.info("You have not entered a question title", { autoClose: 1000 });
                return;
            }
            if (typeQuestionEdit === 'Singular choice') {
                const selectedTextFieldValueEdit = selectedAnswerEdit ? document.getElementById(`answer-option-${selectedAnswerEdit.split('-')[1]}-edit`).value : '';
                if (selectedTextFieldValueEdit === "") {
                    toast.info("The correct answer to this question is currently an empty string", { autoClose: 1000 });
                    return;
                }
            }
            else {
                const selectedTextFieldsEdit = selectedCheckboxesEdit.map((checkboxIndex) =>
                    document.getElementById(`answer-option-${checkboxIndex + 1}-edit`).value
                );
                if (selectedTextFieldsEdit.length === 0) {
                    toast.info("The correct answer to this question is currently an empty string", { autoClose: 1000 });
                    return;
                }
                for (let i = 0; i < selectedTextFieldsEdit.length; i++) {
                    if (selectedTextFieldsEdit[i] === '') {
                        toast.info("The correct answer to this question is currently an empty string", { autoClose: 1000 });
                        return;
                    }
                }
            }
            // console.log("id:", id);
            // console.log("questionEdit.id", questionEdit.id);
            // console.log("titleQuestionEdit:", titleQuestionEdit);
            // console.log("typeQuestionEdit:", typeQuestionEdit);
            // console.log("numberAnswerEdit:", numberAnswerEdit);
            // console.log("selectedAnswerEdit:", selectedAnswerEdit);
            // console.log("selectedCheckboxesEdit:", selectedCheckboxesEdit)
            // console.log("questionEdit:", questionEdit);
            // console.log("answer 1:",)
            // Vượt qua được các kiểm tra, tiếp tục lấy danh sách đáp án
            const listAnswerEdit = [...Array(numberAnswerEdit)].map((_, index) =>
                document.getElementById(`answer-option-${index + 1}-edit`).value
            );
            // console.log("listAnswerEdit:", listAnswerEdit)
            // Gửi dữ liệu đến server
            try {
                let dataSendToServer = {}
                if (typeQuestionEdit === "Singular choice") {
                    const selectedTextFieldValueEdit = selectedAnswerEdit ? document.getElementById(`answer-option-${selectedAnswerEdit.split('-')[1]}-edit`).value : '';
                    const keyListEdit = [selectedTextFieldValueEdit];
                    // console.log(keyListEdit);
                    dataSendToServer = {
                        question:
                        {
                            image_link: "",
                            quiz_question: titleQuestionEdit,
                            point: scoreQuestionEdit,
                            quiz_type: "true_false",
                            answer_list: listAnswerEdit,
                            key_list: keyListEdit,
                        }
                    }
                    // console.log(dataSendToServer);
                }
                else {
                    const selectedTextFieldsEdit = selectedCheckboxesEdit.map((checkboxIndex) =>
                        document.getElementById(`answer-option-${checkboxIndex + 1}-edit`).value
                    );
                    const keyListEdit = [...selectedTextFieldsEdit];
                    // console.log(keyListEdit);
                    dataSendToServer = {
                        question:
                        {
                            image_link: "",
                            quiz_question: titleQuestionEdit,
                            point: scoreQuestionEdit,
                            quiz_type: "multiple_choice",
                            answer_list: listAnswerEdit,
                            key_list: keyListEdit,
                        }
                    }
                    // console.log(dataSendToServer);
                }
                const url = `http://localhost:8001/api/exam/${id}/questions/${questionEdit.id}`;
                // console.log("url:", url);
                const config = {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    }
                };
                const response = await axios.put(
                    url,
                    dataSendToServer,
                    config
                );
                // console.log(response);
                if (response.data.code === 0) {
                    toast.success(response.data.message, { autoClose: 1500 });
                    // Reset
                    setTypeQuestionEdit("Singular choice");
                    setTitleQuestionEdit("");
                    setNumberAnswerEdit(1);
                    setSelectedAnswerEdit('');
                    setSelectedCheckboxesEdit([]);
                    setScoreQuestionEdit(0);
                    setOpenDialogEdit(false);
                    setRefresh(!refresh);
                }
            } catch (error) {
                toast.error("An error occurred while connecting to the server", { autoClose: 1000 })
            }
        }
        setOpenDialogEdit(false);
    }

    const clickEditQuestion = (question) => {
        setQuestionEdit(question);
        setTypeQuestionEdit(question.quiz_type === "true_false" ? "Singular choice" : "Multiple choices");
        setTitleQuestionEdit(question.quiz_question);
        setNumberAnswerEdit(JSON.parse(question.answer_list).length);
        setScoreQuestionEdit(question.point);
        setOpenDialogEdit(true);
    }

    const ChangeTypeQuestionEdit = (e) => {
        setTypeQuestionEdit(e.target.value);
        if (e.target.value === "Singular choice") {
            setSelectedCheckboxesEdit([]); // Reset selected checkboxes
        } else {
            setSelectedAnswerEdit(''); // Reset selected radio button
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
                    {/* Thông tin bài thi */}
                    <Paper sx={{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px', marginBottom: '20px' }}>
                        <div style={{ paddingTop: '10px' }}>
                            <label htmlFor="new-title"><span style={{ fontWeight: 'bold', paddingRight: "4px" }}>Title of exam </span> </label>
                            <input
                                style={{ borderWidth: '0px 0px 2px 0px', borderColor: 'black' }}
                                type="text"
                                id="new-title"
                                name="new-title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                            <br />
                            <label htmlFor="new-duration"><span style={{ fontWeight: 'bold', paddingRight: "4px" }}>Duration of exam (second) </span></label>
                            <input
                                style={{ borderWidth: '0px 0px 2px 0px', borderColor: 'black' }}
                                type="number"
                                id="new-duration"
                                name="new-duration"
                                value={newDuration}
                                onChange={(e) => setNewDuration(e.target.value)}

                            />
                            <br />
                            <label htmlFor="new-open"><span style={{ fontWeight: 'bold', paddingRight: "4px" }}>Open </span></label>
                            <Select
                                style={{ height: '40%' }}
                                labelId="Open"
                                id="new-open"
                                value={newOpen}
                                onChange={(e) => setNewOpen(e.target.value)}
                                label="Open"
                            >
                                <MenuItem value="true">true</MenuItem>
                                <MenuItem value="false">false</MenuItem>
                            </Select>
                            <br />
                            <label htmlFor="select-time"><span style={{ fontWeight: 'bold', paddingRight: "4px" }}> Select time</span></label>
                            <Box sx={{ width: '40%', paddingTop: '1px', paddingLeft: '10px', paddingBottom: '10px' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={[
                                            'MultiInputDateTimeRangeField',
                                        ]}
                                    >
                                        <MultiInputDateTimeRangeField
                                            slotProps={{
                                                textField: ({ position }) => ({
                                                    label: position === 'start' ? 'Start time' : 'End time',
                                                }),
                                            }}
                                            value={[startTime, endTime]}
                                            onChange={(newValue) => {
                                                setStartTime(newValue[0]);
                                                setEndTime(newValue[1]);
                                            }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Box>
                            <label htmlFor="new-state"><span style={{ fontWeight: 'bold', paddingRight: "4px" }}>State </span></label>
                            <Select
                                labelId="State"
                                id="new-state"
                                value={newState}
                                onChange={(e) => setNewState(e.target.value)}
                                label="State"
                            >
                                <MenuItem value="public">public</MenuItem>
                                <MenuItem value="private">private</MenuItem>
                            </Select>
                            <div style={{ display: `${newState === 'private' ? "flex" : "none"}` }}>
                                <label htmlFor="new-password"><span style={{ fontWeight: 'bold', paddingRight: "4px" }}>New password </span></label>
                                <input
                                    type="password"
                                    id="new-password"
                                    name="new-password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <br />
                        </div>
                        <div style={{ paddingTop: '10px' }}>
                            <Button
                                variant="contained"
                                className="icon-button"
                                onClick={handleClickUpdate}
                            >
                                Update
                            </Button>
                            <Button
                                style={{ marginLeft: '10px', backgroundColor: 'red' }}
                                variant="contained"
                                className="icon-button"
                                onClick={handleClickDeleteExam}
                            >
                                Delete Exam
                            </Button>
                        </div>
                    </Paper>

                    <Paper sx={{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px' }}>
                        {
                            (listQuestion.length === 0) ?
                                (
                                    // Nếu chưa có câu hỏi nào trong exam
                                    <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                                        <h4>There are currently no questions in this exam</h4>
                                    </div>

                                )
                                :
                                (
                                    // Hiển thị danh sách câu hỏi hiện tại của exam
                                    <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                                        {/* <h4>Hiển thị danh sách câu hỏi hiện tại của exam</h4> */}
                                        {/* WRITE CODE HERE */}
                                        {
                                            listQuestion.map((question) => {
                                                const answerListArray = JSON.parse(question.answer_list);
                                                const linkImage = question.image_link;
                                                const arrLinkImage = linkImage.split(",");
                                                const filteredArr = arrLinkImage.filter(Boolean);
                                                // console.log("fileredArr:", filteredArr);
                                                return (
                                                    <div key={question.id}>
                                                        <h6 style={{ marginTop: '20px' }}>ID: {question.id}</h6>
                                                        <h5 style={{ marginTop: '20px' }}>{question.quiz_question}</h5>
                                                        <ImageGallery imageUrls={filteredArr} />
                                                        {
                                                            question.quiz_type === 'multiple_choice' ?
                                                                (
                                                                    <div>
                                                                        {/* Display as quiz + checkbox */}
                                                                        {answerListArray.map((answer, index) => (
                                                                            <div key={index}>
                                                                                <FormControlLabel
                                                                                    control={<Checkbox />}
                                                                                    label={answer}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )
                                                                :
                                                                (
                                                                    <div>
                                                                        {/* Display as quiz + radio */}
                                                                        {answerListArray.map((answer, index) => (
                                                                            <div key={index}>
                                                                                <FormControlLabel
                                                                                    control={<Radio />}
                                                                                    label={answer}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )
                                                        }
                                                        <h6>Point: {question.point}</h6>
                                                        <h6>Type: {question.quiz_type === "true_false" ? "Singular choice" : "Multiple choices"}</h6>
                                                        {/* Delete and edit buttons */}
                                                        <Button
                                                            variant="contained"
                                                            style={{ marginRight: '20px' }}
                                                            onClick={() => clickEditQuestion(question)}
                                                            className="icon-button"
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            style={{ backgroundColor: "red" }}
                                                            onClick={() => clickDeleteQuestion(question.id)}
                                                            className="icon-button"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                )
                                            }
                                            )
                                        }
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
                                                resize: 'none',
                                                marginBottom: '10px',
                                            }}
                                            value={titleQuestion}
                                            onChange={(e) => setTitleQuestion(e.target.value)}
                                            onInput={(event) => {
                                                const textarea = event.target;
                                                textarea.style.height = 'auto';
                                                textarea.style.height = `${textarea.scrollHeight}px`;
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
                                style={{ display: `${openSetQuestion === true ? 'none' : ''}`, backgroundColor: 'green' }}
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
                {/* Dialog Edit */}
                <div>
                    <Dialog open={openDialogEdit} onClose={() => handleCloseDialogEdit("")} disableEscapeKeyDown={true}>
                        <DialogTitle>Edit Question</DialogTitle>
                        <DialogContent>
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
                                            name="row-radio-buttons-group-edit"
                                            value={typeQuestionEdit}
                                            onChange={(e) => ChangeTypeQuestionEdit(e)}
                                        >
                                            <FormControlLabel id="radio-singular-choice" value="Singular choice" control={<Radio />} label="Singular choice" />
                                            <FormControlLabel id="radio-multiple-choice" value="Multiple choices" control={<Radio />} label="Multiple choices" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                {/* Viết đề bài */}
                                <Grid item xs={12} sx={{ margin: '10px' }}>
                                    <FormControl>
                                        <FormLabel htmlFor="titlequestion-edit">Title question</FormLabel>
                                        <textarea
                                            id="titlequestion-edit"
                                            style={{
                                                width: '300%',
                                                minHeight: '1em',
                                                overflow: 'hidden',
                                                resize: 'none', // Disable mouse resizing 
                                            }}
                                            value={titleQuestionEdit}
                                            onChange={(e) => setTitleQuestionEdit(e.target.value)}
                                            onInput={(event) => {
                                                const textarea = event.target;
                                                textarea.style.height = 'auto'; // Reset the height to calculate actual scroll height
                                                textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
                                            }}
                                        ></textarea>
                                        <AddImage questionID={questionEdit.id} refresh={refresh} setRefresh={setRefresh} />
                                    </FormControl>
                                </Grid>
                                {/* Điền số lượng đáp án */}
                                <Grid item xs={12} sx={{ margin: '10px' }}>
                                    <FormControl component="fieldset">
                                        <FormLabel htmlFor="numberanswser-edit">Number answser</FormLabel>
                                        <div>
                                            <button onClick={handleDecreaseEdit}>-</button>
                                            <input
                                                style={{ width: '40px', textAlign: 'center', justifyContent: 'center' }}
                                                type="number"
                                                id="numberanswser-edit"
                                                name="numberanswser-edit"
                                                min="1"
                                                max="10"
                                                value={numberAnswerEdit}
                                                readOnly
                                            />
                                            <button onClick={handleIncreaseEdit}>+</button>
                                        </div>
                                    </FormControl>
                                </Grid>
                                {/* Form điền đáp án */}
                                <Grid item xs={12} sx={{ margin: '10px' }}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Answer options</FormLabel>
                                        {
                                            (typeQuestionEdit === 'Singular choice') ?
                                                (
                                                    <RadioGroup value={selectedAnswerEdit} onChange={(event) => setSelectedAnswerEdit(event.target.value)}>
                                                        {[...Array(numberAnswerEdit)].map((_, index) => (
                                                            <div key={index}>
                                                                <FormControlLabel
                                                                    control={<Radio />}
                                                                    label={
                                                                        <TextField
                                                                            id={`answer-option-${index + 1}-edit`}
                                                                            label={`Answer ${index + 1}`}
                                                                            variant="outlined"
                                                                            size="small"
                                                                        />
                                                                    }
                                                                    value={`answer-${index + 1}-edit`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                )
                                                :
                                                (
                                                    <div>
                                                        {[...Array(numberAnswerEdit)].map((_, index) => (
                                                            <div key={index}>
                                                                <FormControlLabel
                                                                    control={<Checkbox onChange={(event) => handleCheckboxChangeEdit(event, index)} />}
                                                                    label={
                                                                        <TextField
                                                                            id={`answer-option-${index + 1}-edit`}
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
                                        <FormLabel htmlFor="scorequestion-edit">Score of question (0-100)</FormLabel>
                                        <input
                                            id="scorequestion-edit"
                                            style={{ width: '36px', textAlign: 'center' }}
                                            value={scoreQuestionEdit}
                                            onChange={handleScoreChangeEdit}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleCloseDialogEdit("Save")} className="icon-button">Save</Button>
                            <Button onClick={() => handleCloseDialogEdit("Cancel")} className="icon-button">Cancel</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openDialogDeleteExam} onClose={() => handleCloseDialogDeleteExam("")} disableEscapeKeyDown={true}>
                        <DialogTitle>Confirm Delete Exam</DialogTitle>
                        <DialogContent>
                            After deletion, the exam cannot be recovered
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleCloseDialogDeleteExam("Accept")} className="icon-button">Accept</Button>
                            <Button onClick={() => handleCloseDialogDeleteExam("Cancel")} className="icon-button">Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </>
        )
    }
}