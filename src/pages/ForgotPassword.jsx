// import React, { useRef, useState, useEffect } from "react";
// import { Button, Card, Form, Alert, Spinner } from "react-bootstrap";
// import { requestPassResetOTPApi, resetPassApi } from "../helpers/axiosHelpers.js";
// import { useNavigate } from "react-router-dom";

// const timToRequestOtpAgain = 30;

// const ForgotPassword = () => {
//   const emailRef = useRef();
//   const otpRef = useRef();
//   const passwordRef = useRef();
//   const confirmPasswordRef = useRef();
//   const navigate = useNavigate();

//   const [showPassResetForm, setShowPassResetForm] = useState(false);
//   const [isOtpPending, setOtpPending] = useState(false);
//   const [isOtpBtnDisabled, setOtpBtnDisabled] = useState(false);
//   const [counter, setCounter] = useState(0);

//   const timToRequestOtpAgain = 30;

//   useEffect(() => {
//     if (counter > 0) {
//       const timer = setInterval(() => {
//         setCounter((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(timer);
//     } else {
//       setOtpBtnDisabled(false);
//     }
//   }, [counter]);

//   const handleOnSubmit = async (e) => {
//     e.preventDefault();

//     const email = emailRef.current.value;
//     console.log("Email submitted:", email);

//     setOtpPending(true);
//     setOtpBtnDisabled(true);

//     try {
//       const response = await requestPassResetOTPApi({ email });
//       console.log("OTP API response:", response);

//       if (response?.status === "success") {
//         // Add slight delay before showing OTP form
//         setTimeout(() => {
//           setOtpPending(false);
//           setShowPassResetForm(true);
//           setCounter(timToRequestOtpAgain);
//         }, 1500);
//       } else {
//         setOtpPending(false);
//         setOtpBtnDisabled(false);
//       }
//     } catch (error) {
//       console.error("Error while requesting OTP:", error);
//       setOtpPending(false);
//       setOtpBtnDisabled(false);
//     }
//   };

//   const handleOnPasswordResetSubmit = async (e) => {
//     e.preventDefault();
//     const email = emailRef.current.value;
//     const otp = otpRef.current.value;
//     const password = passwordRef.current.value;
//     const confirmPassword = confirmPasswordRef.current.value;

//     console.log({ email, otp, password, confirmPassword });

//     // Add password match validation and API logic here
//     const respone = await resetPassApi(payload);
//     if(respone?.status==="success") {

//       //set timeout and will redirect it to login
//       setTimeout(() => {
//         navigate("/login")
//       }, 3000);

//     }
//   };

//   return (
//     <div className="forgot-password d-flex justify-content-center align-items-center">
//       <Card style={{ width: "25rem" }}>
//         <Card.Body>
//           <Card.Title>Forgot your password</Card.Title>
//           <p>Enter your email to get the OTP link to reset your password.</p>
//           <hr />
//           <Form onSubmit={handleOnSubmit}>
//             <Form.Control
//               type="email"
//               placeholder="your email@.com"
//               ref={emailRef}
//               required
//             />
//             <div className="d-grid mt-3">
//               <Button
//                 type="submit"
//                 variant="primary"
//                 disabled={isOtpBtnDisabled}
//               >
//                 {isOtpPending ? (
//                   <Spinner animation="border" size="sm" />
//                 ) : counter > 0 ? (
//                   `Request OTP in ${counter}s`
//                 ) : (
//                   "Request OTP"
//                 )}
//               </Button>
//             </div>
//           </Form>

//           {showPassResetForm && (
//             <>
//               <hr />
//               <Alert variant="success" className="mt-4">
//                 We have sent an OTP to your email. Please check your inbox or
//                 spam folder.
//               </Alert>

//               <Form onSubmit={handleOnPasswordResetSubmit} className="mt-3">
//                 <Form.Group className="mb-3">
//                   <Form.Label>OTP</Form.Label>
//                   <Form.Control
//                     name="otp"
//                     type="text"
//                     placeholder="0000"
//                     ref={otpRef}
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>New Password</Form.Label>
//                   <Form.Control
//                     name="password"
//                     type="password"
//                     placeholder="******"
//                     ref={passwordRef}
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Confirm Password</Form.Label>
//                   <Form.Control
//                     name="confirmPassword"
//                     type="password"
//                     placeholder="******"
//                     ref={confirmPasswordRef}
//                     required
//                   />
//                 </Form.Group>

//                 <div className="d-grid">
//                   <Button type="submit" variant="primary">
//                     Reset Password
//                   </Button>
//                 </div>
//               </Form>
//             </>
//           )}

//           <div className="text-end my-3 text-center">
//             Ready to login? <a href="/login">Login Now</a>
//           </div>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default ForgotPassword;


import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Form, Alert, Spinner } from "react-bootstrap";
import { requestPassResetOTPApi, resetPassApi } from "../helpers/axiosHelpers.js";
import { useNavigate } from "react-router-dom";

const timToRequestOtpAgain = 30;

const ForgotPassword = () => {
  const emailRef = useRef();
  const otpRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const navigate = useNavigate();

  const [showPassResetForm, setShowPassResetForm] = useState(false);
  const [isOtpPending, setOtpPending] = useState(false);
  const [isOtpBtnDisabled, setOtpBtnDisabled] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isResetPending, setResetPending] = useState(false);

  useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => setCounter((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setOtpBtnDisabled(false);
    }
  }, [counter]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value.trim().toLowerCase();
    if (!email) return;

    setOtpPending(true);
    setOtpBtnDisabled(true);

    try {
      const response = await requestPassResetOTPApi({ email });
      if (response?.status === "success") {
        setTimeout(() => {
          setOtpPending(false);
          setShowPassResetForm(true);
          setCounter(timToRequestOtpAgain);
        }, 1500);
      } else {
        setOtpPending(false);
        setOtpBtnDisabled(false);
      }
    } catch (error) {
      console.error("Error while requesting OTP:", error);
      setOtpPending(false);
      setOtpBtnDisabled(false);
    }
  };

  const handleOnPasswordResetSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value.trim().toLowerCase();
    const otp = String(otpRef.current.value).trim();
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (!email || !otp || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      alert("Passwords do not match"); // or toast.error(...)
      return;
    }

    setResetPending(true);
    try {
      const payload = { email, otp, password };
      const response = await resetPassApi(payload);

      if (response?.status === "success") {
        // optional: clear fields
        otpRef.current.value = "";
        passwordRef.current.value = "";
        confirmPasswordRef.current.value = "";

        // redirect to login after short pause
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      console.error("Reset password failed:", err);
    } finally {
      setResetPending(false);
    }
  };

  return (
    <div className="forgot-password d-flex justify-content-center align-items-center">
      <Card style={{ width: "25rem" }}>
        <Card.Body>
          <Card.Title>Forgot your password</Card.Title>
          <p>Enter your email to get the OTP link to reset your password.</p>
          <hr />
          <Form onSubmit={handleOnSubmit}>
            <Form.Control
              type="email"
              placeholder="your email@.com"
              ref={emailRef}
              autoComplete="email"
              required
            />
            <div className="d-grid mt-3">
              <Button type="submit" variant="primary" disabled={isOtpBtnDisabled}>
                {isOtpPending ? (
                  <Spinner animation="border" size="sm" />
                ) : counter > 0 ? (
                  `Request OTP in ${counter}s`
                ) : (
                  "Request OTP"
                )}
              </Button>
            </div>
          </Form>

          {showPassResetForm && (
            <>
              <hr />
              <Alert variant="success" className="mt-4">
                We have sent an OTP to your email. Please check your inbox or spam folder.
              </Alert>

              <Form onSubmit={handleOnPasswordResetSubmit} className="mt-3">
                <Form.Group className="mb-3">
                  <Form.Label>OTP</Form.Label>
                  <Form.Control
                    name="otp"
                    type="text"
                    placeholder="0000"
                    ref={otpRef}
                    autoComplete="one-time-code"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="******"
                    ref={passwordRef}
                    autoComplete="new-password"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    name="confirmPassword"
                    type="password"
                    placeholder="******"
                    ref={confirmPasswordRef}
                    autoComplete="new-password"
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="primary" disabled={isResetPending}>
                    {isResetPending ? <Spinner animation="border" size="sm" /> : "Reset Password"}
                  </Button>
                </div>
              </Form>
            </>
          )}

          <div className="text-end my-3 text-center">
            Ready to login? <a href="/login">Login Now</a>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ForgotPassword;
