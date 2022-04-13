import { useEffect, useState } from "react";
import Header from "../layouts/header";
import Sidebar from "../layouts/sidebar";
import "./style.css";
import { Image, Modal, notification, Space, Card } from "antd";

const openNotificationWithIcon = (type, text) => {
  notification[type]({
    message: "Success!",
    description: text,
    top: 80,
  });
};

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleReject, setIsModalVisibleReject] = useState(false);
  const [tmpRequest, setTmpRequest] = useState({
    user: {
      image: "",
    },
    subject: {
      name: "",
    },
  });

  const getRequests = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        "https://knowx-be.herokuapp.com/api/user/request/mentor",
        requestOptions
      );
      const responseJSON = await response.json();
      setRequests(responseJSON.data);
    } catch (error) {
      console.log("Failed fetch", error.message);
    }
  };

  const handleReject = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        `https://knowx-be.herokuapp.com/api/user/request/mentor/reject/${tmpRequest.id}`,
        requestOptions
      );
      const responseJSON = await response.json();
      if (responseJSON.status === "success") {
        openNotificationWithIcon("success", "Rejected request!");
        getRequests();
      }
    } catch (error) {
      console.log("Failed fetch", error.message);
    }
  };

  const handleAccept = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        `https://knowx-be.herokuapp.com/api/user/request/mentor/accept/${tmpRequest.id}`,
        requestOptions
      );
      const responseJSON = await response.json();
      console.log(responseJSON);
      if (responseJSON.status === "success") {
        openNotificationWithIcon(
          "success",
          `Accepted request. ${tmpRequest.user.full_name} become mentor!`
        );
        getRequests();
      }
    } catch (error) {
      console.log("Failed fetch", error.message);
    }
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
    getRequests();
  }, []);

  const showModal = (e) => {
    setIsModalVisible(true);
    setTmpRequest(e);
  };

  const showModalReject = (e) => {
    setIsModalVisibleReject(true);
    setTmpRequest(e);
  };

  const handleOk = () => {
    handleAccept();
    setIsModalVisible(false);
  };

  const handleOkReject = () => {
    handleReject();
    setIsModalVisibleReject(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCancelReject = () => {
    setIsModalVisibleReject(false);
  };
  return (
    <div className="main-wrapper">
      <Modal
        title="Request detail"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Accept"
        width={810}
      >
        <div style={{ display: "flex", marginBottom: "20px" }}>
          <img
            width="28"
            height="28"
            className="rounded-circle"
            src={`https://knowx-be.herokuapp.com/${tmpRequest.user.image}`}
            alt=""
          />
          <a
            className="name"
            href={`/admin/user/${tmpRequest.user.id}`}
            style={{ color: "black" }}
          >
            {tmpRequest.user.full_name}
          </a>
        </div>
        <Space>
          <Card
            title="User Information"
            style={{ height: "306px", width: "220px" }}
          >
            <b>Posts:</b>
            <span className="ml-3">{tmpRequest.countPosts}</span>
            <br />
            <b>Questions:</b>
            <span className="ml-3">{tmpRequest.countQuestions}</span>
            <br />
            <b>Class mentoring:</b>
            <span className="ml-3">{tmpRequest.countClass}</span>
            <br />
            <b>Followers:</b>
            <span className="ml-3">{tmpRequest.followers}</span>
          </Card>
          <Card title="Request infomation">
            <Space>
              <div>
                <b>Subject: </b>
                <p>{tmpRequest.subject.name}</p>
                <b>Description: </b>
                <p>{tmpRequest.description}</p>
              </div>
              <Image
                height={200}
                src={`https://knowx-be.herokuapp.com/${tmpRequest.user.image}`}
              />
            </Space>
          </Card>
        </Space>
      </Modal>
      <Modal
        title="Confirm"
        visible={isModalVisibleReject}
        onOk={handleOkReject}
        onCancel={handleCancelReject}
        okText="Reject"
      >
        <p>Do you want reject this request?</p>
      </Modal>
      <Header />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content">
          <div className="row" style={{ marginLeft: "3px" }}>
            <div className="col-sm-4 col-3">
              <h4 className="page-title">Requests</h4>
            </div>
          </div>
          <div className="col-12">
            <div className="card">
              <div className="card-block">
                <div className="table-responsive">
                  <table className="table mb-0 new-patient-table posts">
                    <thead>
                      <tr>
                        <th scope="col">User</th>
                        <th scope="col">Description</th>
                        <th scope="col">Date</th>
                        <th scope="col">Subject</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((e) => (
                        <tr>
                          <th scope="row">
                            <img
                              width="28"
                              height="28"
                              className="rounded-circle"
                              src={`https://knowx-be.herokuapp.com/${e.user.image}`}
                              alt=""
                            />
                            <a
                              className="name"
                              href={`/admin/user/${e.user.id}`}
                              style={{ color: "black" }}
                            >
                              {e.user.full_name}
                            </a>
                          </th>
                          <td style={{ width: " 250px" }}>{e.description}</td>
                          <td style={{ width: " 150px" }}>
                            {formatDate(e.created_at)}
                          </td>
                          <td style={{ width: " 300px" }}>{e.subject.name}</td>
                          <td style={{ width: " 250px" }}>
                            <button
                              className="btn btn-primary btn-primary-one float-right"
                              onClick={() => showModal(e)}
                            >
                              View Detail
                            </button>
                            <button
                              className="btn btn-primary btn-primary-two float-left"
                              onClick={() => showModalReject(e)}
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
        </div>
      </div>
    </div>
  );
};

export default Request;
