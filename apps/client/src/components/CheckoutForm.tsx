'use client'
import { ShippingFormInputs } from '@repo/types';
import { PaymentElement } from '@stripe/react-stripe-js/checkout';
import {useCheckout} from '@stripe/react-stripe-js/checkout';
import { ConfirmError } from '@stripe/stripe-js';
import { useState } from 'react';
import ShippingForm from './ShippingForm';


export const  CheckoutForm = ({shippingForm}:{shippingForm:ShippingFormInputs}) => {
  const checkoutState = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ConfirmError | null>(null)
     //   const checkoutState = useCheckout();
    if (checkoutState.type === 'loading') {
    return (
      <div>Loading...</div>
    );
  } else if (checkoutState.type === 'error') {
    return (
      <div>Error: {checkoutState.error.message}</div>
    );
  }


const handleClick = async() => {
   setLoading(true);

if (checkoutState.type === 'success') {
    const {updateEmail, updateShippingAddress,} = checkoutState.checkout;
    updateEmail(shippingForm.email);
    updateShippingAddress({
     name: 'shipping_address',
      address: {
        line1: shippingForm.address,
        city: shippingForm.city,
        country: 'US',
      }
     });
       checkoutState.checkout.confirm(
         {email: shippingForm.email}
       ).then((result) => {
         console.log('result from confirm, ', result);
         if (result.type === 'error') {
           setError(result.error)
         }
         setLoading(false);
       })



//      const res = await confirm();
         //  setLoading(false);

//   if(res.type === "error"){
//       console.log('error from res.confirm,', res.error);

//      setError(res.error);
   //   setLoading(false);

  }

  // }
}

      return (
<div className="">
         <form >
         <PaymentElement options={{layout: 'accordion'}} />

        </form>
         <button onClick={handleClick} disabled={loading} >

            {loading ? 'loading ...': 'Pay'}
         </button>
         {error && <div className=''>{error.message}</div>}
</div>
      );

};
