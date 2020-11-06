import React from 'react';
import styled from 'styled-components'

export default ({ title, children }) => {
    return <Container>
        <Title>{title}</Title>
        { children }
    </Container>;
}

const Container = styled.div`
    display: inline-block;
    border: 1px solid black;
    font-size: 0.875em;
`;

const Title = styled.h2`
    text-transform: uppercase;
    font-size: 1em;
    margin: 0;
    text-align: center;
`;
