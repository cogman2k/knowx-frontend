import React, { useState, useEffect } from "react";
import { List, Divider } from "antd";

const Mentor = () => {
  const [subjectMentor, setSubjectMentor] = useState([]);
  useEffect(() => {
    async function getAllListMentor() {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/mentor/mymentor",
        requestOptions
      );
      const responseJSON = await response.json();
      setSubjectMentor(responseJSON.data);
      console.log("Mentor ", responseJSON.data);
    }
    getAllListMentor();
  }, []);

  return (
    <div className="container">
      <div className="content">
        <Divider orientation="left">LIST SUBJECT MENTORING</Divider>
        <List
          style={{ marginLeft: "15px" }}
          itemLayout="horizontal"
          dataSource={subjectMentor}
          renderItem={(item) => (
            <List.Item className="list">
              <List.Item.Meta
                title={<a href="https://ant.design">{item.subject_name}</a>}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Mentor;
