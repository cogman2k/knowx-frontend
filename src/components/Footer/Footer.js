
import images from "../../assets/images";
import "./styles.scss";
import { Layout, Row, Col } from "antd";
import { FacebookOutlined, MailOutlined } from "@ant-design/icons";

const Footer = () => (
  <Layout.Footer className="footer-container">
    <div className="footer-resource">
      <Row
        justify="space-around"
        style={{
          fontSize: "20px",
          fontWeight: "500",
          lineHeight: "30px",
        }}
      >
        <Col span={6}>
          <div className="footer-logo">
            <img src={images.logo_4H} />
          </div>
        </Col>
        <Col span={6}>
          <div className="mt--12 mb-10">RESOURCES</div>
          <Row
            style={{ fontSize: "18px", fontWeight: "300", lineHeight: "21px" }}
          >
            <Col span={8}>
              <div className="mb-10">Post</div>
              <div className="mb-10">Question</div>
              <div className="mb-10">Video Call</div>
            </Col>
            <Col span={8}>
              <div className="mb-10">Find Buddy</div>
              <div className="mb-10">Find Mentor</div>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <div className="mt--12 mb-10">CONTACT US</div>
          <FacebookOutlined
            style={{ marginRight: "20px" }}
            onClick={() => {
              window.open("https://www.facebook.com/groups/363505891936830");
            }}
          />
          <a href="mailto: knowx.dtu@gmail.com">
            <MailOutlined style={{ color: "#fff" }} />
          </a>
        </Col>
        <Col span={6}> </Col>
      </Row>
    </div>
  </Layout.Footer>
);
export default Footer;
