import { useState, useEffect } from "react";
import Header from "../layouts/header";
import Sidebar from "../layouts/sidebar";
import "./styles.scss";

const Companies = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
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
          "http://127.0.0.1:8000/api/admin/companies",
          requestOptions
        );
        const responseJSON = await response.json();
        console.log(responseJSON);
        if (responseJSON.status === "success") {
          setCompanies(responseJSON.data);
        }
      } catch (error) {
        console.log("Failed fetch get all students", error.message);
      }
    };
    getData();
  }, []);

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-sm-4 col-3">
              <h4 className="page-title">Companies</h4>
            </div>
            <div className="col-sm-8 col-9 text-right m-b-20">
              <a
                href="/admin/companies/new"
                className="btn btn-primary btn-rounded float-right"
              >
                <i className="fa fa-plus"></i> Add company
              </a>
            </div>
          </div>
          <div className="row doctor-grid">
            {companies.map((company) => (
              <div className="col-md-4 col-sm-4  col-lg-3" key={company.id}>
                <div className="profile-widget">
                  <div className="doctor-img">
                    <a className="avatar" href={`/admin/user/${company.id}`}>
                      <img alt="" src={`http://127.0.0.1:8000/${company.image}`} />
                    </a>
                  </div>
                  <div className="dropdown profile-action">
                    <a
                      href="#"
                      className="action-icon dropdown-toggle"
                      data-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fa fa-ellipsis-v"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a className="dropdown-item" href="edit-doctor.html">
                        <i className="fa fa-pencil m-r-5"></i> Edit
                      </a>
                      <a
                        className="dropdown-item"
                        href="#"
                        data-toggle="modal"
                        data-target="#delete_doctor"
                      >
                        <i className="fa fa-trash-o m-r-5"></i> Delete
                      </a>
                    </div>
                  </div>
                  <h4 className="doctor-name text-ellipsis">
                    <a href="profile.html">{company.full_name}</a>
                  </h4>
                  <div className="doc-prof">{company.email}</div>
                  <div className="user-country">
                    <i className="fa fa-map-marker"></i> {company.address}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;
