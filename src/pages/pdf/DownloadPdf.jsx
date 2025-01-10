import MyDocument from "./component/DownloadPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
const ReactPdf = () => {
  return (
    <>
      <PDFDownloadLink document={<MyDocument />} fileName="document.pdf">
        下载
      </PDFDownloadLink>
    </>
  );
};

export default ReactPdf;
