import React from "react";
import "./FooterStyling.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Useful Links</h3>
          <p>
            {/* <a href="#">Terms of Service</a> */}
            <Link to='/aboutUs'>
              <p>About Us</p>
            </Link>
          </p>
          <p>
            {/* <a href="#">Privacy Policy</a> */}
            <Link to='/tos'>
              <p>Terms of Service</p>
            </Link>
          </p>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>
            Email:{" "}
            <a href="mailto:contact@surveyapp.com">contact@surveyapp.com</a>
          </p>
          <p>
            Phone: <a href="tel:+1234567890">+1234567890</a>
          </p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <p>
            <a href="https://www.facebook.com">Facebook</a>
          </p>
          <p>
            <a href="https://www.twitter.com">Twitter</a>
          </p>
        </div>
      </div>
      <br></br>
      <div className="footer-bottom">
        &copy; 2024 SurveyApp. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
