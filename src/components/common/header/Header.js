import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { changeStateIsLogin, resetToken } from "../../../pages/login/loginSlice";

const pages = ["Home", "List exams", "Create exam"];
const settings = ["Profile", "Logout"];

function Header(props) {
  // props.page
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickHomeIcon = () => {
    navigate("/home");
  }

  const handleClickItemMenu = (page) => {
    const url = `/${page.toLowerCase().replace(" ", "_")}`;
    navigate(url);
    handleCloseNavMenu();
  }

  const handleClickUserMenu = (setting) => {
    if (setting === "Logout") {
      dispatch(changeStateIsLogin({ isLogin: false }));
      dispatch(resetToken())
      // Xử lý lưu trữ trong Cookies
      Cookies.remove('token');
      Cookies.remove('id');
      Cookies.set('isLogin', false);
      navigate("/login");
    }
    else {
      const url = `/${setting.toLowerCase().replace(" ", "_")}`;
      navigate(url);
    }
    handleCloseUserMenu();
  }

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl" sx={{ background: "linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(40, 145, 167, 1) 0%, rgba(37, 191, 59, 0.3926820728291317) 100%);" }}>
        <Toolbar>
          {/* Icon Home */}
          <IconButton onClick={handleClickHomeIcon} size="large" className="icon-button">
            <HomeIcon sx={{ fontSize: 45, color: "green" }} />
          </IconButton>
          {/* Tạo box, box này chứa icon Menu, và các MenuItem sử dụng khi người dùng thu nhỏ màn hình */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              className="icon-button"
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page, index) => {
                return (
                  <MenuItem key={index} onClick={() => handleClickItemMenu(page)}>
                    <Typography textAlign="center" variant="h6" noWrap>
                      {page}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>
          {/* Tạo các Button có nhãn gồm các page khi người dùng để màn hình trạng thái lớn*/}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex", paddingLeft: '20px', marginLeft: '20px' } }}>
            {pages.map((page, index) => {
              return (
                <Button
                  key={index}
                  onClick={() => handleClickItemMenu(page)}
                  className="icon-button"
                  sx={{
                    my: 2,
                    borderRadius: '0px',
                    color: `${(props.page === page) ? "green" : "white"}`,
                    display: "block",
                    textTransform: "none",
                    fontSize: "18px",
                    fontSizeAdjust: "none",
                    borderLeft: `${(props.page === page) ? "3px solid green" : "3px solid white"}`,
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    width: '160px',
                  }}
                >
                  {page}
                </Button>
              )
            })}
          </Box>
          {/* Tạo Box, bao gồm Icon Avatar và các MenuItem hiển thị khi người dùng click vào */}
          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ paddingRight: '0px' }} className="icon-button">
              <Avatar />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                <MenuItem key={index} onClick={() => handleClickUserMenu(setting)}>
                  <Typography
                    textAlign="center"
                  >
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar >
  );
}
export default Header;
