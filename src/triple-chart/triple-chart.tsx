import React from 'react';

interface ChartLevels {
    levelOne: number;
    levelTwo: number;
    levelThree: number;
}

interface ChartData {
    percentage: number;
    originalValue: number;
}

interface Charts {
    high: ChartData;
    average: ChartData;
    low: ChartData;
    time: number;
    sliderCounter: number;
}

interface ChartsDataModel {
    charts: Charts[];
    level: ChartLevels;
    makeChartVisible: MakeChartVisible;
}

interface MakeChartVisible {
    high: boolean;
    average: boolean;
    low: boolean;
}



export default class TripleChart extends React.Component<ChartsDataModel> {
    state: ChartsDataModel;
    constructor (props: ChartsDataModel) {
        super(props);
        this.state = {
            charts: props.charts,
            makeChartVisible: props.makeChartVisible,
            level: props.level
        };
    }

    componentWillReceiveProps(props: ChartsDataModel) {
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