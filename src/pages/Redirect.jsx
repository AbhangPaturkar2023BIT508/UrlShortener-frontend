

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const Redirect = () => {
  const { shortCode } = useParams();

  useEffect(() => {
    if (shortCode) {
      window.location.href = `http://localhost:8080/r/${shortCode}`;
    }
  }, [shortCode]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Redirecting...</h2>
      <p>
        If you are not redirected automatically,{" "}
        <a href={`http://localhost:8080/r/${shortCode}`}>click here</a>.
      </p>
    </div>
  );
};

export default Redirect;
