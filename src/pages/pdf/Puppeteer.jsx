import { Button, Input, Space, Card, Row, Col } from "antd";
import { downloadFile } from "../../utils/download";
import { useState } from "react";
const ReactPdf = () => {
  const [url, setUrl] = useState("https://www.baidu.com");

  const handleDownload = async () => {
    await downloadFile({
      url: "/pdf/generate-pdf",
      method: "POST",
      data: { title: "My Title", content: "Hello World" },
      filename: "test.pdf",
    });
  };

  const handleDownloadByUrl = async () => {
    await downloadFile({
      url: "/pdf/generatePdfByUrl",
      method: "POST",
      data: { url: url },
      filename: "url.pdf",
    });
  };

  return (
    <>
      <Space size={16} className="items-start">
        <Card title="固定模板PDF" style={{ width: 300 }}>
          <Button onClick={handleDownload}>下载固定模板PDF</Button>
        </Card>
        <Card title="下载链接PDF" style={{ width: 500 }}>
          <Row gutter={16}>
            <Col className="gutter-row" span={6}>
              <div className="h-[100%] flex items-center"><span>网址链接：</span></div>
            </Col>
            <Col className="gutter-row" span={18}>
              <div><Input value={url} onChange={(e) => setUrl(e.target.value)} /></div>
            </Col>
          </Row>
          <Button className="mt-[10px]" onClick={handleDownloadByUrl}>下载链接-PDF</Button>
        </Card>
      </Space>
    </>
  );
};

export default ReactPdf;
