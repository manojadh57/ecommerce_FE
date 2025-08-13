import React, { useEffect, useState } from 'react'
import { Alert, Spinner } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { verifyNewUserApi } from '../helpers/axiosHelpers.js';

export const VerifyUser = () => {

    const [searchParams] = useSearchParams(); //this is to grab the sessionId and token from the url
    const sessionId = searchParams.get("sessionId");
    const token = searchParams.get("t");
    // console.log(sessionId, token)
    const navigate = useNavigate();

    const [isPending , setIsPending] = useState(true);
    const [message, setMessage] = useState("");
    const [variant, setVariant] = useState("info");
      const [status, setStatus] = useState(""); // NEW state to track status


    useEffect(()=> {
        const verify = async ()=> {
            const {status, message} = await verifyNewUserApi({ sessionId, token});
            setStatus(status);
            setVariant(status === "success" ? "success" : "danger");
            setMessage(message);
            setIsPending(false);
        };
      
        //will try if both the sessionId and token are present

        if(sessionId && token) {
            verify();
        } else {
            setStatus("error");
            setMessage("Invalid or missing verification link");
            setVariant("danger");
            setIsPending(false);
        };
    }, [sessionId, token]);

    useEffect(()=> {
         if(status === "success") {
            setTimeout(()=> {
                navigate('/login');
            }, 3000)
        }
    }, [status, navigate]);
        

  return (
    <div className='py-5 p-5 text-center'> 
    {
        isPending ? (
            <>
              <Spinner animation='border' variant='primary' />
                  <div>Please wait, verifying your email .....</div>
            </>
        ) : (
            <Alert variant = {variant}>{message}</Alert>
        )
    }
    </div>
  );
};
