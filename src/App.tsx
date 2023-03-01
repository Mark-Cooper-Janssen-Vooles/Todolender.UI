import React, {useEffect} from 'react';
import Landing from "./components/Landing/Landing";
import TodolenderHome from "./components/TodolenderHome/TodolenderHome";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./redux/store";
import { getCookie } from "./redux/getCookie";
import { tryGetUserAndPlanReminderInfo } from "./redux/reducers/userSlice";

const App = () => {
    const loggedIn = useSelector((state: RootState) => state.user.loggedIn)
    const dispatch = useDispatch()

    const checkIfLoggedIn = () => {
        // check if cookie is present
        const authCookieEmpty = getCookie("Authorization").trim() === ""
        const userIdCookieEmpty = getCookie("UserId").trim() === ""
        if (authCookieEmpty || userIdCookieEmpty) {
            return;
        }

        // if present, get user and planReminder state and set loggedIn to true
        dispatch(tryGetUserAndPlanReminderInfo())
    }

    useEffect(() => {
      checkIfLoggedIn()
    }, [])

    return (
        <div>
            { !loggedIn && <Landing /> }
            { loggedIn && <TodolenderHome />}
        </div>
    );
}

export default App;
