import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Header from "../layouts/header";
import Sidebar from "../layouts/sidebar";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.scss";

const Users = () => {
  const [students, setStudents] = useState([]);
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

  const handleDelete = async (row) => {
    console.log(row.id);
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/delete-user/${row.id}`,
        requestOptions
      );
      const responseJSON = await response.json();
      getData();
    } catch (error) {
      console.log("Failed fetch delete user", error.message);
    }
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
              Student & Mentor
            </Button>
          ) : row.role === "admin" ? (
            <Button size="sm" variant="info">Admin</Button>
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
        <>
          <Button variant="warning" size="sm">
            Lock
          </Button>
          <Button
            variant="danger"
            size="sm"
            style={{ marginLeft: "10px", marginRight: "10px" }}
            onClick={() => handleDelete(row)}
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            size="sm"
            // style={{ marginLeft: "20px" }}
            onClick={() => history.push(`/admin/user/${row.id}`)}
          >
            View
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="main-wrapper">
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
