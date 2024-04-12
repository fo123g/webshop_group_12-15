import React from "react";

const TermsAndConditionsPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Terms and Conditions</h2>
                <ol>
                    <li>By proceeding with the purchase, you accept the following terms and conditions:</li>
                    <li>You agree that the sender assumes full responsibility for any damages or losses you may suffer as a result of the delivered goods. This includes any form of personal injury or property damage caused by the goods.</li>
                    <li>You confirm that you have read and understood the terms and conditions for the shipment of goods, including the sender's liability in case of damage.</li>
                    <li>You commit to informing the sender immediately in case of any damages or deficiencies with the received goods.</li>
                    <li>The sender reserves the right to change or update these terms and conditions without notice.</li>
                </ol>
                <p>By proceeding with the purchase, you confirm that you accept the above terms and conditions.</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default TermsAndConditionsPopup;
