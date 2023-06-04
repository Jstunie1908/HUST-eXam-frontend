import { Container } from "@mui/system";
import { Grid, Paper, Box, TextField, InputAdornment, RadioGroup, Radio, FormControlLabel, FormLabel, Button, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions } from "@mui/material";
import React, { useEffect, useState } from "react";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AccountCircle from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import PhoneIcon from '@mui/icons-material/Phone';
import { toast } from "react-toastify";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import validator from "validator";
import Cookies from "js-cookie";

export default function SignUp() {
    const [userName, setUserName] = useState("");
    const [errUserName, setErrUserName] = useState("");
    const [emailUser, setEmailUser] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [passwordUser, setPasswordUser] = useState("");
    const [passwordUserConfirm, setPasswordUserConfirm] = useState("");
    const [errPasswordUserConfirm, setErrPasswordUserConfirm] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const navigate = useNavigate()
    const [openDialog, setOpenDialog] = useState(false);
    const errorColor = errPasswordUserConfirm === "Confirmation password is incorrect" ? "red" : "green";

    useEffect(() => {
        setPasswordUserConfirm("")
    }, [passwordUser]);

    useEffect(() => {
        if (!(validator.isEmail(emailUser) && emailUser.endsWith('@gmail.com') && emailUser !== "")) {
            setErrEmail("Invalid email");
        }
        else {
            setErrEmail("");
        }
    }, [emailUser]);

    useEffect(() => {
        const regex = /^[a-zA-Z0-9]+$/;
        // Username không chứa ký tự đặc biệt
        if (regex.test(userName) === false) {
            setErrUserName("Username cannot contain spaces or special characters");
        }
        // Username không được ngắn hơn 4 ký tự và dài hơn 12 ký tự
        else if (userName.length < 4 || userName.length > 12) {
            setErrUserName("The username must have a length of 4 to 12 characters");
        }
        else {
            setErrUserName("");
        }
    }, [userName]);

    useEffect(() => {
        if ((passwordUser !== passwordUserConfirm) && passwordUserConfirm !== "") {
            setErrPasswordUserConfirm("Confirmation password is incorrect");
        }
        if (passwordUser === passwordUserConfirm) {
            setErrPasswordUserConfirm("Confirmation password is correct")
        }
    }, [passwordUserConfirm, passwordUser]);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = async (choice) => {
        setOpenDialog(false);
        if (choice === "Yes") {
            const dataSendToServer = {
                email: emailUser,
                user_password: passwordUser,
                confirm_password: passwordUserConfirm,
                user_name: userName,
                gender: gender,
                phone: phone,
            };
            try {
                const response = await axios.post("http://localhost:8001/api/signup", dataSendToServer);
                const data = response.data;
                // Thông báo thành công
                if (data.code === 0) {
                    toast.success(data.message, { autoClose: 500 });
                    navigate('/');
                }

            } catch (error) {
                const response = error.response;
                const data = response.data;
                if (data.code === 1) {
                    toast.error(data.message, { autoClose: 500 });
                    return;
                }
                if (data.code === 2) {
                    toast.error(data.message, { autoClose: 500 });
                    return;
                }
                if (data.code === 3) {
                    toast.error(data.message, { autoClose: 500 });
                    return;
                }
                if (data.code === 4) {
                    toast.error(data.message, { autoClose: 500 });
                    return;
                }
            }
        }
    };


    const handleClickSignUp = (event) => {
        event.preventDefault();
        // Nếu người dùng chưa nhập đủ dữ liệu thì đưa ra thông báo
        if (userName === "" || emailUser === "" || passwordUser === "" || passwordUser === "" || passwordUserConfirm === "" || gender === "" || phone === "") {
            toast.info("Please enter full data !", { autoClose: 500 });
            return;
        }
        // Nếu người dùng nhập userName không hợp lệ
        if (errUserName !== "") {
            toast.info("Invalid user name!", { autoClose: 500 });
            return;
        }
        // Nếu người dùng nhập mật khẩu xác minh sai
        if (passwordUser !== passwordUserConfirm) {
            toast.info("Confirmation password is incorrect !", { autoClose: 500 });
            return;
        }
        // Nếu người dùng nhập địa chỉ email không hợp lệ
        if (errEmail !== "") {
            toast.info("Invalid Email", { autoClose: 500 });
            return;
        }
        // Hiển thị Dialog xác nhận
        handleOpenDialog();
    }

    const checkLogin = (Cookies.get('isLogin') === 'true');

    if (checkLogin) {
        //Redirect
        return <Navigate replace to="/home" />
    }
    else {
        return (
            <div>
                <Container maxWidth="sm">
                    <Grid
                        container
                        spacing={3}
                        direction="column"
                        justifyContent="center"
                        style={{ minHeight: "100vh" }}>
                        <Paper elevation={20} sx={{ padding: 4, margin: 5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 1 }}>
                                <h1 style={{ color: 'dodgerblue' }}> SIGN UP </h1>
                            </Box>
                            <form>
                                <Grid container spacing={5} direction="column">
                                    {/* User name */}
                                    <Grid item>
                                        <TextField
                                            required
                                            fullWidth
                                            type={"text"}
                                            id="nameUser"
                                            label="User name"
                                            value={userName}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <DriveFileRenameOutlineIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            variant="outlined"
                                            placeholder="Please enter your name"
                                            onChange={(e) => setUserName(e.target.value)}
                                            helperText={userName === "" ? "" : <span style={{ color: "red" }}>{errUserName}</span>}
                                        />
                                    </Grid>
                                    {/* Email user */}
                                    <Grid item>
                                        <TextField
                                            required
                                            fullWidth
                                            type={"email"}
                                            id="emailUser"
                                            label="Email"
                                            value={emailUser}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AccountCircle />
                                                    </InputAdornment>
                                                )
                                            }}
                                            variant="outlined"
                                            placeholder="Please enter your email"
                                            onChange={(e) => setEmailUser(e.target.value)}
                                            helperText={emailUser === "" ? "" : <span style={{ color: "red" }}>{errEmail}</span>}
                                        />
                                    </Grid>
                                    {/* Password user */}
                                    <Grid item>
                                        <TextField
                                            required
                                            fullWidth
                                            type={"password"}
                                            id={"passwordUser"}
                                            label="Password"
                                            value={passwordUser}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <KeyIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            variant="outlined"
                                            placeholder="Please enter your password"
                                            onChange={(e) => setPasswordUser(e.target.value)}
                                        />
                                    </Grid>
                                    {/* Confirm password */}
                                    <Grid item>
                                        <TextField
                                            required
                                            fullWidth
                                            type={"password"}
                                            id={"passwordUserConfirm"}
                                            label="Confirm password"
                                            value={passwordUserConfirm}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <KeyIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            variant="outlined"
                                            placeholder="Please confirm your password"
                                            onChange={(e) => setPasswordUserConfirm(e.target.value)}
                                            //Cần nhập passwordUser trước
                                            disabled={passwordUser === ""}
                                            helperText={passwordUserConfirm === "" ? "" : <span style={{ color: errorColor }}>{errPasswordUserConfirm}</span>}
                                        />
                                    </Grid>
                                    {/* Selection gender */}
                                    <Grid item>
                                        <FormLabel>Selection your gender</FormLabel>
                                        <RadioGroup
                                            row name="selection-gender"
                                            onChange={(e) => setGender(e.target.value)}
                                            required
                                        >
                                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        </RadioGroup>
                                    </Grid>
                                    {/* Phone user */}
                                    <Grid item>
                                        <TextField
                                            required
                                            fullWidth
                                            type={"text"}
                                            id="phoneUser"
                                            label="Your phone"
                                            value={phone}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PhoneIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            variant="outlined"
                                            placeholder="Please enter your phone"
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            onClick={handleClickSignUp}
                                            title="Click to accept sign up">
                                            Sign Up
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                    <Dialog open={openDialog} onClose={() => handleCloseDialog("")} disableEscapeKeyDown={true}>
                        <DialogTitle>Confirm</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Confirm account registration
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleCloseDialog("Yes")} className="icon-button">Yes</Button>
                            <Button onClick={() => handleCloseDialog("No")} className="icon-button">No</Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </div>
        )
    }
}