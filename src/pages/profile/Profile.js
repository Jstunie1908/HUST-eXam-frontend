import React from "react";
import Header from "../../components/common/header/Header";
import { Box, Paper, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import LayoutProfile from "./LayoutProfile";
import LayoutResultExams from "./LayoutResultExams";
import LayoutAccount from "./LayoutAccount";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

export default function Profile() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const isLogin = (Cookies.get('isLogin') === 'true');

  if (!isLogin) {
    return <Navigate replace to="/login" />
  }
  else {
    return (
      <div style={{ paddingTop: "90px" }} className="h-100">
        <Header page="Profile" />
        <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
          <Paper sx={{ paddingLeft: "20px", paddingRight: "20px" }}>
            <Box sx={{ typography: "body1", backgroundColor: "white" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1 }}>
                  <TabList onChange={handleChange}>
                    <Tab label="Profile" className="icon-button" value="1" />
                    <Tab label="Account" className="icon-button" value="2" />
                    <Tab label="Exam results" className="icon-button" value="3" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <LayoutProfile />
                </TabPanel>
                <TabPanel value="2">
                  <LayoutAccount />
                </TabPanel>
                <TabPanel value="3">
                  <LayoutResultExams />
                </TabPanel>
              </TabContext>
            </Box>
          </Paper>
        </div>
      </div>
    );
  }
}