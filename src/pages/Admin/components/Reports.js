import { Menu, message, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Header from "../layouts/header";
import Sidebar from "../layouts/sidebar";
import "./styles.scss";

const openNotificationWithIcon = (type) => {
  notification[type]({
    message: "Success!",
    description: "Report deleted!",
    top: 80,
  });
};

const AddCompanies = () => {
  const history = useHistory();
  const [reportPosts, setReportPosts] = useState([]);
  const [reportQuestions, setReportQuestions] = useState([]);
  const [countPostReports, setCountPostReports] = useState([]);
  const [countQuestionReports, setCountQuestionReports] = useState([]);
  const [key, setKey] = useState("post");
  const [modalText, setModalText] = useState("Accept delete this report?");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmLoadingQuestion, setConfirmLoadingQuestion] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleQuestion, setVisibleQuestion] = useState(false);
  const [postId, setPostId] = useState("");
  const [questionId, setQuestionId] = useState("");
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
        "https://knowx-be.herokuapp.com/api/user/posts/reports/get",
        requestOptions
      );
      const responseJSON = await response.json();
      setReportPosts(responseJSON.reports);
      setCountPostReports(responseJSON.count);
    } catch (error) {
      console.log("Failed fetch", error.message);
    }
  };

  const getQuestionReports = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        "https://knowx-be.herokuapp.com/api/user/questions/reports/get",
        requestOptions
      );
      const responseJSON = await response.json();
      setReportQuestions(responseJSON.reports);
      setCountQuestionReports(responseJSON.count);
    } catch (error) {
      console.log("Failed fetch", error.message);
    }
  };

  const rejectReportPost = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    setTimeout(async () => {
      try {
        const response = await fetch(
          `https://knowx-be.herokuapp.com/api/user/posts/report/${postId}`,
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          openNotificationWithIcon("success");
          getPostReports();
        }
      } catch (error) {
        console.log("Failed fetch: ", error.message);
      }
    }, 2000);
  };

  const rejectReportQuestion = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    setTimeout(async () => {
      try {
        const response = await fetch(
          `https://knowx-be.herokuapp.com/api/user/questions/report/${questionId}`,
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          openNotificationWithIcon("success");
          getQuestionReports();
        }
      } catch (error) {
        console.log("Failed fetch: ", error.message);
      }
    }, 2000);
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
    getPostReports();
    getQuestionReports();
  }, []);

  const handleOk = () => {
    rejectReportPost();
    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const showModal = (id) => {
    setPostId(id);
    setVisible(true);
  };

  const handleOkQuestion = () => {
    rejectReportQuestion();
    setConfirmLoadingQuestion(true);
    setTimeout(() => {
      setVisibleQuestion(false);
      setConfirmLoadingQuestion(false);
    }, 2000);
  };

  const handleCancelQuestion = () => {
    setVisibleQuestion(false);
  };

  const showModalQuestion = (id) => {
    setQuestionId(id);
    setVisibleQuestion(true);
  };

  const PostReports = (
    <div className="col-12">
      <div className="card">
        <div className="card-block">
          <div className="table-responsive">
            <table className="table mb-0 new-patient-table posts">
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
                      <b className="name">{e.post_id}</b>
                    </th>
                    <td>{e.description}</td>
                    <td style={{ width: " 250px" }}>
                      {formatDate(e.updated_at)}
                    </td>
                    <td style={{ width: " 250px" }}>
                      <button
                        className="btn btn-primary btn-primary-two float-left"
                        style={{ marginRight: "20px" }}
                        onClick={() => showModal(e.id)}
                      >
                        Reject
                      </button>
                      <button
                        className="btn btn-primary btn-primary-one float-right"
                        onClick={() => history.push(`/admin/post/${e.post_id}`)}
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

  const QuestionReports = (
    <div className="col-12">
      <div className="card">
        <div className="card-block">
          <div className="table-responsive">
            <table className="table mb-0 new-patient-table posts">
              <thead>
                <tr>
                  <th scope="col">Question ID</th>
                  <th scope="col">Description</th>
                  <th scope="col">Date</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {reportQuestions.map((e) => (
                  <tr>
                    <th scope="row">
                      <b className="name">{e.question_id}</b>
                    </th>
                    <td>{e.description}</td>
                    <td style={{ width: " 250px" }}>
                      {formatDate(e.updated_at)}
                    </td>
                    <td style={{ width: " 250px" }}>
                      <button
                        className="btn btn-primary btn-primary-two float-left"
                        style={{ marginRight: "20px" }}
                        onClick={() => showModalQuestion(e.id)}
                      >
                        Reject
                      </button>
                      <button
                        className="btn btn-primary btn-primary-one float-right"
                        onClick={() =>
                          history.push(`/admin/question/${e.question_id}`)
                        }
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
      <Modal
        title="Confirm"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
      <Modal
        title="Confirm"
        visible={visibleQuestion}
        onOk={handleOkQuestion}
        confirmLoading={confirmLoadingQuestion}
        onCancel={handleCancelQuestion}
      >
        <p>{modalText}</p>
      </Modal>
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
              <Menu.Item key="question">
                Questions ({countQuestionReports})
              </Menu.Item>
            </Menu>
            <div className="tab-content">
              {key === "post" ? PostReports : QuestionReports}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCompanies;
