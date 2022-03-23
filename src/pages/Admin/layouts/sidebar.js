import { Button } from "antd";
import { useEffect, useState } from "react";
import "./styles.scss";

const sidebar = () => {
  const [reports, setReports] = useState(0);

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
          "http://127.0.0.1:8000/api/user/posts/report/count",
          requestOptions
        );
        const responseJSON = await response.json();
        setReports(responseJSON.count);
      } catch (error) {
        console.log("Failed fetch", error.message);
      }
    };
    getReports();
  }, []);

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
                <i className="fa fa-user-md" /> <span>Companies</span>
              </a>
            </li>
            <li>
              <a href="/admin/users">
                <i className="fa fa-wheelchair" /> <span>Users</span>
              </a>
            </li>
            <li>
              <a href="/admin/reports">
                <i className="fa fa-calendar" />{" "}
                <span>
                  Reports
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
                    {reports}
                  </Button>
                </span>
              </a>
            </li>
            <li>
              <a href="schedule.html">
                <i className="fa fa-calendar-check-o" />{" "}
                <span>Doctor Schedule</span>
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
          </ul>
        </div>
      </div>
    </div>
  );
};
export default sidebar;
