import * as React from 'react'
import { Table, TableHeader } from 'react-mdl';

export default class CommodityPricesTable extends React.Component<any, {}> {
  render() {
    const { state } = this.props;

    return (
		<Table
		    sortable
		    shadow={0}
		    rows={[
		        {material: 'Acrylic (Transparent)', quantity: 25, price: 2.90},
		        {material: 'Plywood (Birch)', quantity: 50, price: 1.25},
		        {material: 'Laminate (Gold on Blue)', quantity: 10, price: 2.35}
		    ]}
		>
		    <TableHeader
		        name="material"
		        sortFn={(a, b, isAsc) => (isAsc ? a : b).match(/\((.*)\)/)[1].localeCompare((isAsc ? b : a).match(/\((.*)\)/)[1])}
		        tooltip="The amazing material name"
		    >
		        Material
		    </TableHeader>
		    <TableHeader
		        numeric
		        name="quantity"
		        tooltip="Number of materials"
		    >
		        Quantity
		    </TableHeader>
		    <TableHeader
		        numeric
		        name="price"
		        cellFormatter={(price) => `\$${price.toFixed(2)}`}
		        tooltip="Price pet unit"
		    >
		        Price
		    </TableHeader>
		</Table>
    )
  }
}
