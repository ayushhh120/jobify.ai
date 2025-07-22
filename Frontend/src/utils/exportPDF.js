// utils/exportPDF.js
import domtoPDF from "dom-to-pdf";

export const exportToPDF = (element, filename = "resume.pdf") => {
  const options = {
    filename: filename,
    margin: 0.5,
    scale: 1,
  };

  domtoPDF(element, options, () => {
    console.log("✅ PDF generated!");
  });
};
