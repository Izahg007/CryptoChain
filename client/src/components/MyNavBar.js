import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link} from 'react-router-dom';

class MyNav extends Component {

  render() {
    return (
      <>
        <Navbar bg="primary" variant="dark">
          <Container>
            <Navbar.Brand as={Link} to='/'>GCOIN</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link as={Link} to='/'>Home</Nav.Link>
              <Nav.Link as={Link} to='/conductTx'>Transact</Nav.Link>
              <Nav.Link as={Link} to='/mine'>Mine</Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <br />

      </>
    );
  }
}

export default MyNav;