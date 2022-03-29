import { Button } from "antd";
import { useEffect, useState } from "react";
import "./styles.scss";
import "./style.css";
import { LogoutOutlined } from "@ant-design/icons";

const sidebar = () => {
  const [reportsPost, setReportsPost] = useState(0);
  const [reportsQuestion, setReportsQuestion] = useState(0);
  const [countRequest, setCountRequest] = useState(0);

  useEffect(() => {
    const getReports = async () => {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await fetch(
          "https://knowx-fe.herokuapp.com/api/user/posts/report/count",
          requestOptions
        );
        const responseJSON = await response.json();
        setReportsPost(responseJSON.count);
      } catch (error) {
        console.log("Failed fetch", error.message);
      }
    };

    getReports();
  }, []);

  useEffect(() => {
    const getReports = async () => {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await fetch(
          "https://knowx-fe.herokuapp.com/api/user/questions/report/count",
          requestOptions
        );
        const responseJSON = await response.json();
        setReportsQuestion(responseJSON.count);
      } catch (error) {
        console.log("Failed fetch", error.message);
      }
    };

    getReports();
  }, []);

  useEffect(() => {
    const getReports = async () => {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await fetch(
          "https://knowx-fe.herokuapp.com/api/user/request/mentor/count",
          requestOptions
        );
        const responseJSON = await response.json();
        setCountRequest(responseJSON.count);
      } catch (error) {
        console.log("Failed fetch", error.message);
      }
    };

    getReports();
  }, []);

  document.title = `KNOWX (${reportsPost + reportsQuestion + countRequest})`;

  const handleLogout = () => {
    const token = sessionStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    fetch("https://knowx-fe.herokuapp.com/api/user/logout", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          window.location.reload();
          sessionStorage.clear();
          const temp = window.location.origin;
          window.location.href = `${temp}/auth`;
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li className="menu-title">Main</li>
            <li>
              <a href="/admin">
                <i className="fa fa-dashboard" /> <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/admin/companies">
                <i className="fa-solid fa-user-tie" /> <span>Companies</span>
              </a>
            </li>
            <li>
              <a href="/admin/users">
                <i className="fa-solid fa-users" /> <span>Users</span>
              </a>
            </li>
            <li>
              <a href="/admin/reports">
                <i className="fa-solid fa-circle-exclamation" />{" "}
                <span>
                  Reports
                  {reportsPost + reportsQuestion === 0 ? null : (
                    <Button
                      shape="circle"
                      style={{
                        marginLeft: "5px",
                        color: "white",
                        background: "#ff4d4f",
                        fontSize: "12px",
                        border: "1px solid #fff",
                      }}
                      size="small"
                    >
                      {reportsPost + reportsQuestion}
                    </Button>
                  )}
                </span>
              </a>
            </li>
            <li>
              <a href="/admin/requests">
                <i className="fa fa-calendar-check-o" />{" "}
                <span>
                  Requests{" "}
                  {countRequest === 0 ? null : (
                    <Button
                      shape="circle"
                      style={{
                        marginLeft: "5px",
                        color: "white",
                        background: "#ff4d4f",
                        fontSize: "12px",
                        border: "1px solid #fff",
                      }}
                      size="small"
                    >
                      {countRequest}
                    </Button>
                  )}
                </span>
              </a>
            </li>
            {/* <li className="active"> */}
            <li>
              <a href="departments.html">
                <i className="fa fa-hospital-o" /> <span>Departments</span>
              </a>
            </li>
            <li className="submenu">
              <a href="#">
                <i className="fa fa-user" /> <span> Employees </span>{" "}
                <span className="menu-arrow" />
              </a>
              <ul style={{ display: "none" }}>
                <li>
                  <a href="employees.html">Employees List</a>
                </li>
                <li>
                  <a href="leaves.html">Leaves</a>
                </li>
                <li>
                  <a href="holidays.html">Holidays</a>
                </li>
                <li>
                  <a href="attendance.html">Attendance</a>
                </li>
              </ul>
            </li>
            <Button
              onClick={handleLogout}
              type="primary"
              shape="round"
              icon={<LogoutOutlined />}
              style={{ width: "80%", marginTop: "50px", marginLeft: "10%" }}
            >
              Logout
            </Button>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default sidebar;
