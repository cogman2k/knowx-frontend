import "../assets/css/bootstrap.min.css";
import "../assets/css/dataTables.bootstrap4.min.css";
import "../assets/css/fullcalendar.min.css";
import "../assets/css/select2.min.css";
import "../assets/css/style.css";
import "../assets/css/tagsinput.css";
import logo from "../assets/img/KnowX_logo.png";
import "./styles.scss";

const header = () => {
  const avatar = sessionStorage.getItem("avatar");

  return (
    <div className="header">
      <div className="header-left">
        <a href="/admin" className="logo">
          <img src={logo} height="60" alt="" />{" "}
          <span className="mt-2">ADMIN</span>
        </a>
      </div>
      <a id="toggle_btn" href="javascript:void(0);">
        <i className="fa fa-bars" />
      </a>
      <a id="mobile_btn" className="mobile_btn float-left" href="#sidebar">
        <i className="fa fa-bars" />
      </a>
      <ul className="nav user-menu float-right">
        <li className="nav-item dropdown">
          <a
            href="#"
            className="dropdown-toggle nav-link user-link"
            data-toggle="dropdown"
          >
            <span className="user-img">
              <img
                className="rounded-circle"
                src={`http://127.0.0.1:8000/${avatar}`}
                width="40"
                alt="Admin"
              />
              <span className="status online" />
            </span>
            <span>{sessionStorage.getItem("full_name")}</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default header;
