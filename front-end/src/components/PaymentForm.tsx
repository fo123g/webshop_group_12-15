import React, { useState } from 'react';

type PaymentFormProps = {
    totalAmount: number;
    companyVAT?: string;
};

const PaymentForm: React.FC<PaymentFormProps> = ({ totalAmount, companyVAT }) => {
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [giftCardAmount, setGiftCardAmount] = useState<string>('');
    const [giftCardNumber, setGiftCardNumber] = useState<string>('');
    const [mobilePayNumber, setMobilePayNumber] = useState<string>('');
    const [mobilePayNumberError, setMobilePayNumberError] = useState<string>('');

    const isInvoiceAvailable = (): boolean => {
        return !!companyVAT && companyVAT.trim() !== '' && companyVAT.length ==8;
    };

    const canUseGiftCardOnly = (): boolean => {
        return parseFloat(giftCardAmount) > totalAmount;
    };

    const handlePaymentMethodClick = (method: string) => {
        setPaymentMethod(method);
    };

    const handleMobilePayNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 8 ) {
            setMobilePayNumber(value);
            if (value.length !== 8) {
                setMobilePayNumberError("The mobilepay number must be 8 digits");
            } else {
                setMobilePayNumberError(""); // Ryd fejlen, når betingelsen er opfyldt
            }
        }
    };

    const handleNumericChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Tjekker om værdien kun indeholder tal
            setter(value);
        }
    };

    const buttonStyle = (method: string) => ({
        background: 'transparent',
        border: paymentMethod === method ? '2px solid black' : 'none', // Conditional border
        padding: 0
    });


    return (
        <form>
            {/* Payment method buttons */}
            <div>
                {!canUseGiftCardOnly() && (
                <button type="button" onClick={() => handlePaymentMethodClick('mobilePay')}
                        style={buttonStyle('mobilePay')}>
                    <img src={"https://i.imgur.com/xnpVdCD.png"} alt="MobilePay"
                         style={{ width: '75px', height: '75px', objectFit: 'contain' }}/>
                </button>
                    )}
                <button type="button" onClick={() => handlePaymentMethodClick('giftCard')}
                        style={buttonStyle('giftCard')}>
                    <img src={"https://i.imgur.com/9Zfikfo.png"} alt="Gift Card"
                         style={{ width: '75px', height: '75px', objectFit: 'contain' }}/>
                </button>
                {isInvoiceAvailable() && !canUseGiftCardOnly() && (
                    <button type="button" onClick={() => handlePaymentMethodClick('invoice')}
                            style={buttonStyle('invoice')}>
                        <img src={"https://i.imgur.com/vKuWIyM.png"} alt="Invoice"
                             style={{ width: '75px', height: '75px', objectFit: 'contain' }}/>
                    </button>
                )}
            </div>

            {/* Conditional input rendering */}
            {paymentMethod === 'giftCard' && (
                <div>
                    <input
                        type="text"
                        value={giftCardAmount}
                        onChange={handleNumericChange(setGiftCardAmount)}
                        placeholder="Enter gift card amount"
                    />
                    <input
                        type="text"
                        value={giftCardNumber}
                        onChange={handleNumericChange(setGiftCardNumber)}
                        placeholder="Enter gift card number"
                    />
                </div>
            )}

            {paymentMethod === 'mobilePay' && !canUseGiftCardOnly() && (
                <div>
                    <input
                        type="text"
                        value={mobilePayNumber}
                        onChange={handleMobilePayNumberChange}
                        placeholder="Enter MobilePay number"
                    />
                    {mobilePayNumberError && <div style={{ color: 'red' }}>{mobilePayNumberError}</div>}
                </div>
            )}

            {paymentMethod === 'invoice' && isInvoiceAvailable() &&  (
                <div>
                    {/* Invoice payment inputs go here, if necessary */}
                    {/* You can replicate the structure used for the other methods */}
                </div>
            )}

            {/* Submit button or additional form elements */}
            {/* ... */}
        </form>
    );
};

export default PaymentForm;