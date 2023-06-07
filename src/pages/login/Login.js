import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Container } from "@mui/system";
import {
  Grid,
  Paper,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccountCircle from "@mui/icons-material/AccountCircle";
import KeyIcon from "@mui/icons-material/Key";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";
import "./Login.module.css";
import { changeStateIsLogin, addToken } from "./loginSlice";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import Cookies from 'js-cookie';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Lần đầu vào :/ thì sẽ đặt isLogin bằng false
  // useEffect(() => {
  //   Cookies.set('isLogin', false);
  //   Cookies.remove('token');
  //   Cookies.remove('id');
  // }, [])

  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: ""
  })

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickSignIn = async (event) => {
    event.preventDefault();
    // Kiểm tra xem bỏ trống dữ liệu hay không
    if (values.email === "") {
      toast.error("You have not entered your email !", { autoClose: 500 });
      return;
    }
    if (values.password === "") {
      toast.error("You have not entered your password !", { autoClose: 500 });
      return;
    }
    // Nếu sử dụng email để đăng nhập.
    if (validator.isEmail(values.email) && values.email.endsWith('@gmail.com')) {
      // Data gửi cho server
      const dataSendToServer = {
        email: values.email,
        user_password: values.password
      };
      try {
        const response = await axios.post("http://localhost:8001/api/login/email", dataSendToServer);
        const data = response.data;
        if (data.code === 0) {
          // Lấy token user
          const token = data.token;
          // Thay đổi isLogin và token trong Store
          dispatch(changeStateIsLogin({ isLogin: true }));
          dispatch(addToken({ token: token }));
          // Lưu token vào Cookies, thay đổi isLogin = true trong Token
          Cookies.set('token', token, { expires: 1 });
          Cookies.set('isLogin', true);
          Cookies.set('id', data.user.id);
          // Thông báo thành công vào chuyển trang
          toast.success(data.message, { autoClose: 500 });
          navigate("/home");
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
      }
    }
    // Sử dụng username đăng nhập
    else {
      // Data gửi cho server
      const dataSendToServer = {
        user_name: values.email,
        user_password: values.password
      };
      try {
        const response = await axios.post("http://localhost:8001/api/login/username", dataSendToServer);
        const data = response.data;
        if (data.code === 0) {
          // Lấy token user
          const token = data.token;
          // Thay đổi isLogin và token trong Store
          dispatch(changeStateIsLogin({ isLogin: true }));
          dispatch(addToken({ token: token }));
          // Lưu token vào Cookies, thay đổi isLogin = true trong Token
          Cookies.set('token', token, { expires: 1 });
          Cookies.set('isLogin', true);
          Cookies.set('id', data.user.id);
          // Thông báo thành công vào chuyển trang
          toast.success(data.message, { autoClose: 500 });
          navigate("/home");
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
      }
    }
  }

  const checkLogin = (Cookies.get('isLogin') === 'true');

  if (checkLogin) {
    //Redirect
    return <Navigate replace to="/home" />
  }
  else {
    return (
      <div>
        <Container fixed maxWidth="sm">
          <Grid
            container
            spacing={3}
            direction="column"
            justifyContent="center"
            style={{ minHeight: "100vh" }}>
            <Paper elevation={20} sx={{ padding: 4, margin: 5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 1 }}>
                <h1 style={{ color: 'dodgerblue' }}> SIGN IN </h1>
              </Box>
              <form>
                <Grid container spacing={5} direction="column">
                  {/* Enter email user*/}
                  <Grid item >
                    <TextField
                      autoFocus
                      required
                      fullWidth
                      type={"text"}
                      id="emailUser"
                      label="Email or Username"
                      value={values.email}
                      // Thêm icon AccountCircle vào đầu TextField
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      placeholder="Enter your email or username"
                      // Thêm onChange
                      onChange={(e) => setValues({ ...values, email: e.target.value })}
                      title="Enter your email or username"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleClickSignIn(e);
                        }
                      }}
                    />
                  </Grid>
                  {/* Enter password user */}
                  <Grid item >
                    <TextField
                      required
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      id="passwordUser"
                      label="Password"
                      value={values.password}
                      // Thêm icon KeyIcon vào đầu TextField và xử lý ẩn hiện pass
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <KeyIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      placeholder="Enter your password"
                      // Thêm onChange
                      onChange={(e) => setValues({ ...values, password: e.target.value })}
                      title="Enter your password"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleClickSignIn(e);
                        }
                      }}
                    />
                  </Grid>
                  {/* Submit và signup*/}
                  <Grid item>
                    <Box sx={{ display: 'flex' }} justifyContent="space-between" alignItems="baseline">
                      <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={handleClickSignIn}
                        title="Click to sign in"
                      >
                        Sign In
                      </Button>
                      <Link
                        to="/signup"
                        style={{ textDecoration: 'none' }}
                        title="Click to sign up">
                        <span className="link-text">Sign up for an account here</span>
                      </Link>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Container>
      </div >
    )
  }
}
