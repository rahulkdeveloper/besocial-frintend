import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux';
import {setShowAlert} from "../features/alert/AlertSlice"

const AnimationAlert = () => {

    const {showAlert,message,variant,duration} = useSelector(state=>state.alert);
    const dispatch = useDispatch();


    useEffect(()=>{
        const timer = setTimeout(() => {
           dispatch(setShowAlert({alert:false}))
        }, duration);

        return ()=>clearTimeout(timer)

    },[dispatch,message,showAlert,duration])

    return (
        <div className='' style={{position:"absolute",right:0,top:10,width:"20%",zIndex:1}}>
            <AnimatePresence>
            {showAlert && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.5 }}
                >
                    <Alert variant={variant} onClose={()=>dispatch(setShowAlert({alert:false}))} dismissible>
                        {message}
                    </Alert>

                </motion.div>
            )}
        </AnimatePresence>
        </div>
    )
}

export default AnimationAlert