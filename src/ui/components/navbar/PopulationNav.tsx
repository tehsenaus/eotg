import React from 'react';
import styled from 'styled-components'
import {sum} from 'd3-array';

import { Populace } from '../../../common/behaviours/populace';

import SparkLine from '../vis/SparkLine';
import NavWidget from './NavWidget';

interface PopulationNavProps {
    populaces: Populace [];
}

export default ({ populaces }: PopulationNavProps) => {
    const population = sum(populaces, populace => populace.population);
    return <NavWidget title="Population">
        <Container>
            <GdpSparkLine />
            <Amount>{~~population}</Amount>
            <Label>pop.</Label>
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
