import Header from "../layouts/header";
import Sidebar from "../layouts/sidebar";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.scss";

const AddCompanies = () => {
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("student");
  const [msg, setMsg] = useState();

  const handleAddUser = async () => {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", confirmPassword);
    formData.append("phone", phone);
    formData.append("role", role);
    formData.append("gender", gender);
    formData.append("address", "None");
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/add-user",
        requestOptions
      );
      const responseJSON = await response.json();
      console.log(responseJSON);
      if (responseJSON.status === "success") {
        history.push("/admin/users");
      }
      if (responseJSON.status === "error") {
        setMsg(responseJSON.validation_errors);
      }
    } catch (error) {
      console.log("Failed fetch add new user", error.message);
    }
  };

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-sm-12">
              <h4 className="page-title">Add new user</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <form>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        onChange={(e) => setFirstName(e.target.value)}
                        className="form-control"
                        type="text"
                      />
                      {msg ? (
                        <p className="text-danger">{msg.first_name}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>
                        Last Name <span className="text-danger">*</span>
                      </label>
                      <input
                        onChange={(e) => setLastName(e.target.value)}
                        className="form-control"
                        type="text"
                      />
                      {msg ? (
                        <p className="text-danger">{msg.last_name}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        type="email"
                      />
                      {msg ? <p className="text-danger">{msg.email}</p> : null}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        type="password"
                      />
                      {msg ? (
                        <p className="text-danger">{msg.password}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Confirm Password</label>
                      <input
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-control"
                        type="password"
                      />
                      {confirmPassword !== password || "" ? (
                        <p className="text-danger">
                          Confirm password does not match
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group gender-select">
                      <label className="gen-label">Gender:</label>
                      <div className="form-check-inline">
                        <label className="form-check-label">
                          <input
                            value="Male"
                            type="radio"
                            name="gender"
                            className="form-check-input"
                            onChange={(e) => {
                              const { value } = e.target;
                              setGender(value);
                            }}
                          />
                          Male
                        </label>
                      </div>
                      <div className="form-check-inline">
                        <label className="form-check-label">
                          <input
                            value="Female"
                            type="radio"
                            name="gender"
                            className="form-check-input"
                            onChange={(e) => {
                              const { value } = e.target;
                              setGender(value);
                            }}
                          />
                          Female
                        </label>
                      </div>
                      {msg ? <p className="text-danger">{msg.gender}</p> : null}
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="row">
                      <div className="col-sm-6 col-md-6 col-lg-3">
                        <div className="form-group">
                          <label>Role</label>
                          <select
                            className="form-control select"
                            onChange={(e) => {
                              setRole(e.target.value);
                            }}
                          >
                            <option>student</option>
                            <option>company</option>
                            <option>admin</option>
                          </select>
                        </div>
                        {msg ? <p className="text-danger">{msg.role}</p> : null}
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Phone </label>
                      <input
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-control"
                        type="number"
                      />
                      {msg ? <p className="text-danger">{msg.phone}</p> : null}
                    </div>
                  </div>
                </div>
              </form>
              <div className="m-t-20 text-center">
                <button className="btn btn-primary" onClick={handleAddUser}>
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCompanies;
