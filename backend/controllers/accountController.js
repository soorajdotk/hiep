const Account = require('../models/accountModel')

const getAccountDetails = async(req, res) => {
    const { username } = req.params
    try{
        const account = await Account.find({ username })
        res.json(account[0])
    }catch(error){
        console.error(error)
        res.status(500).json("Internal Server Error")
    }
}

const updateAccountDetails = async (req, res) => {
    const { name, address, city, state, pincode, username, AccountHolderName, AccountNumber, IFSC, BankName, UPI } = req.body;
    try {
        // Find the account document corresponding to the username
        let account = await Account.findOne({ username });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        // Update the fields with the new values
        if (name) {
            account.name = name;
        }
        if (address) {
            account.address = address;
        }
        if (city) {
            account.city = city;
        }
        if (state) {
            account.state = state;
        }
        if (pincode) {
            account.pincode = pincode;
        }
        if(AccountHolderName){
            account.AccountHolderName = AccountHolderName
        }
        if(AccountNumber){
            account.AccountNumber = AccountNumber
        }
        if(IFSC){
            account.IFSC = IFSC
        }
        if(BankName){
            account.BankName = BankName
        }
        if(UPI){
            account.UPI = UPI
        }

        // Save the updated account document
        await account.save();

        res.status(200).json({ message: "Account details updated successfully", account });
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
};

module.exports = {
    getAccountDetails,
    updateAccountDetails
}