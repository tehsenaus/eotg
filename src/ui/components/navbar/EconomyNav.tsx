import React from 'react';
import styled from 'styled-components'

import SparkLine from '../vis/SparkLine';
import NavWidget from './NavWidget';

export default () => {
    return <NavWidget title="Economy">
        <Container>
            <GdpSparkLine />
            <Amount>12bn</Amount>
            <Label>GDP</Label>
        </Container>
    </NavWidget>;
}

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 4em;
    grid-template-rows: max-content max-content;
    grid-template-areas:
        "sparkline amount"
        "sparkline label";
`;

const GdpSparkLine = styled(({ className }) => {
    return <div className={className}>
        <SparkLine width={160} height={60} />
    </div>;
})`
    grid-area: sparkline;
`;

const Amount = styled.p`
    grid-area: amount;
    font-size: 1.125em;
    margin: 0.5em 0;
`;

const Label = styled.p`
    grid-area: label;
    font-size: 0.8em;
    margin: 0;
    margin-bottom: 0.25em;
`;
