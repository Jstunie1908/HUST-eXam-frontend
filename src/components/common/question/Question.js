import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, Radio, RadioGroup } from "@mui/material";
import React, { useState } from "react";
import ImageGallery from "../exam/ImageGallery";

export default function Question(props) {
    const id = props.id;
    const quizType = props.quizType;
    const quizQuestion = props.quizQuestion;
    const answerList = props.answerList;
    const arrAnswerList = JSON.parse(answerList);
    // const keyList = props.keyList;
    // const arrKeyList = JSON.parse(keyList);
    // const index = props.index;
    const [save, setSave] = useState(false);
    const linkImage = props.imageLink;
    const arrLinkImage = linkImage.split(",");
    const filteredArr = arrLinkImage.filter(Boolean);

    // Khởi tạo state để lưu trữ trạng thái của các checkbox, ví dụ như [false, false, false]
    const [checkedList, setCheckedList] = useState(
        !props.result ? Array(arrAnswerList.length).fill(false) : props.keyAns
    );

    // Khởi tạo state để lưu trữ giá trị đáp án được chọn trong RadioGroup, ví dụ như "A"
    const [selectedAnswer, setSelectedAnswer] = useState('');

    // Biến isCorrectCheckBox sẽ kiểm tra số lượng giá trị True với số lượng key
    // Trong biểu thức thứ 2, sẽ trả về false nếu tồn tại 1 đáp án không được chọn, mà đáp án này lại thuộc vào danh sách đáp án chính xác
    // const isCorrectCheckBox = arrKeyList.length === checkedList.filter(checked => checked).length
    //     && checkedList.every((checked, index) => checked || !arrKeyList.includes(arrAnswerList[index]));

    // Biến isCorrectRadio kiểm tra xem đáp án được chọn chính xác hay không
    // const isCorrectRadio = arrKeyList.includes(selectedAnswer);

    // useEffect(() => {
    //     if (quizType === "multiple_choice") {
    //         console.log(`id_question: ${id}, result: ${isCorrectCheckBox}`);
    //         props.onChangeAnswer(index, isCorrectCheckBox);
    //     }
    //     else {
    //         console.log(`id_question: ${id}, result: ${isCorrectRadio}`);
    //         props.onChangeAnswer(index, isCorrectRadio);
    //     }
    // }, [isCorrectCheckBox, isCorrectRadio, quizType, id, index])

    // Hàm xử lý khi checkbox thay đổi trạng thái
    const handleCheckChange = async (index) => {
        if (save) {
            setSave(!save);
        }
        const newCheckedList = [...checkedList];
        newCheckedList[index] = !newCheckedList[index];
        await setCheckedList(newCheckedList);
    };

    // Hàm xử lý khi radio thay đổi trạng thái
    const handleRadioChange = async (event) => {
        if (save) {
            setSave(!save);
        }
        const value = event.target.value;
        await setSelectedAnswer(value);
    };

    const handleSave = () => {
        setSave(!save);
        if (quizType === "multiple_choice") {
            // props.onChangeAnswer(index, isCorrectCheckBox);
            let arrKeySelected = [];
            for (let i = 0; i < arrAnswerList.length; i++) {
                if (checkedList[i] === true) {
                    arrKeySelected.push(arrAnswerList[i]);
                }
            }
            // console.log(`ID: ${id} + Key selected: ${arrKeySelected}`);
            props.onChangeListAnswer(id, arrKeySelected);
        }
        else {
            // props.onChangeAnswer(index, isCorrectRadio);
            let arrKeySelected = [];
            arrKeySelected.push(selectedAnswer);
            // console.log(`ID: ${id} + Key selected: ${arrKeySelected}`);
            props.onChangeListAnswer(id, arrKeySelected);
        }
    }

    return (
        <div>
            <Grid container sx={{ marginTop: '20px' }}>
                {/* ID */}
                <Grid item xs={12} sx={{ paddingLeft: '20px' }}>
                    <strong>ID: {id}</strong>
                </Grid>
                {/* Đề bài */}
                <Grid item xs={12} sx={{ paddingLeft: '20px' }}>
                    <strong>{quizQuestion}</strong>
                </Grid>
                {/* Hình ảnh */}
                <ImageGallery imageUrls={filteredArr} />
                {/* Hiển thị danh sách đáp án */}
                <Grid container sx={{ paddingTop: '10px' }}>
                    {
                        (quizType === "multiple_choice") ?
                            (
                                <Grid container>
                                    {
                                        arrAnswerList.map((answer, index) => (
                                            <Grid item xs={12} key={index} sx={{ paddingTop: '10px' }}>
                                                <Checkbox
                                                    checked={checkedList[index]}
                                                    onChange={() => handleCheckChange(index)}
                                                    disabled={props.result}
                                                />
                                                {answer}
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            )
                            :
                            (
                                <Grid container sx={{ paddingLeft: '10px' }}>
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            name={`answer_${id}`}
                                            value={selectedAnswer}
                                            onChange={handleRadioChange}
                                        >
                                            {arrAnswerList.map((answer, index) => (
                                                <Grid item xs={12} key={index} sx={{ paddingTop: '10px' }}>
                                                    <FormControlLabel
                                                        value={answer}
                                                        disabled={props.result}
                                                        control={<Radio />}
                                                        label={answer}
                                                    />
                                                </Grid>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            )
                    }
                </Grid>
                {!props.result && <Grid container>
                    <Grid item xs={12}>
                        <Box sx={{ paddingLeft: '10px', paddingTop: '10px' }}>
                            <Button
                                variant="contained"
                                sx={{ marginBottom: '10px', backgroundColor: `${save ? "green" : "blue"}` }}
                                className="icon-button"
                                onClick={handleSave}
                            >
                                {save ? "Saved" : "Save"}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>}
            </Grid>
        </div >
    )
}