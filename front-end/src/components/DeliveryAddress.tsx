import React, { useState, useEffect } from "react";
import addressesData from "../assets/delivery.json";
import TermsAndConditionsPopup from "./TermsAndConditionsPopup.tsx";
import {sendOrderData} from "../remote/requestbin";
import {AddressFields} from "./AddressForm.tsx";


type Address = {
  country: string;
  city: string;
  continent: string;
  addressLine1: string;
};
interface Item {
    name: string;
    quantity: number;
}
interface DeliveryAddressProps {
    items: Item[];
    addressInfo: AddressFields | null; // New prop to receive address info
}


const DeliveryAddress: React.FC<DeliveryAddressProps> = ({ items, addressInfo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false); // New state for marketing checkbox
  const [showPopup, setShowPopup] = useState(false);
  const [orderComment, setOrderComment] = useState('');
  const [preDefinedAddresses, setPreDefinedAddresses] = useState<Address[]>([]);

    const handleCheckout = () => {
        console.log('Checkout button clicked');
        setIsLoading(true);
        setIsSubmitted(false);

        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 5000);

        sendOrderData('https://eowyyh7aavsptru.m.pipedream.net', items, addressInfo)
    };



  useEffect(() => {
        setPreDefinedAddresses(addressesData); // Set addresses using JSON data
  }, []); // Empty dependency array to run only once on component mount

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const handleSelectDeliveryAddress = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedIndex = parseInt(event.target.value);
      setSelectedAddressIndex(selectedIndex);
    };

  const handleCheckboxChange = () => {
    setTermsChecked(!termsChecked);
  };

  const handleMarketingCheckboxChange = () => {
        setMarketingChecked(!marketingChecked);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
      if (!termsChecked) {
          alert('Please accept the terms & conditions to proceed.');
          return;
      }
      const selectedAddress = preDefinedAddresses[selectedAddressIndex];
      console.log("Selected address:", selectedAddress);
      alert('Form submitted');
    };
  const closePopup = () => {
    setShowPopup(false);
  };

    return (
        <form onSubmit={handleSubmit}>
          <h2>Delivery Address</h2>
          <div>
            <label>Select Delivery Address:</label>
            <select onChange={handleSelectDeliveryAddress}>
              {preDefinedAddresses.map((address, index) => (
                  <option key={index} value={index}>
                    {address.city}, {address.country}
                  </option>
              ))}
            </select>
          </div>
            <div className={"select-delivery-address"}>
                <div>
                    <label>
                        Address:
                        {preDefinedAddresses.length > 0 ? (
                            <span>{preDefinedAddresses[selectedAddressIndex].addressLine1}</span>
                        ) : (
                            <span>Loading...</span>
                        )}
                    </label>
                </div>
                <div>
                    <label>
                        Continent:
                        {preDefinedAddresses.length > 0 ? (
                            <span>{preDefinedAddresses[selectedAddressIndex].continent}</span>
                        ) : (
                            <span>Loading...</span>
                        )}
                    </label>
                </div>
                <div className="form-row">
                    <label htmlFor="order-comment">Order Comment:</label>
                    <textarea
                        id="order-comment"
                        value={orderComment}
                        onChange={(e) => setOrderComment(e.target.value)}
                        placeholder="Any special instructions?"
                    />
                </div>
                <div className="form-checkbox">
                    <label>
                        <input type="checkbox" checked={termsChecked} onChange={handleCheckboxChange}/>
                        <span>I accept the terms & conditions</span>
                    </label>
                </div>

                <div className="form-checkbox">
                    <label>
                        <input type="checkbox" checked={marketingChecked} onChange={handleMarketingCheckboxChange}/>
                        <span>I agree to receive marketing emails</span>
                    </label>
                </div>
                <button type="button" onClick={() => setShowPopup(true)}>View Terms and Conditions</button>
                {/* Pop-up */}
                {showPopup && <TermsAndConditionsPopup onClose={closePopup}/>}
                {/* Din eksisterende form indhold fortsætter her */}
            </div>
            {isLoading ? (
                <div className="overlay">
                    <div className="loading-spinner"></div>
                </div>
            ) : isSubmitted ? (
                <p>Formularen er blevet indsendt!</p>
            ) : (
                <button className="bn30" onClick={handleCheckout}>
                    <span className="text">Submit</span>
                </button>
            )}
        </form>
    );
};


export default DeliveryAddress;