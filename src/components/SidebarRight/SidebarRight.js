import "antd/dist/antd.css";
import "./styles.scss";
import { Layout, Badge, Card, Typography, List, Avatar } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";

const { Sider } = Layout;
const { Link } = Typography;

const SidebarRight = () => {
  const data = [
    {
      title: "RikkeiSoft",
      decription: "81 Quang Trung St, Hai Chau District, Da Nang City",
      href: "https://rikkeisoft.com",
      avatar:
        "https://doanhnghiep.quocgiakhoinghiep.vn/wp-content/uploads/2020/11/rikkeisoft-logo.png",
    },
    {
      title: "MGM Technology Partners",
      decription: "7 Phan Chau Trinh St, Hai Chau District, Da Nang City",
      href: "https://www.mgm-tp.com/en/",
      avatar:
        "data:image/png;base64,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",
    },
    {
      title: "FPT Software",
      decription:
        "FPT Building, Road No.1, Son Tra District, Da Nang City, Vietnam",
      href: "https://www.fpt-software.com/",
      avatar:
        "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/7f581e476a2a4319ca22",
    },
    {
      title: "Enclave",
      decription: " 455 Hoang Dieu st, Hai Chau District, Da Nang City",
      href: "https://enclaveit.com/",
      avatar:
        "https://haymora.com/upload/images/cong_nghe_thong_tin/service/enclave/enclave-logo.jpg",
    },
  ];
  return (
    <div className="layout-sidebar-right">
      <Sider width={280} className="site-layout-background">
        <p
          style={{
            color: "#00358E",
            fontWeight: "bold",
            fontSize: "20px",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Most Popular
        </p>
        <Badge.Ribbon text="IT">
          <Card title="References" size="small">
            <Link href="https://fullstack.edu.vn/" target="_blank">
              F8 FullStack
            </Link>
            <br />
            <Link href="https://www.w3schools.com/" target="_blank">
              w3schools
            </Link>
          </Card>
        </Badge.Ribbon>
        <Badge.Ribbon text="Company" color="cyan">
          <Card title="Da Nang" size="small">
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar size="large" src={item.avatar} />}
                    title={
                      <Link href={item.href} target="_blank">
                        {item.title}
                      </Link>
                    }
                    description={item.decription}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Badge.Ribbon>
        <div className="poster-right"> </div>
      </Sider>
    </div>
  );
};

export default SidebarRight;
