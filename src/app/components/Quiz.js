import React from 'react'

const Quiz = () => {
    return (
        <>
            <h1 className="mt-4 text-6xl font-bold text-center text-orange-500 shadow-xl ">Quiz</h1>
            <div className="flex justify-center pt-6 pb-6 bg-gray-50 ">
                <div className='grid w-full grid-cols-1 gap-10 p-10 m-5 justify-items-center xl:max-w-screen-xl lg:max-w-screen-lg md:grid-cols-3'>
                    <div className="shadow-2xl card w-96 bg-gray-50">
                        <div className="card-body">
                            <h2 className="card-title">Quiz title!</h2>
                            <p>Quiz Number 1</p>
                            <div className="justify-end card-actions">
                            <button className="text-white bg-orange-600 border-none btn ">Attempt</button>
                            </div>
                        </div>
                    </div>
                    <div className="shadow-2xl card w-96 bg-gray-50">
                        <div className="card-body">
                            <h2 className="card-title">Quiz title!</h2>
                            <p>Quiz Number 2</p>
                            <div className="justify-end card-actions">
                            <button className="text-white bg-orange-600 border-none btn">Attempt</button>
                            </div>
                        </div>
                    </div>
                    <div className="shadow-2xl card w-96 bg-gray-50">
                        <div className="card-body">
                            <h2 className="card-title">Quiz title!</h2>
                            <p>Quiz Number 3</p>
                            <div className="justify-end card-actions">
                                <button className="text-white bg-orange-600 border-none btn">Attempt</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Quiz
