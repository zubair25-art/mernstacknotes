import { Button } from "react-bootstrap";
import React from "react";

interface NarBarLoggedOutViewProps {
    onSignUpClicked: () => void,
    onLoginClicked: ()=> void, 
}

const NarBarLoggedOutView = ({onSignUpClicked, onLoginClicked}: NarBarLoggedOutViewProps) => {
    return ( 
        <>
            <Button onClick={onSignUpClicked}>Sign Up</Button>
            <Button onClick={onLoginClicked}>Log In</Button>
        </>
     );
}
 
export default NarBarLoggedOutView;