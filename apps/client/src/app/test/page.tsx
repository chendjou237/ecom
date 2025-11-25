import { auth } from '@clerk/nextjs/server';
import React from 'react'

export default async function TestPage() {
   const {getToken} = await auth()
   const token = await getToken();

   // const resPayment = await fetch("http://localhost:8002/test", {
   //    headers: {
   //       Authorization: `Bearer ${token}`
   //    }
   // });
   // const dataPayment = await resPayment.json()

   // console.log(dataPayment);
   // const resOrder = await fetch("http://localhost:8001/test", {
   //    headers: {
   //       Authorization: `Bearer ${token}`
   //    }
   // });
   // const dataOrder = await resOrder.json()

   // console.log(dataOrder);
   // const resProduct = await fetch("http://localhost:8000/test", {
   //    headers: {
   //       Authorization: `Bearer ${token}`
   //    }
   // });
   // const dataProduct = await resProduct.json()

   console.log(token);

  return (
    <div>Test Page fucker</div>
  )
}
