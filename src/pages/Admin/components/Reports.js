import Header from "../layouts/header";
import Sidebar from "../layouts/sidebar";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, badge } from "antd";
import "./styles.scss";

const AddCompanies = () => {
  const history = useHistory();
  const [reportPosts, setReportPosts] = useState([]);
  const [reportQuestions, setReportQuestions] = useState([]);
  const [countPostReports, setCountPostReports] = useState([]);
  const [key, setKey] = useState("post");

  const questions = <div>questions</div>;
  const users = <div>users</div>;

  const handleClick = (e) => {
    setKey(e.key);
  };

  const getPostReports = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/posts/reports/get",
        requestOptions
      );
      const responseJSON = await response.json();
      setReportPosts(responseJSON.reports);
      setCountPostReports(responseJSON.count);
    } catch (error) {
      console.log("Failed fetch", error.message);
    }
  };

  const rejectReport = async () => {};

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
    getPostReports();
  }, []);

  const PostReports = (
    <div class="col-12">
      <div class="card">
        <div class="card-block">
          <div class="table-responsive">
            <table class="table mb-0 new-patient-table posts">
              <thead>
                <tr>
                  <th scope="col">Post ID</th>
                  <th scope="col">Description</th>
                  <th scope="col">Date</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {reportPosts.map((e) => (
                  <tr>
                    <th scope="row">
                      <b class="name">{e.post_id}</b>
                    </th>
                    <td>{e.description}</td>
                    <td style={{ width: " 250px" }}>
                      {formatDate(e.updated_at)}
                    </td>
                    <td style={{ width: " 250px" }}>
                      <button
                        class="btn btn-primary btn-primary-one float-right"
                        onClick={() => history.push(`/admin/post/${e.post_id}`)}
                      >
                        View
                      </button>
                      <button
                        class="btn btn-secondary btn-secondary-one float-left"
                        onClick={rejectReport}
                      >
                        Reject
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
          <div className="profile-tabs">
            <Menu
              mode="horizontal"
              style={{ fontSize: "14px", fontWeight: "600" }}
              onClick={handleClick}
              selectedKeys={key}
            >
              <Menu.Item key="post">Posts ({countPostReports}) </Menu.Item>
              <Menu.Item key="question">Questions</Menu.Item>
              <Menu.Item key="user">Users</Menu.Item>
            </Menu>
            <div class="tab-content">
              {key === "post"
                ? PostReports
                : key === "question"
                ? questions
                : users}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCompanies;
