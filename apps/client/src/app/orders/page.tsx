import { auth } from '@clerk/nextjs/server';
import { OrderType } from '@repo/types';
import React from 'react'

const fetchOrders = async () => {
   const {getToken} = await auth();
   const token = await getToken();
   const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/user-orders`, {
      headers:{
         Authorization: `Bearer ${token}`
      }
   });
  const data:OrderType[] = await res.json();
   return data;
}

export default async function OrdersPage() {

   const orders = await fetchOrders();
   if(!orders){
      return <div>No orders found</div>
   }
   console.log(orders);
  return (
    <div className='flex flex-col  items-center justify-center mt-12'>
      <h1 className='text-2xl font-medium mb-4'>Your Orders</h1>
      <ul>
         {orders.map((order) => (
            <li key={order._id} className='flex items-center mb-4 space-x-4 w-full'>
              <div className=''>
               <span className='font-medium text-sm text-gray-500'>Order ID</span>
                <p>{order._id}</p>
              </div>
              <div className=''>
               <span className='font-medium text-sm text-gray-500'>Total</span>
                <p>{order.amount / 100}</p>
              </div>
              <div className=''>
               <span className='font-medium text-sm text-gray-500'>Status</span>
                <p>{order.status}</p>
              </div>
              <div className=''>
               <span className='font-medium text-sm text-gray-500'>Date</span>
                <p>{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US") : "-"}</p>
              </div>
              <div className=''>
               <span className='font-medium text-sm text-gray-500'>Products</span>
                <p>{order.products.map(product => product.name).join(", ") || "-"}</p>
              </div>
            </li>
         ))}
      </ul>
      </div>
  )
}
