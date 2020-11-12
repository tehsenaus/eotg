import React from 'react';
import styled from 'styled-components'

import SparkLine from '../vis/SparkLine';
import NavWidget from './NavWidget';

export default () => {
    return <NavWidget title="Markets">
        <Container>
            <div style={{ gridArea: "up" }}>
                <MarketResource gridArea="up1" resourceId="steel" />
                <MarketResource gridArea="up2" resourceId="wood" />
            </div>
            <Divider />
            <div style={{ gridArea: "down" }}>
                <MarketResource gridArea="up1" resourceId="steel" />
                <MarketResource gridArea="up2" resourceId="wood" />
            </div>
        </Container>
    </NavWidget>;
}

const Container = styled.div`
    display: grid;
    width: 16em;
    grid-template-columns: 1fr 0.5em 1fr;
    grid-template-rows: max-content;
    grid-template-areas:
        "up divider down";
`;

const MarketResource = styled(({ className, gridArea, resourceId }) => {
    return <div className={className} style={{ gridArea }}>
        <ResourceIcon title={resourceId}>{ resourceId.slice(0, 2) }</ResourceIcon>
        <Amount>12.2</Amount>
        <Change>0.2%</Change>
    </div>;
})`
    margin: 0.25em 0;
    whitespace: no-wrap;
`;

const Divider = styled.div`
    grid-area: divider;
    background: gray;
    width: 2px;
    margin: 0.5em 0;
`;

const ResourceIcon = styled.span`
    display: inline-block;
    background: brown;
    width: 2em;
    height: 1.5em;
    text-transform: uppercase;
`;

const Amount = styled.span`
    display: inline-block;
    width: 3em;
`;

const Change = styled.span`
    display: inline-block;
    width: 2.5em;
`;
