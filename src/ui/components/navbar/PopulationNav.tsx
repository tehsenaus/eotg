import React from 'react';
import styled from 'styled-components'
import {sum} from 'd3-array';

import { Populace } from '../../../common/behaviours/populace';

import SparkLine from '../vis/SparkLine';
import NavWidget from './NavWidget';
import { Selector, useSelector } from 'react-redux';
import { State } from '../../../app/store';
import { GameState } from '../../../common/eotg';

interface PopulationNavProps {
    populacesSelector: Selector<GameState, Populace []>;
}

export default ({ populacesSelector }: PopulationNavProps) => {
    const populaces = useSelector<State, Populace []>(state => populacesSelector(state.gameState));
    const population = getPopulation(populaces);

    const populationHistory = useSelector<State, number []>(state =>
        state.gameStateHistory.map(gameState => getPopulation(populacesSelector(gameState)))
    );

    return <NavWidget title="Population">
        <Container>
            <GdpSparkLine values={populationHistory}/>
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

const GdpSparkLine = styled(({ className, values }) => {
    return <div className={className}>
        <SparkLine width={160} height={60} values={values} />
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

function getPopulation(populaces) {
    return sum(populaces, populace => populace.population);
}
