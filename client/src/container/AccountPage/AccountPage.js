import React, { useEffect, useState } from 'react';
import './AccountPage.css';
import { useAuthContext } from '../../hooks/useAuthContext';

const AccountPage = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [accountDetails, setAccountDetails] = useState({})
  const [isModified, setIsModified] = useState(false);
  const [isPModified, setIsPModified] = useState(false);

  const fetchAccountData = async() => {
    try {
      // Fetch user data
      const response = await fetch(`http://localhost:4000/api/account/get-account/${user.username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await response.json();
      const account = userData;
      setAccountDetails(account)
      console.log("userdata",userData)
      console.log(accountDetails)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  }

  useEffect(() => {

    fetchAccountData()
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setIsModified(true);
    setIsPModified(true)
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/account/update-account`,{
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountDetails)
      });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setAccountDetails(userData)
        setIsModified(true);
      fetchAccountData()
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle error
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="account-page">
      <h2>Account Details</h2>
      <div className="user-details">
        <div>
          <strong>Username:</strong> {user.username}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
      </div>
      {user.role === "designer" && (
        <div className="payment-details">
          <h2>Payment Details</h2>
          <div>
            <strong>Account Holder Name:</strong>{" "}
            <input
              type="text"
              name="AccountHolderName"
              value={accountDetails.AccountHolderName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <strong>Account Number:</strong>{" "}
            <input
              type="text"
              name="AccountNumber"
              value={accountDetails.AccountNumber || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <strong>IFSC Code:</strong>{" "}
            <input
              type="text"
              name="IFSC"
              value={accountDetails.IFSC || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <strong>Bank Name:</strong>{" "}
            <input
              type="text"
              name="BankName"
              value={accountDetails.BankName || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <strong>UPI ID:</strong>{" "}
            <input
              type="text"
              name="UPI"
              value={accountDetails.UPI || ''}
              onChange={handleInputChange}
            />
          </div>
          <button disabled={!isPModified} onClick={handleSaveChanges}>Save Payment Changes</button>
        </div>
      )}
      <h2>Shipping Address</h2>
      <div className="shipping-address">
        <div>
          <strong>Name:</strong>{" "}
          <input
            type="text"
            name="name"
            value={accountDetails.name || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <strong>Address:</strong>{" "}
          <input
            type="text"
            name="address"
            value={accountDetails.address || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <strong>City:</strong>{" "}
          <input
            type="text"
            name="city"
            value={accountDetails.city || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <strong>State:</strong>{" "}
          <input
            type="text"
            name="state"
            value={accountDetails.state || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <strong>Pincode:</strong>{" "}
          <input
            type="text"
            name="pincode"
            value={accountDetails.pincode || ''}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <button disabled={!isModified} onClick={handleSaveChanges}>Save Shipping Address Changes</button>
    </div>
  );
};

export default AccountPage;
