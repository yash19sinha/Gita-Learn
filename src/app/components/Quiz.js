import React from 'react'

const Quiz = () => {
    return (
        <>
            <h1 className="mt-4 text-6xl text-orange-500 font-bold text-center shadow-xl ">Quiz</h1>
            <div className="flex justify-center pt-6 pb-6 bg-gray-50 ">
                <div className='grid w-full grid-cols-1 gap-10 p-10 m-5 justify-items-center xl:max-w-screen-xl lg:max-w-screen-lg md:grid-cols-3'>
                    <div className="card w-96 bg-gray-50 shadow-2xl">
                        <div className="card-body">
                            <h2 className="card-title">Quiz title!</h2>
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                            <div className="card-actions justify-end">
                            <button className="btn bg-orange-600 text-white border-none ">Attempt</button>
                            </div>
                        </div>
                    </div>
                    <div className="card w-96 bg-gray-50 shadow-2xl">
                        <div className="card-body">
                            <h2 className="card-title">Quiz title!</h2>
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                            <div className="card-actions justify-end">
                            <button className="btn bg-orange-600 text-white border-none">Attempt</button>
                            </div>
                        </div>
                    </div>
                    <div className="card w-96 bg-gray-50 shadow-2xl">
                        <div className="card-body">
                            <h2 className="card-title">Quiz title!</h2>
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                            <div className="card-actions justify-end">
                                <button className="btn bg-orange-600 text-white border-none">Attempt</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Quiz
