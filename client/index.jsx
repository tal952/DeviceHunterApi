import React from 'react';
import {render} from 'react-dom';
const _ = require('lodash');

const Table = require('babel!svg-react!./svgs/Table.svg');
const TableSelected = require('babel!svg-react!./svgs/TableSelected.svg');
const axios = require('axios');
const Select = require('react-select');

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 'Select...',
            modelToBeaconId: {
                'Select...': []
            }
        };
    }

    update() {
        axios.get('/api/metrics')
            .then(response => {
                this.setState({
                    modelToBeaconId: _.groupBy(response.data, 'model')
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    componentWillMount() {
        this.update();
        setInterval(()=> {
            this.update()
        }, 5000);

    }

    renderTable(deg, beaconId) {
        deg = deg || 0;
        const isSelected = _.filter(this.state.modelToBeaconId[this.state.value.value], x=>x.beaconId === beaconId).length !== 0;

        return (
            <div style={{width: 100, height: 100, transform: 'rotate(' + deg + 'deg)'}}>
                {isSelected ? <TableSelected/> : <Table />}
            </div>
        );
    }

    renderTableGroup(deg, beaconId) {
        deg = deg || 0;
        return (
            <div style={{transform: 'rotate(' + deg + 'deg)', display: 'flex'}}>
                <div>
                    {this.renderTable(180, beaconId)}
                    {this.renderTable(0, beaconId)}
                </div>
                <div>
                    {this.renderTable(180, beaconId)}
                    {this.renderTable(0, beaconId)}
                </div>
            </div>
        );
    }

    render() {
        const options = [];

        for (var model in this.state.modelToBeaconId) {
            options.push({value: model, label: model});
        }

        return (
            <div>
                <Select
                    name="form-field-name"
                    value={this.state.value || 'Select...'}
                    options={options}
                    onChange={x=>this.setState({
                        value: x
                    })}
                />

                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        {this.renderTable(270, '')}
                        {this.renderTable(270, '')}
                    </div>

                    {this.renderTableGroup(90, 'd0d3fa86-ca76-45ec-9bd9-6af46bc823fd:26522:34031')}
                    {this.renderTableGroup(90, 'd0d3fa86-ca76-45ec-9bd9-6af48cc7d174:55540:55062')}
                    {this.renderTableGroup(90, 'd0d3fa86-ca76-45ec-9bd9-6af4253cc218:39293:28763')}
                    {this.renderTableGroup(90, 'd0d3fa86-ca76-45ec-9bd9-6af4e9ca3442:46780:27550')}

                    <div>
                        {this.renderTable(90, 'd0d3fa86-ca76-45ec-9bd9-6af4e3d52107:6055:33253')}
                        {this.renderTable(90, 'd0d3fa86-ca76-45ec-9bd9-6af4e3d52107:6055:33253')}
                    </div>
                </div>
                <br/>
                <br/>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        {this.renderTableGroup(0, 'd0d3fa86-ca76-45ec-9bd9-6af4d6bc627e:16078:677')}
                        {this.renderTableGroup(0, 'd0d3fa86-ca76-45ec-9bd9-6af42173cdf9:61591:42416')}
                        {this.renderTableGroup(0, '')}
                    </div>
                    <div style={{display: 'flex', alignItems: 'flex-end'}}>
                        {this.renderTable(180, 'd0d3fa86-ca76-45ec-9bd9-6af40ee8a5a8:23615:61519')}
                    </div>
                    <div>
                        {this.renderTableGroup(0, 'd0d3fa86-ca76-45ec-9bd9-6af48da8abbd:53369:26809')}
                        {this.renderTableGroup(0, 'd0d3fa86-ca76-45ec-9bd9-6af497465273:33061:34225')}
                        {this.renderTableGroup(0, '')}
                    </div>
                </div>
            </div>
        );
    }
}

render(<App/>, document.getElementById('app'));