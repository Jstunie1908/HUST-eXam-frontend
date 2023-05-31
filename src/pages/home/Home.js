import * as React from "react";
import CardContainer from "../../components/card/CardContainer";
import styles from "./Home.module.css";
import Header from "../../components/common/header/Header";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  //Memo
  const cards = React.useMemo(() => {
    return [
      {
        id: 1,
        imgUrl:
          "https://img.uxwing.com/wp-content/themes/uxwing/download/education-school/online-exam-icon.svg",
        name: "Exam 1",
        idExam: "IT4272",
        startDate: "25/04/2023 - 07:00:00",
        endDate: "25/04/2023 - 07:00:00",
        status: "public",
      },
      {
        id: 2,
        imgUrl:
          "https://img.uxwing.com/wp-content/themes/uxwing/download/education-school/online-exam-icon.svg",
        name: "abc",
        idExam: "IT4272",
        startDate: "25/04/2023 - 07:00:00",
        endDate: "25/04/2023 - 07:00:00",
        status: "public",
      },
      {
        id: 3,
        imgUrl:
          "https://img.uxwing.com/wp-content/themes/uxwing/download/education-school/online-exam-icon.svg",
        name: "Exam 3",
        idExam: "IT4272",
        startDate: "25/04/2023 - 07:00:00",
        endDate: "25/04/2023 - 07:00:00",
        status: "public",
      },
      {
        id: 4,
        imgUrl:
          "https://img.uxwing.com/wp-content/themes/uxwing/download/education-school/online-exam-icon.svg",
        name: "Exam 4",
        idExam: "IT4272",
        startDate: "25/04/2023 - 07:00:00",
        endDate: "25/04/2023 - 07:00:00",
        status: "public",
      },
      {
        id: 5,
        imgUrl:
          "https://img.uxwing.com/wp-content/themes/uxwing/download/education-school/online-exam-icon.svg",
        name: "Exam 5",
        idExam: "IT4272",
        startDate: "25/04/2023 - 07:00:00",
        endDate: "25/04/2023 - 07:00:00",
        status: "public",
      },
      {
        id: 6,
        imgUrl:
          "https://img.uxwing.com/wp-content/themes/uxwing/download/education-school/online-exam-icon.svg",
        name: "Exam 6",
        idExam: "IT4272",
        startDate: "25/04/2023 - 07:00:00",
        endDate: "25/04/2023 - 07:00:00",
        status: "public",
      },
    ];
  }, []);

  function handleTime(datetime) {
    const date = new Date(datetime);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    const formattedDate = `${day}/${month}/${year} - ${hour}:${minute}:${second}`;
    return formattedDate;
  }

  //STATE
  const [searchText, setSearchText] = React.useState("");
  const [cardList, setCardList] = React.useState([]);

  //EFFECT
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:8001/api/exams/public");
      const exams = res.data.exams;
      const listExams = exams.map((e) => {
        return {
          id: e.id,
          imgUrl:
            "https://img.uxwing.com/wp-content/themes/uxwing/download/education-school/online-exam-icon.svg",
          name: e.title,
          startDate: handleTime(e.start_time),
          endDate: handleTime(e.end_time),
          status: e.state,
          isOpen: e.is_open,
        };
      });
      console.log(exams);
      setCardList(listExams);
    };
    fetchData();
  }, []);
  // React.useLayoutEffect(() => {
  //   setCardList(cards);
  // }, [cards]);

  //EVENT SEARCH
  const handleSearch = (text) => {
    setCardList(cards.filter((e) => e.name.includes(text)));
  };

  const isLogin = (Cookies.get('isLogin') === 'true');

  if (!isLogin) {
    return <Navigate replace to="/" />
  }
  else {
    return (
      <>
        <div>
          <Header page="Home" />
        </div>
        <div className={`${styles.homeContainer}`} style={{ paddingTop: '30px' }}>
          <div className={`${styles.content}`}>
            <div className="row">
              {/* Hiển thị danh sách các bài thi đã tham gia */}
              <div className="col-7">
                <div className="header font-weight-bold font h2" style={{ color: "white" }}>List of public exams</div>
                {cardList.map((card, id) => {
                  return (
                    <div className="mt-3" key={id}>
                      <CardContainer
                        imgUrl={card.imgUrl}
                        name={card.name}
                        idExam={card.id}
                        startDate={card.startDate}
                        endDate={card.endDate}
                        status={card.status}
                        key={card.name + id}
                        isOpen={card.isOpen}
                      />
                    </div>
                  );
                })}
              </div>
              {/* Tìm kiếm khóa học */}
              <div className="col-5">
                <div className="header font-weight-bold font h2" style={{ color: "white" }}>Search for exams</div>
                <div className="form-inline" style={{ paddingTop: '10px' }}>
                  <input
                    className="form-control mr-sm-2 w-75 mr-4"
                    type="search"
                    placeholder="Enter information of the course to search"
                    aria-label="Search"
                    onChange={(e) => {
                      setSearchText(e.target.value);
                    }}
                    id={`${styles.myInput}`}
                    title="Enter information of the course to search"
                  />
                  <button
                    className="btn btn-outline-primary my-2 my-sm-0"
                    onClick={() => handleSearch(searchText)}
                    id={`${styles.buttonSearch}`}
                    title="Click to search"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>

    );
  }
}
