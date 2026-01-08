import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Payment.css'

const PaymentSuccess = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const referenceNum = searchParams.get("reference");

    return (
        <div className='payment-success'>
            <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <h1 style={{ textTransform: "uppercase" }}>Order Successful</h1>
                <p>Reference No. {referenceNum}</p>
                <Link to='/orders'>Go To Orders</Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
