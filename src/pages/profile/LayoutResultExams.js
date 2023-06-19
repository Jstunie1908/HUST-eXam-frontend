import React from "react";
import CardContainer from "../../components/card/CardContainer";
import styles from "../home/Home.module.css";
import { useTheme, ThemeProvider } from "@emotion/react";
import axios from "axios";
import Cookies from "js-cookie";


export default function LayoutResultExams() {
  const theme = useTheme();
  //Memo
  // const cards = React.useMemo(() => {
  //   return [
  //     {
  //       id: 1,
  //       imgUrl:
  //         "https://soict.daotao.ai/asset-v1:SoICT+IT4272+2022-1+type@asset+block@Capture.JPG",
  //       name: "Hệ thống máy tính - Thi cuối kỳ 2022-1",
  //       maHp: "IT4272",
  //       Time: "10:30:56, 01/03/2023",
  //       point: 9,
  //     },
  //     {
  //       id: 2,
  //       imgUrl:
  //         "https://soict.daotao.ai/asset-v1:SoICT+IT4272+2022-1+type@asset+block@Capture.JPG",
  //       name: "abc",
  //       maHp: "IT4272",
  //       Time: "10:30:56, 01/03/2023",
  //       point: 10,
  //     },
  //     {
  //       id: 3,
  //       imgUrl:
  //         "https://soict.daotao.ai/asset-v1:SoICT+IT4272+2022-1+type@asset+block@Capture.JPG",
  //       name: "Hệ thống máy tính - Thi cuối kỳ 2022-1",
  //       maHp: "IT4272",
  //       Time: "10:30:56, 01/03/2023",
  //       point: 10,
  //     },
  //     {
  //       id: 4,
  //       imgUrl:
  //         "https://soict.daotao.ai/asset-v1:SoICT+IT4272+2022-1+type@asset+block@Capture.JPG",
  //       name: "Hệ thống máy tính - Thi cuối kỳ 2022-1",
  //       maHp: "IT4272",
  //       Time: "10:30:56, 01/03/2023",
  //       point: 8,
  //     },
  //     {
  //       id: 5,
  //       imgUrl:
  //         "https://soict.daotao.ai/asset-v1:SoICT+IT4272+2022-1+type@asset+block@Capture.JPG",
  //       name: "Hệ thống máy tính - Thi cuối kỳ 2022-1",
  //       maHp: "IT4272",
  //       Time: "10:30:56, 01/03/2023",
  //       point: 7,
  //     },
  //     {
  //       id: 6,
  //       imgUrl:
  //         "https://soict.daotao.ai/asset-v1:SoICT+IT4272+2022-1+type@asset+block@Capture.JPG",
  //       name: "Hệ thống máy tính - Thi cuối kỳ 2022-1",
  //       maHp: "IT4272",
  //       Time: "10:30:56, 01/03/2023",
  //       point: 10,
  //     },
  //   ];
  // }, []);
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
  const [card, setCard] = React.useState([])


  //EFFECT
  React.useEffect(() => {
    const fetchData  =  async () => {
      const user_id = Cookies.get("id")
      const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            Authorization: `Bearer ${Cookies.get('token')}`,
        }
    };
      const res = await axios.get(`http://localhost:8001/api/exam/result/${user_id}`,config)
      return res
    }
    fetchData().then((res) => {
      const data = res.data.allTests;
      console.log(res.data.allTests)
      setCard(data.map((e) => {
        return {
          id: e.id,
          name: `Exam ${e.id}`,
          point: e.score,
          Time: handleTime(e.updatedAt),
          imgUrl: "https://img.uxwing.com/wp-content/themes/uxwing/download/education-school/online-exam-icon.svg",
          maHp: `IT${e.id}`
        }
      }))
    })
  }, [])

  React.useLayoutEffect(() => {
    setCardList(card);
  }, [ card]);

  //EVENT SEARCH
  const handleSearch = (text) => {
    setCardList(card.filter((e) => e.name.includes(text)));
  };
  return (
    <>
      <div className={``}>
        <div className={``}>
          <div className="row">
            <div className="col-7">
              <div
                className="header font-weight-bold font h2"
                style={{ color: "white" }}
              >
                List of Result of exams
              </div>
              {/* Hiển thị danh sách các bài thi */}
              {cardList.map((card, id) => {
                return (
                  <div className="mt-3" key={id}>
                    <ThemeProvider theme={theme}>
                      <CardContainer
                        imgUrl={card.imgUrl}
                        name={card.name}
                        maHp={card.maHp}
                        Time={card.Time}
                        key={card.name + id}
                        point={card.point}
                        idExam={card.id}
                        user_id={Cookies.get("id")}
                      />
                    </ThemeProvider>
                  </div>
                );
              })}
            </div>
            <div className="col-5">
              <div
                className="header font-weight-bold font h2"
                style={{ color: "white" }}
              >
                Search for exams
              </div>
              <div className="form-inline" style={{ paddingTop: "10px" }}>
                <input
                  style={{ boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 10px 20px 0 rgba(0, 0, 0, 0.2)" }}
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
