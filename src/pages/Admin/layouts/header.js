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
  const handleLogout = () => {
    const token = sessionStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    fetch("https://knowx-be.herokuapp.com/api/user/logout", requestOptions)
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
        <li className="nav-item dropdown d-none d-sm-block">
          <a
            href="#"
            className="dropdown-toggle nav-link"
            data-toggle="dropdown"
          >
            <i className="fa fa-bell-o" />{" "}
            <span className="badge badge-pill bg-danger float-right">3</span>
          </a>
          <div className="dropdown-menu notifications">
            <div className="topnav-dropdown-header">
              <span>Notifications</span>
            </div>
            <div className="drop-scroll">
              <ul className="notification-list">
                <li className="notification-message">
                  <a href="activities.html">
                    <div className="media">
                      <span className="avatar">
                        <img
                          alt="John Doe"
                          src="assets/img/user.jpg"
                          className="img-fluid rounded-circle"
                        />
                      </span>
                      <div className="media-body">
                        <p className="noti-details">
                          <span className="noti-title">John Doe</span> added new
                          task{" "}
                          <span className="noti-title">
                            Patient appointment booking
                          </span>
                        </p>
                        <p className="noti-time">
                          <span className="notification-time">4 mins ago</span>
                        </p>
                      </div>
                    </div>
                  </a>
                </li>
                <li className="notification-message">
                  <a href="activities.html">
                    <div className="media">
                      <span className="avatar">V</span>
                      <div className="media-body">
                        <p className="noti-details">
                          <span className="noti-title">Tarah Shropshire</span>{" "}
                          changed the task name{" "}
                          <span className="noti-title">
                            Appointment booking with payment gateway
                          </span>
                        </p>
                        <p className="noti-time">
                          <span className="notification-time">6 mins ago</span>
                        </p>
                      </div>
                    </div>
                  </a>
                </li>
                <li className="notification-message">
                  <a href="activities.html">
                    <div className="media">
                      <span className="avatar">L</span>
                      <div className="media-body">
                        <p className="noti-details">
                          <span className="noti-title">Misty Tison</span> added{" "}
                          <span className="noti-title">Domenic Houston</span>{" "}
                          and <span className="noti-title">Claire Mapes</span>{" "}
                          to project{" "}
                          <span className="noti-title">
                            Doctor available module
                          </span>
                        </p>
                        <p className="noti-time">
                          <span className="notification-time">8 mins ago</span>
                        </p>
                      </div>
                    </div>
                  </a>
                </li>
                <li className="notification-message">
                  <a href="activities.html">
                    <div className="media">
                      <span className="avatar">G</span>
                      <div className="media-body">
                        <p className="noti-details">
                          <span className="noti-title">Rolland Webber</span>{" "}
                          completed task{" "}
                          <span className="noti-title">
                            Patient and Doctor video conferencing
                          </span>
                        </p>
                        <p className="noti-time">
                          <span className="notification-time">12 mins ago</span>
                        </p>
                      </div>
                    </div>
                  </a>
                </li>
                <li className="notification-message">
                  <a href="activities.html">
                    <div className="media">
                      <span className="avatar">V</span>
                      <div className="media-body">
                        <p className="noti-details">
                          <span className="noti-title">Bernardo Galaviz</span>{" "}
                          added new task{" "}
                          <span className="noti-title">
                            Private chat module
                          </span>
                        </p>
                        <p className="noti-time">
                          <span className="notification-time">2 days ago</span>
                        </p>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
            <div className="topnav-dropdown-footer">
              <a href="activities.html">View all Notifications</a>
            </div>
          </div>
        </li>
        <li className="nav-item dropdown d-none d-sm-block">
          <a
            href="javascript:void(0);"
            id="open_msg_box"
            className="hasnotifications nav-link"
          >
            <i className="fa fa-comment-o" />{" "}
            <span className="badge badge-pill bg-danger float-right">8</span>
          </a>
        </li>
        <li className="nav-item dropdown has-arrow">
          <a
            href="#"
            className="dropdown-toggle nav-link user-link"
            data-toggle="dropdown"
          >
            <span className="user-img">
              <img
                className="rounded-circle"
                src={`https://knowx-be.herokuapp.com/${avatar}`}
                width="40"
                alt="Admin"
              />
              <span className="status online" />
            </span>
            <span>Admin</span>
          </a>
          <div className="dropdown-menu">
            <a className="dropdown-item" href="profile.html">
              My Profile
            </a>
            <a className="dropdown-item" href="edit-profile.html">
              Edit Profile
            </a>
            <a className="dropdown-item" href="settings.html">
              Settings
            </a>
            <p
              className="dropdown-item"
              style={{ cursor: "pointer" }}
              onClick={handleLogout}
            >
              Logout
            </p>
          </div>
        </li>
      </ul>
      <div className="dropdown mobile-user-menu float-right">
        <a
          href="#"
          className="nav-link dropdown-toggle"
          data-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fa fa-ellipsis-v" />
        </a>
        <div className="dropdown-menu dropdown-menu-right">
          <a className="dropdown-item" href="profile.html">
            My Profile
          </a>
          <a className="dropdown-item" href="edit-profile.html">
            Edit Profile
          </a>
          <a className="dropdown-item" href="settings.html">
            Settings
          </a>
          <a className="dropdown-item" href="login.html">
            Logout
          </a>
        </div>
      </div>
    </div>
  );
};

export default header;