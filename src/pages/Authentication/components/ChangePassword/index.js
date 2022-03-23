
import React, { useState } from "react";
import { TextField, Button, Box, Stack } from "@material-ui/core";
import { Container } from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import "./styles.scss";
import AuthRight from "../../../../components/AuthRight";
import images from "../../../../assets/images";

const ChangePassword = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const onChangeHandler = (e) => {
    const tmpLogin = { ...loginData };
    tmpLogin[e.target.name] = e.target.value;
    setLoginData(tmpLogin);
  };
  const theme = createTheme({
    palette: {
      primary: {
        main: "#00358E",
      },
    },
  });
  return (
    <>
      <Container className="themed-container mt-2" fluid="sm">
        <ThemeProvider theme={theme}>
          <div className="wrapper">
            <div className="logo">
              <img src={images.knowXLogo} alt="logo" />
            </div>
            <div className="change-password-wrapper">
              <TextField
                label="New password"
                type="text"
                name="newPassword"
                fullWidth
                variant="outlined"
                value={loginData.email}
                onChange={onChangeHandler}
              />

              <TextField
                label="Confirm new password"
                name="confirmPassword"
                fullWidth
                variant="outlined"
                value={loginData.password}
                onChange={onChangeHandler}
              />
              <Stack
                width="100%"
                direction="row"
                justifyContent="space-between"
              >
                <Button
                  sx={{ p: 1, width: "100%" }}
                  variant="contained"
                  color="primary"
                >
                  CHANGE PASSWORD
                </Button>
              </Stack>
            </div>
          </div>
        </ThemeProvider>
      </Container>
      <AuthRight />
    </>
  );
};
export default ChangePassword;
