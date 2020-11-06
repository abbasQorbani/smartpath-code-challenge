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
}



export default class SingleChart extends React.Component<ChartsDataModel> {
    state: ChartsDataModel;
    constructor (props: ChartsDataModel) {
        super(props);
        this.state = {
            charts: props.charts,
            level: props.level
        };
    }

    componentDidUpdate() {
        document.querySelectorAll('.single-chart-holder__bullet').forEach(element => {
            element.addEventListener('click', this.singleChartSlider);
        });
    }

    componentWillReceiveProps(props: ChartsDataModel) {
        this.setState(props);
    }

    singleChartSlider(event: any): void {
        document.querySelectorAll('.single-chart-holder__bullet').forEach(element => {
            element.classList.remove('single-chart-holder__bullet--active');
        });
        document.querySelectorAll('.single-chart-holder__single-chart-parent').forEach(element => {
            element.classList.remove('single-chart-holder__single-chart-parent--active');
            if (event.target.dataset.index === element.getAttribute('data-index')) {
                element.classList.add('single-chart-holder__single-chart-parent--active');
                event.target.classList.add('single-chart-holder__bullet--active');
            }
        });
        document.querySelectorAll('.single-chart-holder__title-holder').forEach(element => {
            element.classList.remove('single-chart-holder__title-holder--active');
            if (event.target.dataset.index === element.getAttribute('data-index')) {
                element.classList.add('single-chart-holder__title-holder--active');
            }
        });
    }

    render () {
        return (
            <div className="single-chart-holder">
                {
                    this.state.charts.map(chart => 
                        <>
                        <div className={`single-chart-holder__title-holder ${chart.sliderCounter === 1 ? 'single-chart-holder__title-holder--active' : ''}`} data-index={chart.sliderCounter}>
                            <p>Market volume of</p>
                            <strong>{new Date(chart.time * 1000).toLocaleTimeString('en-GB')}</strong>
                        </div>
                        <div className={`single-chart-holder__single-chart-parent ${chart.sliderCounter === 1 ? 'single-chart-holder__single-chart-parent--active' : ''}`}
                            data-index={chart.sliderCounter}>
                            <div className="single-chart-holder__single-chart"
                                style={{'height': chart.high.percentage + '%'}}>
                                <div className="single-chart-holder__single-chart-tool-tip">
                                    {chart.high.originalValue}
                                </div>
                            </div>
                            <div className="chart-row__top-level">{Math.round(this.state.level.levelThree)}</div>
                            <div className="chart-row__mid-level">{Math.round(this.state.level.levelTwo)}</div>
                            <div className="chart-row__low-level">{Math.round(this.state.level.levelOne)}</div>
                        </div>
                        </>
                    )
                }
                <div className="single-chart-holder__bullet-holder">
                    {
                        this.state.charts.map(chart =>
                            <div className={`single-chart-holder__bullet ${chart.sliderCounter === 1 ? 'single-chart-holder__bullet--active' : ''}`}
                                data-index={chart.sliderCounter}>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}