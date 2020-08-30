import React, { useEffect } from "react";
import PrivacyPolicy from "../../documents/PrivacyPolicy";
import TermsAndConditions from "../../documents/TermsAndConditions";
import CookiesPolicy from "../../documents/CookiesPolicy";

const LegalDocument = ({ type }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);
  return type ? (
    <div className="col-60 py-md-5 text-dark">
      <div className="row no-gutters justify-content-center">
        <div className="p-sm-5 p-4 bg-white">
          {type === "privacy-policy" ? (
            <PrivacyPolicy></PrivacyPolicy>
          ) : type === "terms-and-conditions" ? (
            <TermsAndConditions></TermsAndConditions>
          ) : type === "cookies-policy" ? (
            <CookiesPolicy></CookiesPolicy>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default LegalDocument;
