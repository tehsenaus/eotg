import * as React from 'react'
import { Grid, Cell } from 'react-mdl';

import CommodityPricesTable from "./CommodityPricesTable";

export default class EconomyPage extends React.Component<any, {}> {
  render() {
    const { state } = this.props;

    return (
		<Grid className="demo-grid-1">
	        <Cell col={4}>
				<CommodityPricesTable></CommodityPricesTable>
			</Cell>
	        <Cell col={4}>4</Cell>
	        <Cell col={4}>4</Cell>
	    </Grid>
    )
  }
}
