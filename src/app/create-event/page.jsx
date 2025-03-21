import React from 'react'
import Link from 'next/link';
import { BsArrowRight } from 'react-icons/bs'
import EventForm from '@/components/EventForm';

export default function Event() {
    return (
        <div className='h-screen'>
            <div className="grid mb-0 pt-5 pb-5 mt-0 md:mb-10 md:grid-cols-2 ">
                <figure className="flex flex-col pt-10 ">
                    <div className="text-left align-left w-[750px] p-8 pl-[100px]">
                        <div className="mb-2  bg-gradient-to-r from-[#fff] via-[#fff]/80 to-[#9d9ea1]/50 bg-clip-text 
                            text-transparent font-bold font-Agda text-[80px] uppercase md:max-w-5xl max-w-[650px]">
                            Create Your Event</div>
                        <p className='text-white pb-10'>
                            Create your own Event for Game Streaming.
                            <br />
                        </p>
                        <Link href="/events"
                            className="inline-flex align-left items-center relative text-lg px-8 py-3 bg-white  mr-5 uppercase font-Agda font-bold text-b hover:bg-[#f0f0f0] cursor-pointer" >
                            Already Created Your Event
                            <BsArrowRight className=' ml-2' />
                        </Link>
                    </div>
                </figure>

                <figure className="flex flex-col items-center justify-center">
                    <div className="text-center px-[50px] align-middle w-[600px] h-[600px] bg-[#000000] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <EventForm />
                    </div>
                </figure>

            </div>
        </div>
    )
}
