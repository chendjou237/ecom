import Link from "next/link";

const ReturnPage = async ({searchParams}:{searchParams: Promise<{ session_id: string}> | undefined}) => {
   const session_id = (await searchParams)?.session_id

   if (!session_id){
      return <div>No Session Id found</div>;
   }



   const res = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/${session_id}`)
   const data = await res.json()
   console.log(data)
   return <div className="">
      <div>payment {data.status}</div>
    <div>payment status: {data.paymentStatus}</div>
    <Link href={'/orders'}> See your orders</Link>
      </div>

}

export default ReturnPage;
