import { useEffect, useState } from "react";
import Header from "../layouts/header";
import Sidebar from "../layouts/sidebar";
import "./style.css";
import { Image, Modal, notification } from "antd";

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

  useEffect(() => {
    getRequests();
  }, []);

  const formatDate = (timestams) => {
    const options = {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(timestams).toLocaleDateString(undefined, options);
  };

  const showModal = (e) => {
    setTmpRequest(e);
    setIsModalVisible(true);
  };

  const showModalReject = (e) => {
    setTmpRequest(e);
    setIsModalVisibleReject(true);
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
      >
        <div style={{ display: "flex", marginBottom: "20px" }}>
          <img
            width="28"
            height="28"
            class="rounded-circle"
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
        <b>Subject: </b>
        <p>{tmpRequest.subject.name}</p>
        <b>Description: </b>
        <p>{tmpRequest.description}</p>
        <Image
          width={470}
          src={`https://knowx-be.herokuapp.com/${tmpRequest.user.image}`}
        />
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
                              class="rounded-circle"
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
