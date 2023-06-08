import React from "react";
import Header from "../../components/common/header/Header";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { Button } from "@mui/material";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { useNavigate } from "react-router-dom";

export default function CreateExam() {
    const navigate = useNavigate();

    const handledClickCreateExam = () => {
        navigate('/create_exam/new');
    }

    const isLogin = (Cookies.get('isLogin') === 'true');

    if (!isLogin) {
        return <Navigate replace to="/login" />
    }
    else {
        return (
            <div style={{ paddingTop: '90px' }}>
                <Header page="Create exam" />
                <div style={{ marginLeft: '20px', marginTop: '20px' }}>
                    <Button
                        variant="contained"
                        startIcon={<CreateNewFolderIcon />}
                        className="icon-button"
                        onClick={handledClickCreateExam}
                    >
                        Create a new exam
                    </Button>
                </div >
            </div >
        );
    }
}
