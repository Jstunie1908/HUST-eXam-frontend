import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import TransgenderIcon from '@mui/icons-material/Transgender';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import StarIcon from '@mui/icons-material/Star';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import CreateIcon from '@mui/icons-material/Create';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function LayoutProfile() {
    // Lấy id
    const id = Cookies.get('id');
    // Lấy token
    const token = Cookies.get('token')
    // Thông tin của user
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [role, setRole] = useState("");
    const [rank, setRank] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    // Thay đổi phone, gender
    const [openChangePhone, setOpenChangePhone] = useState(false);
    const [openChangeGender, setOpenChangeGender] = useState(false);
    // Thay đổi canSave
    const [canSave, setCanSave] = useState(false);
    // openDialog
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const id = Cookies.get('id');
                // console.log("token:", token);
                const response = await axios.get(`http://localhost:8001/api/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // console.log(response);
                const data = response.data;
                setEmail(data.user.email);
                setUserName(data.user.user_name);
                setPhone(data.user.phone);
                setGender(data.user.gender);
                setRole(data.user.role);
                setRank(data.user.rank);
                setCreatedAt(data.user.createdAt);
            } catch (error) {
                toast.error("An error occurred while connecting to the server", { autoClose: 500 })
                // console.log(error);
            }
        }
        fetchData();
    }, [token]);

    const handleClickChangePhone = () => {
        // Thay đổi trạng thái nút Save
        if (openChangePhone === false) {
            setCanSave(true);
        }
        setOpenChangePhone(!openChangePhone);
    }
    const handleClickChangeGender = () => {
        // Thay đổi trạng thái nút Save
        if (openChangeGender === false) {
            setCanSave(true);
        }
        setOpenChangeGender(!openChangeGender);
        setGender(gender === "male" ? "female" : "male");

    }
    // Xử lý khi click save
    const handleClickSave = (event) => {
        event.preventDefault();
        const regex = /^[0-9]+$/; // Biểu thức chính quy kiểm tra chữ số
        if (!regex.test(phone)) {
            toast.info("The phone number should only consist of digits!", { autoClose: 1000 });
            return;
        }
        // Đóng việc change phone, change gender
        setOpenChangePhone(false);
        setOpenChangeGender(false);
        // Hiển thị Dialog xác nhận
        handleOpenDialog()
    }
    // Xử lý dialog
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = async (choice) => {
        setOpenDialog(false);
        if (choice === "Yes") {
            try {
                const url = `http://localhost:8001/api/user/${id}/update`;
                const data = {
                    phone: phone,
                    gender: gender,
                };
                const headers = { 'Authorization': `Bearer ${token}` };
                const response = await axios.put(
                    url,
                    data,
                    { headers }
                );
                // console.log(response);
                toast.success(response.data.message, { autoClose: 1000 });
            } catch (error) {
                toast.error("An error occurred while connecting to the server", { autoClose: 500 })
                // console.log(error);
            }
        }
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            {/* Tiêu đề */}
            <Typography variant="h5" gutterBottom>
                <strong>Personal Information</strong>
            </Typography>
            {/* Nội dung */}
            <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
                {/* Email */}
                <Grid container sx={{ paddingTop: '20px', paddingRight: "20px" }}>
                    <Grid item sx={{ paddingRight: '20px', paddingLeft: '15px' }} xs={2} className="flex-basis-width">
                        <Typography><strong>Email</strong></Typography>
                    </Grid>
                    <Grid item sx={{ paddingRight: '20px' }} xs={3} className="flex-basis-width-remain">
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
                            sx={{ width: "100%", paddingLeft: "15px" }}
                        />
                    </Grid>
                </Grid>
                {/* User name */}
                <Grid container sx={{ paddingTop: '20px' }}>
                    <Grid item sx={{ paddingRight: '20px', paddingLeft: '15px' }} xs={2} className="flex-basis-width">
                        <Typography><strong>User name</strong></Typography>
                    </Grid>
                    <Grid item sx={{ paddingRight: '20px', paddingLeft: "15px" }} xs={3} className="flex-basis-width-remain">
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
                {/* Phone */}
                <Grid container sx={{ paddingTop: '20px' }}>
                    <Grid item sx={{ paddingRight: '20px', paddingLeft: '15px' }} xs={2} className="flex-basis-width">
                        <Typography><strong>Phone</strong></Typography>
                    </Grid>
                    <Grid item sx={{ paddingRight: '20px', paddingLeft: "15px" }} xs={3} className="flex-basis-width-remain">
                        <TextField
                            onChange={(event) => { setPhone(event.target.value) }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PhoneIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            disabled={!openChangePhone}
                            value={phone}
                            sx={{ width: "100%", }}
                        />
                    </Grid>
                    <Grid item sx={{ paddingRight: '20px' }} xs={1}>
                        <IconButton onClick={handleClickChangePhone} className="icon-button">
                            {openChangePhone ? <BorderColorIcon style={{ color: 'dodgerblue' }} /> : <CreateIcon />}
                        </IconButton>
                    </Grid>
                </Grid>
                {/* Gender */}
                <Grid container sx={{ paddingTop: '20px' }}>
                    <Grid item sx={{ paddingRight: '20px', paddingLeft: '15px' }} xs={2} className="flex-basis-width">
                        <Typography><strong>Gender</strong></Typography>
                    </Grid>
                    <Grid item sx={{ paddingRight: '20px' }} xs={3} className="flex-basis-width-remain">
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TransgenderIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            disabled
                            value={gender}
                            sx={{ width: "100%", paddingLeft: "15px" }}
                        />
                    </Grid>
                    <Grid item sx={{ paddingRight: '20px' }} xs={1}>
                        <IconButton onClick={handleClickChangeGender} className="icon-button">
                            {openChangeGender ? <SwapHorizIcon style={{ color: "dodgerblue" }} /> : <SwapHorizIcon />}
                        </IconButton>
                    </Grid>
                </Grid>
                {/* Role */}
                <Grid container sx={{ paddingTop: '20px' }}>
                    <Grid item sx={{ paddingRight: '20px', paddingLeft: '15px' }} xs={2} className="flex-basis-width">
                        <Typography><strong>Role</strong></Typography>
                    </Grid>
                    <Grid item sx={{ paddingRight: '20px',paddingLeft: "15px" }} xs={3} className="flex-basis-width-remain">
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ManageAccountsIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            disabled
                            value={role}
                            sx={{ width: "100%" }}
                        />
                    </Grid>
                </Grid>
                {/* Rank */}
                <Grid container sx={{ paddingTop: '20px' }}>
                    <Grid item sx={{ paddingRight: '20px', paddingLeft: '15px' }} xs={2} className="flex-basis-width">
                        <Typography><strong>Rank</strong></Typography>
                    </Grid>
                    <Grid item sx={{ paddingRight: '20px', paddingLeft: "15px" }} xs={3} className="flex-basis-width-remain">
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <StarIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            disabled
                            value={rank}
                            sx={{ width: "100%" }}
                        />
                    </Grid>
                </Grid>
                {/* Created At */}
                <Grid container sx={{ paddingTop: '20px' }}>
                    <Grid item sx={{ paddingRight: '20px', paddingLeft: '15px' }} xs={2} className="flex-basis-width">
                        <Typography><strong>Created at</strong></Typography>
                    </Grid>
                    <Grid item sx={{ paddingRight: '20px', paddingLeft: "15px" }} xs={3} className="flex-basis-width-remain">
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EditCalendarIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            disabled
                            value={createdAt}
                            sx={{ width: "100%" }}
                        />
                    </Grid>
                </Grid>
                {/* Save Button */}
                <Grid container sx={{ paddingLeft: '20px', paddingTop: '20px' }}>
                    <Button
                        className="icon-button"
                        variant="contained"
                        onClick={(event) => handleClickSave(event)}
                        title="Click to save"
                        disabled={canSave === true ? false : true}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
            <Dialog open={openDialog} onClose={() => handleCloseDialog("")} disableEscapeKeyDown={true}>
                <DialogTitle>Confirm</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Confirm change information
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCloseDialog("Yes")} className="icon-button">Yes</Button>
                    <Button onClick={() => handleCloseDialog("No")} className="icon-button">No</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}