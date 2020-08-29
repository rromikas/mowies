import React, { useEffect } from "react";
import FileViewer from "react-file-viewer";
import { default as doc } from "../../documents/CookiesPolicy.docx";

const CookiesPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="row no-gutters px-0" style={{ minHeight: "800px" }}>
      <div className="col-60 py-md-5 text-dark">
        <FileViewer
          fileType={"docx"}
          filePath={doc}
          errorComponent={() => <div></div>}
          onError={() => console.log("error doc")}
        />
      </div>
    </div>
  );
};

export default CookiesPolicy;
