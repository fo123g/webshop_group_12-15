//import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import AddressForm, { AddressFields } from "./AddressForm";
import productData from '../assets/product.json';
import DeliveryAddress from "./DeliveryAddress.tsx";
import Total1 from "./Total1.tsx";
import PaymentForm from "./PaymentForm.tsx";
const itemList = productData;
console.log(productData);

interface ProductItem {
    name: string;
    price: number;
    quantity: number;
    ImageURL: string;
    giftWrap?: boolean;
    recurring?: string;
}
interface BasketItemProps {
    item: ProductItem;
    onChangeQuantity: (name: string, quantity: number) => void;
    onRemoveItem: (name: string) => void;
    onToggleGiftWrap: (name: string) => void;
    onChangeRecurring: (name: string, schedule: string) => void;
}



const BasketItem: React.FC<BasketItemProps> = ({ item, onChangeQuantity, onRemoveItem, onToggleGiftWrap, onChangeRecurring }) => {

    const calculateItemDiscount = () => {
        if (item.quantity > 3) {
            return (0.05 * item.price * item.quantity).toFixed(2);
        }
        return '0.00';
    };
    const itemDiscount = calculateItemDiscount();

    const discountMessage = item.quantity === 3 ? "You only need one more to get a 5% discount!" : null;

    return (
        <div className="basket-items">
            <div className="basket-Elements">
                <img src={item.ImageURL}
                     alt={item.name}
                     style={{ width: '200px', height: 'auto' }}/>
            <div className="product-details">
                <div><b>{item.name}</b>

                </div>
            <div>Price: ${item.price}
            </div>
            <div>Quantity:
                <input
                    className="quantity-input"
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => onChangeQuantity(item.name, parseInt(e.target.value))}
                    style={{width:"24px"}}
                />
            </div>
                {discountMessage && <div style={{ color: 'red', marginTop: '10px' }}>{discountMessage}</div>}
            <div>
                <label>
                    Gift Wrap:
                    <input
                        type="checkbox"
                        checked={item.giftWrap}
                        onChange={() => onToggleGiftWrap(item.name)}
                        style={{width:"24px"}}
                    />
                </label>
            </div>
            <label>
                Recurring Order:
                <select
                    className="quantity-input"
                    value={item.recurring || ''}
                    onChange={(e) => onChangeRecurring(item.name, e.target.value)}
                >
                    <option value="">No</option>
                    <option value="1 month">1 Month</option>
                    <option value="6 months">6 Months</option>
                    <option value="1 year">1 Year</option>
                </select>
            </label>
            <div>
                 <b>${ (item.price * item.quantity).toFixed(2) } </b>
                     { itemDiscount !== '0.00' && <div>Discount: -${ itemDiscount }</div> }
            </div>
                <div>
                </div>
            </div>
             <div className="details-right">
                 <div className="delete-button">
                     <button onClick={() => onRemoveItem(item.name)}>
                         <img src={"https://i.imgur.com/3ZyQkuC.png"}
                         style={{ width: '30px', height: 'auto', borderRadius: '20px', }}/>
                     </button>
                 </div>
             </div>
            </div>
        </div>
    );
};

const Basket = () => {

    const [addressInfo, setAddressInfo] = useState<AddressFields | null>(null);


    const handleSubmitAddress = (address: AddressFields) => {
        setAddressInfo(address); // Update the address info state
    };

    const [totalAmount, setTotalAmount] = useState(0);
    const handleUpdateTotal = (newTotal: React.SetStateAction<number>) => {
        setTotalAmount(newTotal);
    };


    const [items, setItems] = useState(itemList.map(item => ({
        ...item,
        name: item.name,
        price: item.price,
        quantity: 0,
        ImageURL: item.ImageURL,
        recurring: '',
        giftWrap: item.giftWrap
    })));

    const onChangeQuantity = (name: string, newQuantity: number) => {
        if (isNaN(newQuantity)) { newQuantity = 0;}
            setItems(prevItems => prevItems.map(item =>
                item.name === name ? {...item, quantity: newQuantity} : item
            ));
    };

    const onRemoveItem = (name: string) => {
        setItems(prevItems => prevItems.filter(item => item.name !== name));
    };

    const onToggleGiftWrap = (name: string) => {
        setItems(prevItems => prevItems.map(item =>
            item.name === name ? { ...item, giftWrap: !item.giftWrap } : item
        ));
    };
    const onChangeRecurring = (name: string, schedule: string) => {
        setItems(prevItems => prevItems.map(item =>
            item.name === name ? { ...item, recurring: schedule } : item
        ));
    };


    const [companyVAT, setCompanyVAT] = useState('');



    return (
        <div className={"page-column"}>
            <div className={"header-top"}>
                <img src={"https://i.imgur.com/J5OAFS3.png"}
                     style={{ width: '120px', height: 'auto', borderRadius: '20px', }}/>
            </div>
        <div className="basket-layout">
            <div className={"basket-items2"}>
                <h2> Your Basket </h2>
                {items.map((item, index) => (
                    <BasketItem
                        key={index}
                        item={item}
                        onChangeQuantity={onChangeQuantity}
                        onRemoveItem={onRemoveItem}
                        onToggleGiftWrap={onToggleGiftWrap}
                        onChangeRecurring={onChangeRecurring}
                    />
                ))}
                {/* Insert the AddressForm here */}
            </div>
            <div className="right-side2">
                <div className="right-side1 special-class">
                    <Total1 items={items} onUpdateTotal={handleUpdateTotal}/>
                </div>
                <div className="right-side1">
                    <h2> Customer information </h2>
                    <AddressForm
                        onCompanyVATChange={setCompanyVAT}
                        onSubmitAddress={handleSubmitAddress}
                    />
                    <h2> Payment</h2>
                    <PaymentForm totalAmount={totalAmount} companyVAT={companyVAT}/>
                </div>
                <div className="right-side1">
                <DeliveryAddress items={items}  addressInfo={addressInfo}  />
                </div>
            </div>
        </div>
        </div>
    );
};

export default Basket;

