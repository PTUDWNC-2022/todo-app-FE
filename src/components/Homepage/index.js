import NavHeader from "../NavHeader";
import {Col, Container, Row, ThemeProvider} from "react-bootstrap";
import TodoList from "../TodoList";
import RightSideBar from "../RightsideBar";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const Homepage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('authInfo')) || null;
        if (user) {
            setUser(user);
        } else {
            navigate('login');
        }
    }, []);

  return (
      <ThemeProvider
          breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}>
          <NavHeader user={user}/>
          <Container fluid>
              <Row>
                  <Col md={4}>{/*<Sidebar />*/}</Col>
                  <Col md={8}>
                      <TodoList />
                  </Col>
              </Row>
              <RightSideBar />
          </Container>
      </ThemeProvider>
  );
}

export default Homepage;