
'use client'

import { loadStripe } from "@stripe/stripe-js"
import {CheckoutProvider} from '@stripe/react-stripe-js/checkout';
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { CartItemsType, ShippingFormInputs } from "@repo/types";
import { CheckoutForm } from "./CheckoutForm";
import useCartStore from "@/stores/cartStore";

const stripe = loadStripe(
   "pk_test_51SWIyEHvbRIpSBiQa4YZwkOLpSsGZbM3426fgzzkzx9dgsIDrVY9uY06zMPl6J38iZW89tTk19px7peOtJh9D2Gb007G5VpRua"
);


const fetchClientSecret = async (cart:CartItemsType, token:string) => {
   return fetch(`${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
      {method: 'POST',
         body: JSON.stringify({
         cart,
      }),

         headers:{
         "Authorization": `Bearer ${token}`,
         "Content-Type": "application/json",
      }})
     .then((response) => response.json())
     .then((json) => json.checkoutSessionClientSecret);

}

  export default function StripePaymentForm({shippingForm}:{shippingForm:ShippingFormInputs}) {
   const {cart} = useCartStore()
   const [token, setToken] = useState<string | null>(null);
const {getToken} = useAuth();

useEffect(() => {
   getToken().then((token) => {
     console.log("token: ", token)
    setToken(token);
  });
}, []);

if(!token) return <div>Loading . . .</div>;
  return (
       <CheckoutProvider
      stripe={stripe}
      options={{clientSecret:  fetchClientSecret(cart, token) }}
    >
      <CheckoutForm shippingForm={shippingForm}/>
    </CheckoutProvider>
  )
}
