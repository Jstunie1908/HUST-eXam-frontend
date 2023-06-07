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


export default function CardContainer(props) {

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
      // const response = await axios.get(`http://localhost:8001/api/exam/${props.idExam}`);
      // console.log(response);
      navigate(`/list_exams/exam/${props.idExam}`)
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div>
      <Card
        sx={{
          display: "flex",
          borderRadius: "25px",
          border: "1px solid black",
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: "290px" }}
          image={props.imgUrl}
          alt="Photo of the exam"
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
              >
                Start time : {props.startDate}
              </Typography>
            )}
            {props.endDate && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
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
                component="div"
              >
                Time - {props.Time}
              </Typography>
            )}
            {/* Dành cho kết quả bài thi */}
            {props.point && (
              <Typography
                variant="subtitle1"
                color="success.main"
                component="div"
              >
                Point - {props.point} / 10
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
            {!props.point ? (
              <>
                <Button
                  size="small"
                  className="icon-button"
                  onClick={handleClickView}
                  disabled={props.isOpen === 1 ? false : true}
                >
                  View
                </Button>
              </>
            ) : (
              <>
                <Button size="small" color="primary">
                  View Detail Result
                </Button>
              </>
            )}

          </CardActions>
        </Box>
      </Card>
    </div >
  );
}
