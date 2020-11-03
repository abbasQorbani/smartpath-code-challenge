import React from 'react';
import './currency-chart.scss';
import axios from 'axios';

interface CurrencyData {
    close: number;
    conversionSymbol: string;
    conversionType: string;
    high: number;
    low: number;
    open: number;
    time: number;
    volumeFrom: number;
    volumeTo: number;
}

interface CurrencyResponseData {
    aggregated: boolean;
    Data: CurrencyData[];
    timeFrom: number;
    timeTo: number;
}

interface CurrencyRequestResponse {
    Data: CurrencyResponseData;
    hasWarning: boolean;
    message: string;
    response: string;
    type: number;
}

interface CollectHighAndLowValues {
    high: number;
    low: number;
    difference: number; 
}

interface Level {
    levelOne: number;
    levelTwo: number;
    levelThree: number;
}

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

interface MakeChartVisible {
    high: boolean;
    average: boolean;
    low: boolean;
}

interface ComponentDataModel {
    collectHighAndLowValues: CollectHighAndLowValues;
    charts: Charts[];
    serverData?: CurrencyRequestResponse;
    level: Level;
    makeChartVisible: MakeChartVisible;
}

export default class CurrencyChart extends React.Component {
    state: ComponentDataModel;
    bulletCounter: number = 1;
    slideCounter: number = 1;
    titleCounter: number = 1;

    constructor (props: {} | Readonly<{}>) {
        super(props)
        this.state = {
            collectHighAndLowValues: {
                high: 0,
                difference: 0,
                low: 0
            },
            level: {
                levelOne: 0,
                levelThree: 0,
                levelTwo: 0
            },
            charts: [
                {
                    average: {originalValue: 0, percentage: 0},
                    high: {percentage: 0, originalValue: 0},
                    low: {originalValue: 0, percentage: 0},
                    time: 0
                }
            ],
            makeChartVisible: {
                average: true,
                high: true,
                low: true
            }
        };
    }

    componentDidMount() {
        document.querySelector('.single-chart-holder__single-chart-parent')?.classList.add('single-chart-holder__single-chart-parent--active');
        document.querySelector('.single-chart-holder__bullet')?.classList.add('single-chart-holder__bullet--active');
        document.querySelector('.single-chart-holder__title-holder')?.classList.add('single-chart-holder__title-holder--active');
        this.getDataFromServer();
    }

    async getDataFromServer() {
        await axios.get<CurrencyRequestResponse>('https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=9')
        .then((response) => {
            this.state.serverData = response.data;
        });
        if(this.state.serverData) {
            this.getMinMaxValue(this.state.serverData.Data.Data);
            this.generateChartsData(this.state.serverData.Data.Data);
        }
        document.querySelectorAll('.single-chart-holder__bullet').forEach(element => {
            element.addEventListener('click', this.makeSlider);
        });
    }

    getMinMaxValue(data: CurrencyData[]): void {
        let sortedHigh: number[] = [],
            sortedLow: number[] = [];
        data.forEach(data => {
            sortedHigh.push(data.high);
            sortedLow.push(data.low);
        });
        sortedHigh = sortedHigh.sort();
        sortedLow = sortedLow.sort();
        this.setState({
            collectHighAndLowValues: {
                high: sortedHigh[sortedHigh.length - 1],
                low: sortedLow[0],
                difference: sortedHigh[sortedHigh.length - 1] - sortedLow[0]
            }
        });
    }

    generateChartsData(data: CurrencyData[]): void {
        let calculateHighPercentage: number = 0,
            calculateAveragePercentage: number = 0,
            calculateLowPercentage: number = 0,
            generatedChartsValue: Charts[] = [];
        data.forEach(data => {
            calculateHighPercentage =  (this.state.collectHighAndLowValues.high - data.high) * 100 / this.state.collectHighAndLowValues.high;
            calculateAveragePercentage = (this.state.collectHighAndLowValues.high - data.open) * 100 / this.state.collectHighAndLowValues.high;
            calculateLowPercentage = (this.state.collectHighAndLowValues.high - data.low) * 100 / this.state.collectHighAndLowValues.high;
            generatedChartsValue.push({
                average: {percentage: 100 - calculateAveragePercentage, originalValue: data.open},
                high:{percentage: 100 - calculateHighPercentage, originalValue: data.high},
                low: {percentage: 100 - calculateLowPercentage, originalValue: data.low},
                time: data.time
            });
        });
        this.setState({
            charts: generatedChartsValue
        })
    }

    makeSlider(event: any) {
        document.querySelectorAll('.single-chart-holder__bullet').forEach(element => {
            element.classList.remove('single-chart-holder__bullet--active');
        });
        document.querySelectorAll('.single-chart-holder__single-chart-parent').forEach(element => {
            element.classList.remove('single-chart-holder__single-chart-parent--active');
            console.log(event);
            console.log(event.target.dataset.index, element.getAttribute('data-index'));
            if (event.target.dataset.index === element.getAttribute('data-index')) {
                element.classList.add('single-chart-holder__single-chart-parent--active');
                event.target.classList.add('single-chart-holder__bullet--active');
            }
        });
        document.querySelectorAll('.single-chart-holder__title-holder').forEach(element => {
            element.classList.remove('single-chart-holder__title-holder--active');
            console.log(event);
            console.log(event.target.dataset.index, element.getAttribute('data-index'));
            if (event.target.dataset.index === element.getAttribute('data-index')) {
                element.classList.add('single-chart-holder__title-holder--active');
            }
        });
    }

    makeChartVisible(type: string) {
        switch(type) { 
            case 'high': {
                this.setState({
                    makeChartVisible: {
                        high: !this.state.makeChartVisible.high,
                        average: this.state.makeChartVisible.average,
                        low: this.state.makeChartVisible.low
                    }
                })
                break; 
            } 
            case 'average': {
                this.setState({
                    makeChartVisible: {
                        high: this.state.makeChartVisible.high,
                        average: !this.state.makeChartVisible.average,
                        low: this.state.makeChartVisible.low
                    }
                })
                break; 
            } 
            case 'low': {
                this.setState({
                    makeChartVisible: {
                        high: this.state.makeChartVisible.high,
                        average: this.state.makeChartVisible.average,
                        low: !this.state.makeChartVisible.low
                    }
                })
                break; 
            } 
            default: { 
                break; 
            } 
        }
    }

    render () {
        return (
            <>
                <section className="chart-holder">
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
                                        {new Date(chart.time).getHours() + ':' + new Date(chart.time).getMinutes() + ':' + new Date(chart.time).getSeconds()}
                                    </div>
                                </div>
                            )
                        }
                        <div className="chart-row__top-level"></div>
                        <div className="chart-row__mid-level"></div>
                        <div className="chart-row__low-level"></div>
                    </div>
                    <div className="single-chart-holder">
                        {
                            this.state.charts.map(chart => 
                                <div className="single-chart-holder__title-holder" data-index={this.titleCounter++}>
                                    <p>Market volume of</p>
                                    <strong>{new Date(chart.time).getHours() + ':' + new Date(chart.time).getMinutes() + ':' + new Date(chart.time).getSeconds()}</strong>
                                </div>
                            )
                        }
                            
                        {
                            this.state.charts.map(chart => 
                                <div className="single-chart-holder__single-chart-parent"
                                     data-index={this.slideCounter++}>
                                    <div className="single-chart-holder__single-chart"
                                         style={{'height': chart.high.percentage + '%'}}>
                                             <div className="single-chart-holder__single-chart-tool-tip">
                                                 {chart.high.originalValue}
                                             </div>
                                         </div>
                                    <div className="chart-row__top-level"></div>
                                    <div className="chart-row__mid-level"></div>
                                    <div className="chart-row__low-level"></div>
                                </div>
                            )
                        }
                        <div className="single-chart-holder__bullet-holder">
                        {   
                            this.state.charts.map(chart => 
                                <div className="single-chart-holder__bullet"
                                     data-index={this.bulletCounter++}></div>
                            )
                        }
                        </div>
                    </div>
                </section>
                <section className="options-information-holder">
                    <div className="options-holder">
                        <div className="options-holder__title">
                            <strong>Indexes</strong>
                        </div>
                        <div className="options-holder__check-box-holder">
                            <input id="higher" className="options-holder__check-box" type="checkbox" name="" defaultChecked={this.state.makeChartVisible.high}/>
                            <label className="options-holder__check-box-label higher" htmlFor="higher" onClick={e => this.makeChartVisible('high')}>
                                Higher
                            </label>
                        </div>
                        <div className="options-holder__check-box-holder">
                            <input id="average" className="options-holder__check-box" type="checkbox" name="" defaultChecked={this.state.makeChartVisible.average}/>
                            <label className="options-holder__check-box-label average" htmlFor="average" onClick={e => this.makeChartVisible('average')}>
                                Average
                            </label>
                        </div>
                        <div className="options-holder__check-box-holder">
                            <input id="lower" className="options-holder__check-box" type="checkbox" name="" defaultChecked={this.state.makeChartVisible.low}/>
                            <label className="options-holder__check-box-label lower" htmlFor="lower" onClick={e => this.makeChartVisible('low')}>
                                Lower
                            </label>
                        </div>
                    </div>
                    <div className="information-holder">
                        <div className="information-holder__maximum">
                            <p>Maximum range:</p>
                            <strong>{this.state.collectHighAndLowValues.high}</strong>
                        </div>
                        <div className="information-holder__minimum">
                            <p>Minimum range:</p>
                            <strong>{this.state.collectHighAndLowValues.low}</strong>
                        </div>
                    </div>
                </section>
            </>
        )
    }
}

