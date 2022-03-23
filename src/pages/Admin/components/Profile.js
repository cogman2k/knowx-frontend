import { Menu } from "antd";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Header from "../layouts/header";
import Sidebar from "../layouts/sidebar";
import "./styles.scss";

const Profile = () => {
  const location = useLocation();
  const arr = location.pathname.split("/");
  const selectedId = arr[arr.length - 1];
  const history = useHistory();
  const [data, setData] = useState({});
  const [key, setKey] = useState("about");
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [posts, setPosts] = useState([]);
  const [questions, setQuestions] = useState([]);

  const getData = async () => {
    const formData = new FormData();
    formData.append("id", selectedId);
    const requestOptions = {
      method: "POST",
      body: formData,
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/get-by-id`,
        requestOptions
      );
      const responseJSON = await response.json();
      if (responseJSON.status === "success") {
        setData(responseJSON.data);
      }
    } catch (error) {
      console.log("Faild fetch this user : ", error.message);
    }
  };

  const getEducation = async () => {
    console.log(selectedId);
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/education/${selectedId}`,
        requestOptions
      );
      const responseJSON = await response.json();
      console.log(responseJSON);
      if (responseJSON.status === "success") {
        setEducation(responseJSON.data);
      }
    } catch (error) {
      console.log("Failed fetch get educations", error.message);
    }
  };

  const getExperience = async () => {
    console.log(selectedId);
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/experience/${selectedId}`,
        requestOptions
      );
      const responseJSON = await response.json();
      if (responseJSON.status === "success") {
        setExperience(responseJSON.data);
      }
    } catch (error) {
      console.log("Failed fetch get experience", error.message);
    }
  };

  const getPostData = async () => {
    const token = sessionStorage.getItem("token");
    const fm = new FormData();
    fm.append("user_id", selectedId);
    const requestOptions = {
      method: "POST",
      body: fm,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/posts/getbyuserid",
        requestOptions
      );
      const responseJSON = await response.json();
      console.log(responseJSON);
      if (responseJSON.status === "success") {
        setPosts(responseJSON.data);
      }
    } catch (error) {
      console.log("Failed fetch list Posts", error.message);
    }
  };

  const getQuestionData = async () => {
    const token = sessionStorage.getItem("token");
    const fm = new FormData();
    fm.append("user_id", selectedId);
    const requestOptions = {
      method: "POST",
      body: fm,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/questions/getbyuserid",
        requestOptions
      );
      const responseJSON = await response.json();
      if (responseJSON.status === "success") {
        setQuestions(responseJSON.data);
      }
    } catch (error) {
      console.log("Failed fetch list questions", error.message);
    }
  };

  const handleClick = (e) => {
    setKey(e.key);
  };

  const formatDate = (timestams) => {
    const options = {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(timestams).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    getData();
    getEducation();
    getExperience();
    getPostData();
    getQuestionData();
  }, []);

  const About = (
    <div class="tab-pane show active" id="about-cont">
      <div class="row">
        <div class="col-md-12">
          <div class="card-box">
            <h3 class="card-title">Education Informations</h3>
            <div class="experience-box">
              <ul class="experience-list">
                {education.map((e) => (
                  <li>
                    <div class="experience-user">
                      <div class="before-circle"></div>
                    </div>
                    <div class="experience-content">
                      <div class="timeline-content">
                        <a href="#/" class="name">
                          {e.title}
                        </a>
                        <span class="time">
                          {e.start_date} - {e.end_date}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div class="card-box mb-0">
            <h3 class="card-title">Experience</h3>
            <div class="experience-box">
              <ul class="experience-list">
                {experience.map((e) => (
                  <li>
                    <div class="experience-user">
                      <div class="before-circle"></div>
                    </div>
                    <div class="experience-content">
                      <div class="timeline-content">
                        <a href="#/" class="name">
                          {e.title}
                        </a>
                        <span class="time">
                          {e.start_date} - {e.end_date}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Posts = (
    <div class="col-12">
      <div class="card">
        <div class="card-block">
          <div class="table-responsive">
            <table class="table mb-0 new-patient-table posts">
              <tbody>
                {posts.map((e) => (
                  <tr>
                    <td>
                      <b class="name">{e.title}</b>
                    </td>
                    <td>{e.hashtag}</td>
                    <td>{formatDate(e.updated_at)}</td>
                    <td>
                      <button
                        class="btn btn-primary btn-primary-one float-right"
                        onClick={() => history.push(`/admin/post/${e.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const Questions = (
    <div class="col-12">
      <div class="card">
        <div class="card-block">
          <div class="table-responsive">
            <table class="table mb-0 new-patient-table posts">
              <tbody>
                {questions.map((e) => (
                  <tr>
                    <td>
                      <b class="name">{e.id}</b>
                    </td>
                    <td>
                      <b class="name">{e.title}</b>
                    </td>
                    <td>{e.hashtag}</td>
                    <td>{formatDate(e.updated_at)}</td>
                    <td>
                      <button
                        class="btn btn-primary btn-primary-one float-right"
                        onClick={() => history.push(`/admin/question/${e.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content">
          <div className="card-box profile-header">
            <div className="row">
              <div className="col-md-12">
                <div className="profile-view">
                  <div className="profile-img-wrap">
                    <div className="profile-img">
                      <a href="#">
                        <img
                          className="avatar"
                          src={`http://127.0.0.1:8000/${data.image}`}
                          alt=""
                        />
                      </a>
                    </div>
                  </div>
                  <div className="profile-basic">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="profile-info-left">
                          <h3
                            className="user-name m-t-0 mb-0"
                            style={{ fontFamily: "Helvetica", fontWeight: "bold" }}
                          >
                            {data.full_name}
                          </h3>
                          <small className="text-muted">{data.role}</small>
                          <div className="staff-id">User ID : {data.id}</div>
                          <div className="staff-msg">
                            <a href="chat.html" className="btn btn-primary">
                              Send Message
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-7">
                        <ul className="personal-info">
                          <li>
                            <span className="title">Phone:</span>
                            <span className="text">
                              <a href="#">{data.phone}</a>
                            </span>
                          </li>
                          <li>
                            <span className="title">Email:</span>
                            <span className="text">
                              <a href="#">{data.email}</a>
                            </span>
                          </li>
                          {data.role === "company" ? (
                            <>
                              <li>
                                <span className="title">Address:</span>
                                <span className="text">{data.address}</span>
                              </li>
                            </>
                          ) : (
                            <>
                              <li>
                                <span className="title">Birthday:</span>
                                <span className="text">{data.birthday}</span>
                              </li>
                              <li>
                                <span className="title">Topic:</span>
                                <span className="text">{data.topic}</span>
                              </li>
                              <li>
                                <span className="title">Gender:</span>
                                <span className="text">{data.gender}</span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="profile-tabs">
            <Menu
              mode="horizontal"
              style={{ fontSize: "14px", fontWeight: "600" }}
              onClick={handleClick}
              selectedKeys={key}
            >
              <Menu.Item key="about">ABOUT</Menu.Item>
              <Menu.Item key="posts">POSTS</Menu.Item>
              <Menu.Item key="questions">QUESTIONS</Menu.Item>
            </Menu>
            <div class="tab-content">
              {key === "about" ? About : key === "posts" ? Posts : Questions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
