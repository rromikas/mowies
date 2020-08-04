import React from "react";
import FileViewer from "react-file-viewer";
import TermsAndConditions from "../../documents/TermsAndConditions.docx";
import PrivacyPolicy from "../../documents/PrivacyPolicy.docx";
import CookiePolicy from "../../documents/CookiesPolicy.docx";
import Navbar from "./Navbar";

const LegalDocument = ({ type }) => {
  return (
    <div className="row no-gutters px-0">
      <div className="col-60 px-0" style={{ height: "100px" }}></div>
      <Navbar></Navbar>

      <div className="col-60 py-5">
        <FileViewer
          fileType={"docx"}
          filePath={
            type === "privacy-policy"
              ? PrivacyPolicy
              : type === "cookies-policy"
              ? CookiePolicy
              : type === "terms-and-conditions"
              ? TermsAndConditions
              : ""
          }
          errorComponent={() => <div></div>}
          onError={() => console.log("error doc")}
        />
      </div>
    </div>
  );
};

export default LegalDocument;
