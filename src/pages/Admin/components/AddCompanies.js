import Header from "../layouts/header";
import Sidebar from "../layouts/sidebar";
import { notification } from "antd";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.scss";
import "./style.css";

const openNotificationWithIcon = (type) => {
  notification[type]({
    message: "Success!",
    description: "Added new account!",
    top: 80,
  });
};

const AddCompanies = () => {
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("null");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("company");
  const [image, setImage] = useState("");
  const [msg, setMsg] = useState();

  const handleAddUser = async () => {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", firstName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", confirmPassword);
    formData.append("phone", phone);
    formData.append("role", role);
    formData.append("gender", gender);
    formData.append("address", address);
    formData.append("image", image);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        "https://knowx-be.herokuapp.com/api/admin/add-user",
        requestOptions
      );
      const responseJSON = await response.json();
      console.log(responseJSON);
      if (responseJSON.status === "success") {
        openNotificationWithIcon("success");
        history.push("/admin/companies");
      }
      if (responseJSON.status === "error") {
        setMsg(responseJSON.validation_errors);
      }
    } catch (error) {
      console.log("Failed fetch add new user", error.message);
    }
  };

  const handlePreview = (e) => {
    setImage(e.target.files[0]);
    const file = e.target.files[0];
    blah.src = URL.createObjectURL(file);
  };

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-sm-12">
              <h4 className="page-title">Add new companie</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <form>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>
                        Company name <span className="text-danger">*</span>
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
                        Address <span className="text-danger">*</span>
                      </label>
                      <input
                        onChange={(e) => setAddress(e.target.value)}
                        className="form-control"
                        type="text"
                      />
                      {msg ? (
                        <p className="text-danger">{msg.address}</p>
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
                    <div className="form-group">
                      <label>Avatar</label>
                      <div className="profile-upload">
                        <div className="upload-img">
                          <img alt="" id="blah" src="assets/img/user.jpg" />
                        </div>
                        <div className="upload-input">
                          <input
                            type="file"
                            className="form-control"
                            onChange={handlePreview}
                          />
                        </div>
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
