
import React, { useState } from "react";
import { TextField, Button, Box, Stack } from "@material-ui/core";
import { Container } from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import "./styles.scss";
import AuthRight from "../../../../components/AuthRight";
import images from "../../../../assets/images";

const ForgotPassword = () => {
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
            <div className="forgot-wrapper">
              <TextField
                label="Your email"
                type="text"
                name="email"
                fullWidth
                variant="outlined"
                value={loginData.email}
                onChange={onChangeHandler}
              />
              <Stack
                width="100%"
                direction="row"
                justifyContent="center"
              >
                <Button
                  sx={{ p: 1, width: "35%" }}
                  variant="contained"
                  color="primary"
                >
                  SEND TO THIS EMAIL
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
export default ForgotPassword;
