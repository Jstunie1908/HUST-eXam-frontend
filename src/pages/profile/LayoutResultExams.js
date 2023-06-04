import React from "react";
import CardContainer from "../../components/card/CardContainer";
import styles from "../home/Home.module.css";
import { useTheme, ThemeProvider } from "@emotion/react";

export default function LayoutResultExams() {
  const theme = useTheme();
  //Memo
  const cards = React.useMemo(() => {
    return [
      {
        id: 1,
        imgUrl:
          "https://soict.daotao.ai/asset-v1:SoICT+IT4272+2022-1+type@asset+block@Capture.JPG",
        name: "Hệ thống máy tính - Thi cuối kỳ 2022-1",
        maHp: "IT4272",
        Time: "10:30:56, 01/03/2023",
        point: 9,
      },
      {
        id: 2,
        imgUrl:
          "https://soict.daotao.ai/asset-v1:SoICT+IT4272+2022-1+type@asset+block@Capture.JPG",
        name: "abc",
        maHp: "IT4272",
        Time: "10:30:56, 01/03/2023",
        point: 10,
      },
      {
        id: 3,
        imgUrl:
          "https://soict.daotao.ai/asset-v1:SoICT+IT4272+2022-1+type@asset+block@Capture.JPG",
        name: "Hệ thống máy tính - Thi cuối kỳ 2022-1",
        maHp: "IT4272",
        Time: "10:30:56, 01/03/2023",
        point: 10,
      },
      {
        id: 4,
        imgUrl:
          "https://soict.daotao.ai/asset-v1:SoICT+IT4272+2022-1+type@asset+block@Capture.JPG",
        name: "Hệ thống máy tính - Thi cuối kỳ 2022-1",
        maHp: "IT4272",
        Time: "10:30:56, 01/03/2023",
        point: 8,
      },
      {
        id: 5,
        imgUrl:
          "https://soict.daotao.ai/asset-v1:SoICT+IT4272+2022-1+type@asset+block@Capture.JPG",
        name: "Hệ thống máy tính - Thi cuối kỳ 2022-1",
        maHp: "IT4272",
        Time: "10:30:56, 01/03/2023",
        point: 7,
      },
      {
        id: 6,
        imgUrl:
          "https://soict.daotao.ai/asset-v1:SoICT+IT4272+2022-1+type@asset+block@Capture.JPG",
        name: "Hệ thống máy tính - Thi cuối kỳ 2022-1",
        maHp: "IT4272",
        Time: "10:30:56, 01/03/2023",
        point: 10,
      },
    ];
  }, []);

  //STATE
  const [searchText, setSearchText] = React.useState("");
  const [cardList, setCardList] = React.useState([]);

  //EFFECT
  React.useLayoutEffect(() => {
    setCardList(cards);
  }, [cards]);

  //EVENT SEARCH
  const handleSearch = (text) => {
    setCardList(cards.filter((e) => e.name.includes(text)));
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
