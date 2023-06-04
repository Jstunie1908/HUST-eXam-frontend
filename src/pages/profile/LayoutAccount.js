import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import PasswordIcon from '@mui/icons-material/Password';

export default function LayoutAccount() {
    // Lấy id
    const id = Cookies.get('id');
    // Lấy token
    const token = Cookies.get('token')
    // Thông tin của user
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    // Tạo form xác nhận mật khẩu 
    const [openForm, setOpenForm] = useState(false);
    // Mật khẩu mới
    const [newPassword, setNewPassword] = useState("");
    // openDialog
    const [openDialog, setOpenDialog] = useState(false);

    const handleClickChangePassword = () => {
        setOpenForm(true);
    }

    const handleClickCancel = () => {
        setNewPassword("");
        setOpenForm(false);
    }

    const handleClickSave = () => {
        handleOpenDialog();
    }

    const handleOpenDialog = () => {
        setOpenDialog(true);
    }

    const handleCloseDialog = async (choice) => {
        setOpenDialog(false);
        if (choice === "Yes") {
            try {
                const url = `http://localhost:8001/api/user/${id}/update`;
                const data = {
                    user_password: newPassword,
                };
                const headers = { 'Authorization': `Bearer ${token}` };
                const response = await axios.put(
                    url,
                    data,
                    { headers }
                );
                // console.log(response);
                toast.success(response.data.message, { autoClose: 1000 });
                handleClickCancel();
            } catch (error) {
                toast.error("An error occurred while connecting to the server", { autoClose: 500 })
                // console.log(error);
            }
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`http://localhost:8001/api/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // console.log(response);
                const data = response.data;
                setEmail(data.user.email);
                setUserName(data.user.user_name);
            } catch (error) {
                toast.error("An error occurred while connecting to the server", { autoClose: 500 })
                // console.log(error);
            }
        }
        fetchData();
    }, [token, id]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            {/* Tiêu đề */}
            <Typography variant="h5" gutterBottom>
                <strong>Account Information</strong>
            </Typography>
            {/* Nội dung */}
            <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
                {/* Email */}
                <Grid container sx={{ paddingTop: '20px' }}>
                    <Grid item sx={{ paddingRight: '20px', paddingLeft: '15px' }} xs={1}>
                        <Typography><strong>Email</strong></Typography>
                    </Grid>
                    <Grid item sx={{ paddingRight: '20px' }} xs={3}>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            disabled
                            value={email}
                            sx={{ width: "100%" }}
                        />
                    </Grid>
                </Grid>
                {/* User name */}
                <Grid container sx={{ paddingTop: '20px' }}>
                    <Grid item sx={{ paddingRight: '20px', paddingLeft: '15px' }} xs={1}>
                        <Typography><strong>User name</strong></Typography>
                    </Grid>
                    <Grid item sx={{ paddingRight: '20px' }} xs={3}>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BadgeIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            disabled
                            value={userName}
                            sx={{ width: "100%" }}
                        />
                    </Grid>
                </Grid>
                {/* Change password button */}
                {
                    !openForm && (
                        <Grid
                            container
                            sx={{ paddingLeft: '20px', paddingTop: '20px' }}
                        >
                            <Button
                                className="icon-button"
                                variant="contained"
                                onClick={(event) => handleClickChangePassword(event)}
                                title="Click to change password"
                            >
                                Change password account
                            </Button>
                        </Grid>
                    )
                }
                {
                    // Hiển thị form nhập mật khẩu mới
                    openForm && (
                        <>
                            <Grid container sx={{ paddingTop: '20px' }}>
                                <Grid item sx={{ paddingRight: '20px', paddingLeft: '15px' }} xs={1}>
                                    <Typography><strong>New password</strong></Typography>
                                </Grid>
                                <Grid item sx={{ paddingRight: '20px' }} xs={3}>
                                    <TextField
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PasswordIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        type="password"
                                        variant="standard"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        sx={{ width: "100%" }}
                                    />
                                </Grid>
                                <Grid container sx={{ paddingTop: '20px', paddingLeft: '20px' }}>
                                    <Grid item>
                                        <Button
                                            className="icon-button"
                                            variant="contained"
                                            onClick={handleClickSave}
                                            title="Click to save"
                                            sx={{ marginRight: '20px' }}
                                        >
                                            Save
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            className="icon-button"
                                            variant="contained"
                                            onClick={handleClickCancel}
                                            title="Click to cancel"
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </>
                    )
                }
            </Grid>
            <Dialog open={openDialog} onClose={() => handleCloseDialog("")} disableEscapeKeyDown={true}>
                <DialogTitle>Confirm</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Confirm change password
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCloseDialog("Yes")} className="icon-button">Yes</Button>
                    <Button onClick={() => handleCloseDialog("No")} className="icon-button">No</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}