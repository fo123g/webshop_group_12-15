import React, { useState, ChangeEvent, FocusEvent, FormEvent } from "react";

export type AddressFields = {
    country: string;
    zip: string;
    city: string;
    addressLine1: string;
    addressLine2: string;
    name: string;
    phone: string;
    email: string;
    companyName: string;
    companyVAT: string;
};

type ErrorsState = {
    [key: string]: string;
};
interface AddressFormProps {
    onCompanyVATChange: (vat: string) => void;
    onSubmitAddress: (address: AddressFields) => void;
}


const AddressForm: React.FC<AddressFormProps> = ({ onCompanyVATChange, onSubmitAddress }) => {
    const [address, setAddress] = useState<AddressFields>({
        country: 'Denmark',
        zip: '',
        city: '',
        addressLine1: '',
        addressLine2: '',
        name: '',
        phone: '',
        email: '',
        companyName: '',
        companyVAT: '',
    });


    const [cityLocked, setCityLocked] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorsState>({});

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        onSubmitAddress(address);

        if (name === 'companyVAT') {
            // Call the callback function when companyVAT changes
            onCompanyVATChange(value);
        }
        if (name === 'zip' && value !== '' && !/^\d+$/.test(value)) {
            return; // Forhindrer opdatering af værdien, hvis den indeholder ikke-numeriske tegn
        }
        if (name === 'companyVAT' && value !== '' && !/^\d+$/.test(value)) {
            return; // Forhindrer opdatering af værdien, hvis den indeholder ikke-numeriske tegn
        }
        if (name === 'phone' && value !== '' && !/^\d+$/.test(value)) {
            return; // Forhindrer opdatering af værdien, hvis den indeholder ikke-numeriske tegn
        }
        // Opdater din adresse state med den nye værdi først
        setAddress((prevAddress: AddressFields) => ({
            ...prevAddress,
            [event.target.name]: event.target.value,
        }));

        // Derefter tjek for fejl og opdater dem om nødvendigt
        let newErrors: ErrorsState = { ...errors };
        if (name === "email" && !validateEmail(value)) {
            newErrors.email = 'Invalid email'; // Ensure consistent key usage
        } else if (name === "phone") {
            const phoneError = validatePhone(value);
            if (phoneError) {
                newErrors = { ...newErrors, phone: phoneError };
            } else {
                delete newErrors.phone;
            }
        } else if (name === "companyVAT") {
            const vatError = validateCompanyVAT(value);
            if (vatError) {
                newErrors.companyVAT = vatError;
            } else {
                delete newErrors.companyVAT;
            }
        } else {
            delete newErrors[name]; // This will remove the error if the input becomes valid
        }
        setErrors(newErrors);

        // Specifik logik for postnummer-validering
        if (name === 'zip') {
            validateZipCode(value);
        }
    };

    const validateZipCode = async (zip: string) => {
        if (zip.length === 4) {
            try {
                const response = await fetch(`https://api.dataforsyningen.dk/postnumre/${zip}`);
                const data = await response.json();
                console.log(data);

                if (data.title !== "The resource was not found") {
                    setAddress(prevAddress => ({
                        ...prevAddress,
                        city: data.navn,
                        zip
                    }));
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        zip: ''
                    }));
                    setCityLocked(true);
                } else {
                    // Set error message if zip is not found
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        zip: 'Ugyldigt postnummer'
                    }));
                    setCityLocked(false);
                }
            } catch (error) {
                console.error("Error validating zip code:", error);
                setErrors(prevErrors => ({
                    ...prevErrors,
                    zip: 'Fejl ved validering af postnummer'
                }));
                setCityLocked(false);
            }
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                zip: 'Postcode must be 4 digits'
            }));
            setCityLocked(false);
        }
    };


    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return re.test(String(email).toLowerCase());
    };
    const validatePhone = (phone: string): string => {
        if (phone.length > 8) {
            return "The phone number must not exceed 8 digits";
        } else if (phone.length < 8 || isNaN(Number(phone))) {
            return "The phone number must be 8 digits";
        }
        return ""; // Ingen fejl
    };

    const handleZipBlur = async (e: FocusEvent<HTMLInputElement>) => {
        const zip = e.target.value;
        await validateZipCode(zip);
    };
    //Placeholder for validateZip and other validation functions

    const validateCompanyVAT = (companyVAT: string): string => {
        if (companyVAT.length !== 8 || isNaN(Number(companyVAT))) {
            return "The VAT number must be 8 digits";
        }
        return ""; // Ingen fejl
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Form data submitted:', address);
        alert('Form submitted!');
    };


    return (
        <form onSubmit={handleSubmit} className="AddressForm">
            <div>
                <label>
                    Country:
                    <input
                        type="text"
                        name="country"
                        value={address.country}
                        //onChange={(e) => handleInputChange(e, 'billing')}
                    />
                </label>
            </div>
            <div>
                <label>
                    Zip Code:
                    <input
                        type="text"
                        name="zip"
                        value={address.zip}
                        onChange={(e) => handleInputChange(e)}
                        onBlur={(e) => handleZipBlur(e)}
                    />
                </label>
            </div>
            {errors['zip'] && <div className="error">{errors['zip']}</div>}
            <div>
                <label>
                    City:
                    <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleInputChange}
                        readOnly={cityLocked} // Gør feltet skrivebeskyttet, hvis cityLocked er true
                    />
                </label>
            </div>
            <div>
                <label>
                    Address Line 1:
                    <input
                        type="text"
                        name="addressLine1"
                        value={address.addressLine1}
                        onChange={(e) => handleInputChange(e)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Address Line 2:
                    <input
                        type="text"
                        name="addressLine2"
                        value={address.addressLine2}
                        onChange={(e) => handleInputChange(e)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={address.name}
                        onChange={(e) => handleInputChange(e)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Phone:
                    <input
                        type="text"
                        name="phone"
                        value={address.phone}
                        onChange={(e) => handleInputChange(e)}
                    />
                </label>
                {errors.phone && <div className="error">{errors.phone}</div>} {/* Fejlbesked her */}
            </div>
            <div>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={address.email}
                        onChange={(e) => handleInputChange(e)}
                    />
                </label>
                {errors.email && <div className="error">{errors.email}</div>} {/* Display the email error message here */}
            </div>
            <div>
                <label>
                    Company Name:
                    <input
                        type="text"
                        name="companyName"
                        value={address.companyName}
                        onChange={(e) => handleInputChange(e)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Company VAT:
                    <input
                        type="text"
                        name="companyVAT"
                        value={address.companyVAT}
                        onChange={(e) => handleInputChange(e)}
                    />
                </label>
                {errors.companyVAT && <div className="error">{errors.companyVAT}</div>}
            </div>
        </form>
    );

};

export default AddressForm;