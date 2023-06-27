import * as React from "react";
// import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";


export default function CardContainer(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [passwordOfExam, setPasswordOfExam] = useState("");

  const handleCloseDialog = async (choice) => {
    if (choice === "Accept") {
      Cookies.set('passwordOfExam', passwordOfExam);
      try {
        const response = await axios.post(`http://localhost:8001/api/exam/${props.idExam}`, { password: passwordOfExam }, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`
          }
        });
        // console.log(response);
        if (response.data.code === 0) {
          navigate(`/list_exams/exam/${props.idExam}`)
        }
      } catch (error) {
        if (error.response.data.message) {
          toast.info(error.response.data.message, { autoClose: 2000 });
        }
        else {
          toast.error("An error occurred while connecting to the server", { autoClose: 1500 })
        }
      }
      // navigate(`/list_exams/exam/${props.idExam}`)
    }
    setOpenDialog(false);
  }

  const compareTime = (dateString) => {
    const dateParts = dateString.split(" - ");
    const date = dateParts[0];
    const time = dateParts[1];
    const [day, month, year] = date.split("/");
    const [hours, minutes, seconds] = time.split(":");

    // Chuyển đổi chuỗi thời gian thành đối tượng Date
    const targetDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);

    // Lấy thời gian hiện tại
    const currentDate = new Date();

    // So sánh thời gian
    if (targetDate < currentDate) {
      return true;
    } else {
      return false;
    }
  }

  const navigate = useNavigate();

  const handleClickView = async () => {
    try {
      // Có mật khẩu (private) thì cần thực hiện việc nhập mật khẩu
      if (props.status === 'private') {
        setOpenDialog(true);
      }
      else {
        navigate(`/list_exams/exam/${props.idExam}`)
      }
      // const response = await axios.get(`http://localhost:8001/api/exam/${props.idExam}`);
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  const handleClickViewDetail = () => {
    const getResult = async () => {
      const config = {
        headers: {
          // Accept: "application/json",
          // "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      };
      const results = await axios.post(`http://localhost:8001/api/exam/${props.idExam}/result`, { user_id: Number(Cookies.get("id")) }, config);
      // console.log(results)
      return results
    }

    getResult().then((res) => {
      navigate(`/result/exam/${props.user_id}/${props.idExam}`)
    }).catch((err) => {
      console.log(err)
      toast.info(err.response.data.message, { autoClose: 1500 })
      return;
    })
  }

  return (
    <div>
      <Card
        sx={{
          display: "flex",
          borderRadius: "25px",
          border: "1px solid black",
          boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.4), 0 10px 20px 0 rgba(0, 0, 0, 0.4)"
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: "290px" }}
          image={props.imgUrl}
          alt="Photo of the exam"
          className={"d-mobile-none"}
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {props.name}
            </Typography>
            {props.idExam && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                ID : {props.idExam}
              </Typography>
            )}
            {props.startDate && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
                className="d-mobile-mobile-none"

              >
                Start time : {props.startDate}
              </Typography>
            )}
            {props.endDate && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
                className="d-mobile-mobile-none"

              >
                {/* Ended : {props.endDate} */}
                Ended : {compareTime(props.endDate) ? <span style={{ color: 'red' }}>{props.endDate}</span> : <span style={{ color: 'green' }}>{props.endDate}</span>}
              </Typography>
            )}
            {/* Dành cho kết quả bài thi */}
            {props.Time && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                className="d-mobile-mobile-none"
                component="div"
              >
                Time - {props.Time}
              </Typography>
            )}
            {/* Dành cho kết quả bài thi */}
            {(props.point || props.point === 0) && (
              <Typography
                variant="subtitle1"
                color="success.main"
                component="div"
              >
                Point - {props.point}
              </Typography>
              // <div>
              //   Point -{" "}
              //   <div style={{ color: "red", display: "inline-block" }}>
              //     {props.point}/10
              //   </div>
              // </div>
            )}
            {props.status && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                Status : {props.status}
              </Typography>
            )}
            {props.author && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                Author : {props.author}
              </Typography>
            )}
            {props.isOpen === 1 ? (
              <Typography variant="subtitle1" color="text.secondary" component="div">
                <span style={{ color: 'green' }}>Open</span>
              </Typography>
            ) : (
              <Typography variant="subtitle1" color="text.secondary" component="div">
                <span style={{ color: 'red' }}>Closed</span>
              </Typography>
            )}

          </CardContent>
          <CardActions>
            {(!props.point && props.point !== 0) ? (
              <>
                <Button
                  size="small"
                  className="icon-button"
                  onClick={handleClickView}
                  // Chỉ ấn vào được view khi là tác giả của bài thi hoặc bài thi mở open
                  disabled={(props.isOpen === 1 || props.author === parseInt(Cookies.get('id'))) ? false : true}
                >
                  View
                </Button>

              </>
            ) : (
              <>
                <Button size="small" color="primary" onClick={handleClickViewDetail} >
                  View Detail Result
                </Button>
              </>
            )}

          </CardActions>
        </Box>
      </Card>
      <Dialog open={openDialog} onClose={() => handleCloseDialog("")} disableEscapeKeyDown={true}>
        <DialogTitle>Confirm Password of Exam</DialogTitle>
        <DialogContent>
          <DialogContent>
            <div>
              <label htmlFor="enterpassword">Enter password of exam&nbsp;</label>
              <input
                type="password"
                title="Enter password of exam"
                id="enterpassword"
                value={passwordOfExam}
                onChange={(e) => setPasswordOfExam(e.target.value)}
                autoFocus
              />
            </div>
          </DialogContent>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog("Accept")} className="icon-button">Accept</Button>
          <Button onClick={() => handleCloseDialog("Cancel")} className="icon-button">Cancel</Button>
        </DialogActions>
      </Dialog>
    </div >
  );
}
