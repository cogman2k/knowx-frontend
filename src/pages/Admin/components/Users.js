import { Modal, notification } from "antd";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useHistory } from "react-router-dom";
import Header from "../layouts/header";
import Sidebar from "../layouts/sidebar";
import "./styles.scss";

const openNotificationWithIcon = (type) => {
  notification[type]({
    message: "Success!",
    description: "Deleted this user!",
    top: 80,
  });
};

const Users = () => {
  const [students, setStudents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeUser, setActiveUser] = useState({});
  const history = useHistory();
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/users",
        requestOptions
      );
      const responseJSON = await response.json();
      if (responseJSON.status === "success") {
        setStudents(responseJSON.data);
      }
    } catch (error) {
      console.log("Failed fetch get all students", error.message);
    }
  };

  const handleDelete = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/delete-user/${activeUser.id}`,
        requestOptions
      );
      const responseJSON = await response.json();
      if (responseJSON.status === "success") {
        openNotificationWithIcon("success");
        getData();
      }
    } catch (error) {
      console.log("Failed fetch delete user", error.message);
    }
  };

  const showModal = (row) => {
    console.log(row);
    setActiveUser(row);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleDelete();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      dataField: "id",
      text: "ID",
      sort: true,
      headerStyle: (colum, colIndex) => ({
        width: "50px",
        textAlign: "center",
      }),
      onClick: (cell, row, rowIndex, formatExtraData) => {
        alert("asdas");
      },
    },
    {
      dataField: "first_name",
      text: "First Name",
      sort: true,
    },
    {
      dataField: "last_name",
      text: "Last Name",
      sort: true,
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
      headerStyle: (colum, colIndex) => ({
        width: "200px",
        textAlign: "center",
      }),
    },
    {
      dataField: "roles",
      text: "Roles",
      headerStyle: (colum, colIndex) => ({
        width: "150px",
        textAlign: "center",
      }),
      formatter: (cell, row, rowIndex, formatExtraData) => (
        <div style={{ width: "200px", display: "flex" }}>
          {row.isMentor ? (
            <Button variant="success" size="sm">
              Mentor
            </Button>
          ) : row.role === "admin" ? (
            <Button size="sm" variant="info">
              Admin
            </Button>
          ) : (
            <Button size="sm">Student</Button>
          )}
        </div>
      ),
      sort: true,
    },
    {
      dataField: "phone",
      text: "Phone",
      sort: true,
    },
    {
      dataField: "gender",
      text: "Gender",
      sort: true,
    },
    {
      dataField: "birthday",
      text: "DOB",
      sort: true,
    },
    {
      dataField: "Action",
      text: "Action",
      sort: true,
      headerStyle: (colum, colIndex) => ({
        width: "200px",
        textAlign: "center",
      }),
      formatter: (cell, row, rowIndex, formatExtraData) => (
        <div style={{display: "flex", justifyContent: "center"}}>
          <Button
            variant="danger"
            size="sm"
            style={{ marginLeft: "10px", marginRight: "10px" }}
            onClick={() => showModal(row)}
          >
            <i className="fa-solid fa-trash-can mr-10"></i>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            // style={{ marginLeft: "20px" }}
            onClick={() => history.push(`/admin/user/${row.id}`)}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="main-wrapper">
      <Modal
        title="Confirm"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        Accept delete this user?
      </Modal>
      <Header />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-sm-12">
              <h4 className="page-title">Students</h4>
            </div>
            <div className="text-right m-b-20">
              <a
                href="/admin/users/new"
                className="btn btn btn-primary btn-rounded float-right"
              >
                <i className="fa fa-plus"></i> Add User
              </a>
            </div>
          </div>
          <BootstrapTable
            bootstrap4
            keyField="id"
            data={students}
            columns={columns}
            pagination={paginationFactory({ sizePerPage: 10 })}
          />
        </div>
      </div>
    </div>
  );
};

export default Users;
