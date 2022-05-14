import { Form, Image, notification, Timeline } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const openNotificationWithIcon = (type, msg) => {
  notification[type]({
    message: "Success!",
    description: msg,
    top: 80,
  });
};

const About = () => {
  const location = useLocation();
  const arr = location.pathname.split("/");
  const id = arr[arr.length - 1];
  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };
  const [listEducation, setListEducation] = useState([]);
  const [listExperience, setListExperience] = useState([]);
  const [listArchives, setListArchives] = useState([]);

  // handle get list education
  const getEducation = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `https://knowx-be.herokuapp.com/api/user/education/${id}`,
        requestOptions
      );
      const responseJSON = await response.json();
      setListEducation(responseJSON.data);
    } catch (error) {
      console.log("Failed fetch get educations", error.message);
    }
  };
  const getExperience = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `https://knowx-be.herokuapp.com/api/user/experience/${id}`,
        requestOptions
      );
      const responseJSON = await response.json();
      setListExperience(responseJSON.data);
    } catch (error) {
      console.log("Failed fetch get experience", error.message);
    }
  };
  const getArchives = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `https://knowx-be.herokuapp.com/api/user/archives/${id}`,
        requestOptions
      );
      const responseJSON = await response.json();
      setListArchives(responseJSON.data);
    } catch (error) {
      console.log("Failed fetch ", error.message);
    }
  };
  useEffect(() => {
    getArchives();
    getExperience();
    getEducation();
  }, []);

  return (
    <div>
      <div className="education-info content">
        <h5 style={{ display: "inline-block" }}>Education</h5>

        <Timeline
          mode="left"
          style={{ marginLeft: "-800px", marginTop: "25px" }}
        >
          {listEducation.map((education) => (
            <Timeline.Item
              color="green"
              label={`${education.start_date} - ${education.end_date}`}
            >
              <h6 style={{ paddingTop: "25px" }}>{education.title}</h6>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>

      <div className="exp-info content">
        <h5 style={{ display: "inline-block" }}>Experience</h5>
        <Timeline
          mode="left"
          style={{ marginLeft: "-800px", marginTop: "25px" }}
        >
          {listExperience.map((experience) => (
            <Timeline.Item
              color="green"
              label={`${experience.start_date} - ${experience.end_date}`}
            >
              <h6 style={{ paddingTop: "25px" }}>{experience.title}</h6>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>

      <div className="exp-info content">
        <h5 style={{ display: "inline-block" }}>Archives</h5>
        <Timeline
          mode="left"
          style={{ marginLeft: "-800px", marginTop: "25px" }}
        >
          {listArchives.map((archive) => (
            <Timeline.Item color="green" label={`${archive.time}`}>
              <h6 style={{ paddingTop: "25px" }}>{archive.title}</h6>
              <Image
                width={200}
                src={`https://knowx-be.herokuapp.com/${archive.image}`}
              />
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </div>
  );
};
export default About;
