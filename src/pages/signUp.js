import React from "react";

const signUp = () => {
    return (
        <>
            <h1 className="font-mono text-3xl font-bold text-blue-600"> Sign up!!</h1>
            <form>
                <label htmlFor="email"> Email </label>
                <input id="email"type="text" placeholder="Enter Email"></input>
                <label htmlFor="username"> Username </label>
                <input id="username" type="text" placeholder="Enter Username"></input>
                <label htmlFor="name"> Name </label>
                <input id="name" type="text" placeholder="Enter Name"></input>
                <label htmlFor="password"> Password </label>
                <input id="password" type="password" placeholder="Enter Password"></input>
                <label htmlFor="confirmPassword"> Confirm Password </label>
                <input id="confirmPassword" type="password" placeholder="Confirm your Password"></input>
                <button className="!bg-blue-500 text-white p-2 !rounded hover:bg-blue-700 !bg-blue-500">
                    Submit
                </button>
            </form>
        </>
    )
}

export default signUp