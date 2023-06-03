import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "../../components/common/header/Header";
import { Box, Button, Grid, Paper, TextField, Typography, Select, MenuItem } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import dayjs from 'dayjs';
import axios from "axios";
import { toast } from "react-toastify";


export default function NewExam() {
    const isLogin = (Cookies.get('isLogin') === 'true');
    const id = Cookies.get('id');
    const [titleExam, setTitleExam] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [startTimeConvert, setStartTimeConvert] = useState("");
    const [endTimeConvert, setEndTimeCovert] = useState("");
    const [isOpen, setIsOpen] = useState("false");
    const [state, setState] = useState("public");
    const [passwordExam, setPasswordExam] = useState("");

    useEffect(() => {
        setStartTimeConvert(startTime && dayjs(startTime).format('YYYY/MM/DD HH:mm:ss'));
        setEndTimeCovert(endTime && dayjs(endTime).format('YYYY/MM/DD HH:mm:ss'));
    }, [startTime, endTime])

    function compareTime(startTime, endTime) {
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);

        return startDate.getTime() < endDate.getTime();
    }

    const handleClickCreateExam = async () => {
        if (titleExam === "") {
            toast.info("The exam title is not filled in !", { autoClose: 1000 });
            return;
        }
        if (startTimeConvert === "" || startTimeConvert === "Invalid Date" || startTimeConvert === null
            || endTimeConvert === "" || endTimeConvert === "Invalid Date" || endTimeConvert === null) {
            toast.info("You have not entered the time of the test !", { autoClose: 1000 });
            return;
        }
        if (!compareTime(startTimeConvert, endTimeConvert)) {
            toast.info("End time must be the time after Start time !", { autoClose: 1000 });
            return;
        }
        let dataSendToServer = {};
        if (state === 'private') {
            dataSendToServer = {
                title: titleExam,
                start_time: startTimeConvert,
                end_time: endTimeConvert,
                is_open: isOpen,
                state: state,
                passwword: passwordExam,
                author: parseInt(id),
            }
        }
        else {
            dataSendToServer = {
                title: titleExam,
                start_time: startTimeConvert,
                end_time: endTimeConvert,
                is_open: isOpen,
                state: state,
                author: parseInt(id),
            }
        }
        console.log(dataSendToServer);
        try {
            const response = await axios.post("http://localhost:8001/api/exam", dataSendToServer);
            toast.success(response.data.message, { autoClose: 1000 });
            setTitleExam("");
            setStartTimeConvert("");
            setEndTimeCovert("");
            setStartTime(null);
            setEndTime(null);
            setIsOpen("false");
            setState("public");
            setPasswordExam("");

        } catch (error) {
            toast.error("An error occurred while connecting to the server", { autoClose: 1000 });
        }
    }

    const handleChangeOpen = (event) => {
        setIsOpen(event.target.value);
    };

    const handleChangeState = (event) => {
        setState(event.target.value);
    };

    if (!isLogin) {
        return <Navigate replace to="/" />
    }
    else {
        return (
            <div style={{ paddingTop: "90px" }}>
                <div>
                    <Header page="Create exam" />
                </div>
                <div style={{ marginTop: "20px" }}>
                    <Grid container justifyContent="center">
                        <Grid item xs={10}>
                            <Paper>
                                {/* Title Exam */}
                                <Box sx={{ paddingLeft: '10px', paddingRight: '10px', fontSize: '180%' }}>
                                    <strong>The title of the exam</strong>
                                </Box>
                                {/* Nhập title Exam */}
                                <TextField
                                    sx={{ paddingTop: '20px', paddingLeft: '10px', paddingBottom: '10px', width: '60%' }}
                                    required
                                    type="text"
                                    id="titleExam"
                                    value={titleExam}
                                    variant="outlined"
                                    placeholder="Please enter title exam"
                                    onChange={(e) => setTitleExam(e.target.value)}
                                    helperText={titleExam === "" ? <span style={{ color: "red" }}>The exam title is not filled in</span> : ""}
                                />
                                {/* Start time */}
                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    sx={{ paddingTop: '1px', paddingLeft: '10px', paddingBottom: '2px' }}
                                >
                                    Select time
                                </Typography>
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
                                                value={[startTime, endTime]} // Truyền giá trị của startTime và endTime
                                                onChange={(newValue) => {
                                                    setStartTime(newValue[0]); // Cập nhật giá trị startTime
                                                    setEndTime(newValue[1]); // Cập nhật giá trị endTime
                                                }}
                                            />
                                            {/* In ra startTime và endTime */}
                                            {/* <Typography variant="body1" sx={{ paddingLeft: '10px' }}>
                                                Start time: {startTime && dayjs(startTime).format('YYYY/MM/DD HH:mm:ss')}
                                            </Typography>
                                            <Typography variant="body1" sx={{ paddingLeft: '10px' }}>
                                                End time: {endTime && dayjs(endTime).format('YYYY/MM/DD HH:mm:ss')}
                                            </Typography> */}
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Box>
                                {/* Chỉnh trạng thái Open */}
                                <Grid container alignItems="center" sx={{ paddingLeft: "10px", paddingBottom: "10px" }}>
                                    <Grid item xs={0.5}>
                                        <Typography variant="subtitle1" color="text.secondary">
                                            Open
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={11.5}>
                                        <Select
                                            value={isOpen}
                                            onChange={handleChangeOpen}
                                        >
                                            <MenuItem value="true">True</MenuItem>
                                            <MenuItem value="false">False</MenuItem>
                                        </Select>
                                    </Grid>
                                </Grid>
                                {/* Chỉnh trạng thái State */}
                                <Grid container alignItems="center" sx={{ paddingLeft: "10px", paddingBottom: "10px" }}>
                                    <Grid item xs={0.5}>
                                        <Typography variant="subtitle1" color="text.secondary">
                                            State
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={11.5}>
                                        <Select
                                            value={state}
                                            onChange={handleChangeState}
                                        >
                                            <MenuItem value="public">Public</MenuItem>
                                            <MenuItem value="private">Private</MenuItem>
                                        </Select>
                                    </Grid>
                                </Grid>
                                {/* Password Exam */}
                                {(state === "private") &&
                                    (
                                        <Grid container alignItems="center" sx={{ paddingLeft: "10px", paddingBottom: "10px" }}>
                                            <Grid item xs={1}>
                                                <Typography variant="subtitle1" color="text.secondary">
                                                    Password
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <TextField
                                                    required
                                                    type="password"
                                                    id="password"
                                                    value={passwordExam}
                                                    variant="outlined"
                                                    placeholder="Please enter password"
                                                    onChange={(e) => setPasswordExam(e.target.value)}
                                                    helperText={passwordExam === "" ? <span style={{ color: "red" }}>The exam password is not filled in</span> : ""}
                                                />
                                            </Grid>
                                        </Grid>
                                    )
                                }
                            </Paper>
                        </Grid>
                        <Grid item xs={10} sx={{ paddingTop: '10px' }}>
                            <Button
                                variant="contained"
                                startIcon={<AddCircleOutlineIcon />}
                                className="icon-button"
                                onClick={handleClickCreateExam}
                            >
                                Create new exam
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}