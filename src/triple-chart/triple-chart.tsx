import React from 'react';

interface ChartDataModel {
    percentage: number;
    originalValue: number;
}

interface Charts {
    high: ChartDataModel;
    average: ChartDataModel;
    low: ChartDataModel;
    time: number;
}

interface Level {
    levelOne: number;
    levelTwo: number;
    levelThree: number;
}

interface MakeChartVisible {
    high: boolean;
    average: boolean;
    low: boolean;
}

interface ChartsData {
    charts: Charts[];
    makeChartVisible: MakeChartVisible;
    level: Level;
}



export default class TripleChart extends React.Component<ChartsData> {
    state: ChartsData;
    constructor (props: ChartsData) {
        super(props);
        this.state = {
            charts: props.charts,
            makeChartVisible: props.makeChartVisible,
            level: props.level
        };
    }

    componentWillReceiveProps(props: ChartsData) {
        this.setState(props);
    }

    render () {
        return (
            <div className="full-chart-holder">
                {
                    this.state.charts.map(chart => 
                        <div className="full-chart-holder__triple-chart">
                            <div className="full-chart-holder__high-chart" style={{'height': chart.high.percentage + '%',
                                    'visibility': this.state.makeChartVisible.high ? 'visible' : 'hidden'}}>
                                <div className="full-chart-holder__chart-tool-tip" >{chart.high.originalValue}</div>
                            </div>
                            <div className="full-chart-holder__mid-chart" style={{'height': chart.average.percentage + '%',
                                    'visibility': this.state.makeChartVisible.average ? 'visible' : 'hidden'}}>
                                <div className="full-chart-holder__chart-tool-tip" >{chart.average.originalValue}</div>
                            </div>
                            <div className="full-chart-holder__low-chart" style={{'height': chart.low.percentage + '%',
                                    'visibility': this.state.makeChartVisible.low ? 'visible' : 'hidden'}}>
                                 <div className="full-chart-holder__chart-tool-tip" >{chart.low.originalValue}</div>
                            </div>
                            <div className="full-chart-holder__triple-chart-time">
                                {new Date(chart.time * 1000).toLocaleTimeString('en-GB')}
                            </div>
                        </div>
                    )
                }
                <div className="chart-row__top-level">{Math.round(this.state.level.levelThree)}</div>
                <div className="chart-row__mid-level">{Math.round(this.state.level.levelTwo)}</div>
                <div className="chart-row__low-level">{Math.round(this.state.level.levelOne)}</div>
            </div>
        )
    }
}