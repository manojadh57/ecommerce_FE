import React, { useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'

export const VerifyUser = () => {


    const [isPending , setIsPending] = useState(true);
    const [searchParams] = useSearchParams(); //this is to grab the sessionId and token from the url


    const sessionId = searchParams.get("sessionId");
    const token = searchParams.get("t");
    console.log(sessionId, token)
  return (
    <div className='py-5 p-5'>
        <div className="m-auto text-center">
            <Spinner animation='border' variant='primary' />

        </div>
        <div>Please wait .........</div>

    </div>
  )
}
