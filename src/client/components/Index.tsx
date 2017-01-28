import * as React from 'react'
import { Layout, Header, Drawer, HeaderRow, Textfield, Navigation, Content } from 'react-mdl';

import EconomyPage from "./planet/EconomyPage";

export default class Index extends React.Component<any, {}> {
  incrementIfOdd = () => {
    if (this.props.value % 2 !== 0) {
      this.props.onIncrement()
    }
  }

  incrementAsync = () => {
    setTimeout(this.props.onIncrement, 1000)
  }

  render() {
    const { store } = this.props;
	const state = store.getState();

    return (
        <Layout>
            <Header waterfall hideTop>
                <HeaderRow title="EOTG > Planet X">

					Game Time: {state.time}

                    <Textfield
                        value=""
                        onChange={() => {}}
                        label="Search"
                        expandable
                        expandableIcon="search"
						style={{display: 'none'}}
                    />
                </HeaderRow>
                <HeaderRow>
                    <Navigation>
                        <a href="">Overview</a>
                        <a href="">Economy</a>
                        <a href="">Government</a>
                        <a href="">Military</a>
                    </Navigation>
                </HeaderRow>
            </Header>
            <Drawer title="Title">
                <Navigation>
                    <a href="">Link</a>
                    <a href="">Link</a>
                    <a href="">Link</a>
                    <a href="">Link</a>
                </Navigation>
            </Drawer>
            <Content>
                <EconomyPage state={state}></EconomyPage>
            </Content>
        </Layout>
    )
  }
}
