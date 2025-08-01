import { Container, Nav, Navbar } from "react-bootstrap";
import React from "react";
import { User } from "../models/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { Link } from "react-router-dom";

interface NavBarProps {
    loggedInUser: User | null,
    onSignUpClicked: () =>  void,
    onLogInClicked: () => void,
    onLogoutSuccessful: () => void,
}

const NavBar = ({loggedInUser, onSignUpClicked, onLogInClicked, onLogoutSuccessful}: NavBarProps) => {
    return ( 
        <Navbar bg="primary" variant="dark" expand="sm" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Notes App
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav>
                        <Nav.Link as={Link} to="/privacy">
                            Privacy
                        </Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        { loggedInUser
                        ? <NavBarLoggedInView user={loggedInUser} onLogoutSuccessful={onLogoutSuccessful} />
                        : <NavBarLoggedOutView onLoginClicked={onLogInClicked} onSignUpClicked={onSignUpClicked} />
                        }
                    </Nav>
                </Navbar.Collapse>    
            </Container>
        </Navbar>
     );
}
 
export default NavBar;