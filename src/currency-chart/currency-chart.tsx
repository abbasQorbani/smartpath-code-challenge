import React from 'react';
import './currency-chart.scss';
import axios from 'axios';
import TripleChart from '../triple-chart/triple-chart';
import SingleChart from '../single-chart/single-chart';
import ChartControler from '../chart-controler/chart-controler';
// import CurrencyRange from '../currency-range/currency-range';

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
    sliderCounter: number;
}

interface ChartsData {
    charts: Charts[];
    level: Level;
}

interface MakeChartVisible {
    high: boolean;
    average: boolean;
    low: boolean;
}

interface ComponentDataModel {
    collectHighAndLowValues: CollectHighAndLowValues;
    charts: ChartsData;
    serverData?: CurrencyData[];
    makeChartVisible: MakeChartVisible;
    userSession: boolean;
}

export default class CurrencyChart extends React.Component {
    state: ComponentDataModel;
    constructor (props: {} | Readonly<{}>) {
        super(props)
        this.state = {
            collectHighAndLowValues: {
                high: 0,
                difference: 0,
                low: 0
            },
            charts: {
                charts: [],
                level: {
                    levelOne: 0,
                    levelThree: 0,
                    levelTwo: 0
                }
            },
            makeChartVisible: {
                average: true,
                high: true,
                low: true
            },
            userSession: false
        };
    }

    componentDidMount() {
        document.querySelector('.single-chart-holder__bullet')?.classList.add('single-chart-holder__bullet--active');
        let checkedSession = this.checkUserSession();
        if (checkedSession) {
            this.getDataFromServer();
        } else {
            this.setState({
                ...this.state,
                charts: {
                    charts: JSON.parse(String(localStorage.getItem('chart'))),
                    level: JSON.parse(String(localStorage.getItem('level')))
                },
                collectHighAndLowValues: JSON.parse(String(localStorage.getItem('highAndLow')))
            })
        }
    }

    async getDataFromServer() {
        await axios.get<CurrencyRequestResponse>('https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=9')
        .then((response) => {
            this.state.serverData = response.data.Data.Data;
        });
        if(this.state.serverData) {
            this.getMinMaxValue(this.state.serverData);
            this.generateChartsData(this.state.serverData);
            this.findTolerance(this.state.serverData);
        }
    }

    checkUserSession(): boolean {
        let getDate = new Date();
        let getTime = getDate.getTime();
        getTime += 3600 * 1000;
        if (new Date(document.cookie).getTime() < new Date().getTime()) {
            getDate.setTime(getTime);
            document.cookie = getDate.toLocaleString();
            localStorage.clear();
            this.setState({
                ...this.state,
                userSession: false
            })
            return true;
        } else if (!document.cookie) {
            getDate.setTime(getTime);
            document.cookie = getDate.toLocaleString();
            localStorage.clear();
            this.setState({
                ...this.state,
                userSession: false
            })
            return true;
        } else {
            this.setState({
                ...this.state,
                userSession: true
            })
            return false;
        }
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
            ...this.state,
            collectHighAndLowValues: {
                high: sortedHigh[sortedHigh.length - 1],
                low: sortedLow[0],
                difference: sortedHigh[sortedHigh.length - 1] - sortedLow[0]
            },
            charts: {
                charts: this.state.charts.charts,
                level: {
                    levelOne: (sortedHigh[sortedHigh.length - 1] * 25) / 100,
                    levelTwo: (sortedHigh[sortedHigh.length - 1] * 50) / 100,
                    levelThree: (sortedHigh[sortedHigh.length - 1] * 75) / 100
                }
            }
        });
        ;
        if (!this.state.userSession) {
            localStorage.setItem('level', JSON.stringify(this.state.charts.level));
            localStorage.setItem('highAndLow', JSON.stringify(this.state.collectHighAndLowValues));
        }
    }

    findTolerance(data: CurrencyData[]): void {
        data.forEach(e => {
            console.log(e);
        })

    }

    generateChartsData(data: CurrencyData[]): void {
        let calculateHighPercentage: number = 0,
            calculateAveragePercentage: number = 0,
            calculateLowPercentage: number = 0,
            generatedChartsValue: Charts[] = [],
            sliderCounter: number = 0;
        data.forEach(data => {
            sliderCounter++;
            calculateHighPercentage =  (this.state.collectHighAndLowValues.high - data.high) * 100 / this.state.collectHighAndLowValues.high;
            calculateAveragePercentage = (this.state.collectHighAndLowValues.high - ((data.high + data.low) / 2)) * 100 / this.state.collectHighAndLowValues.high;
            calculateLowPercentage = (this.state.collectHighAndLowValues.high - data.low) * 100 / this.state.collectHighAndLowValues.high;
            generatedChartsValue.push({
                average: {percentage: 100 - calculateAveragePercentage, originalValue: ((data.high + data.low) / 2)},
                high:{percentage: 100 - calculateHighPercentage, originalValue: data.high},
                low: {percentage: 100 - calculateLowPercentage, originalValue: data.low},
                time: data.time,
                sliderCounter: sliderCounter
            });
        });
        if (!this.state.userSession) {
            localStorage.setItem('chart', JSON.stringify(generatedChartsValue));
        }
        this.setState({
            ...this.state,
            charts: {
                charts: generatedChartsValue,
                level: this.state.charts.level
            }
        })
    }

    makeChartVisible(type: string): void {
        switch(type) { 
            case 'high': {
                this.setState({
                    ...this.state,
                    makeChartVisible: {
                        high: !this.state.makeChartVisible.high,
                        average: this.state.makeChartVisible.average,
                        low: this.state.makeChartVisible.low
                    }
                });
                break; 
            } 
            case 'average': {
                this.setState({
                    ...this.state,
                    makeChartVisible: {
                        high: this.state.makeChartVisible.high,
                        average: !this.state.makeChartVisible.average,
                        low: this.state.makeChartVisible.low
                    }
                });
                break; 
            } 
            case 'low': {
                this.setState({
                    ...this.state,
                    makeChartVisible: {
                        high: this.state.makeChartVisible.high,
                        average: this.state.makeChartVisible.average,
                        low: !this.state.makeChartVisible.low
                    }
                });
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
                        <TripleChart charts={this.state.charts.charts} level={this.state.charts.level} makeChartVisible={this.state.makeChartVisible}/>
                        <SingleChart charts={this.state.charts.charts} level={this.state.charts.level} />
                </section>
                <section className="options-information-holder">
                    <ChartControler average={this.state.makeChartVisible.average}
                                    high={this.state.makeChartVisible.high}
                                    low={this.state.makeChartVisible.low}
                                    click={this.makeChartVisible.bind(this)}/>
                    {/* <CurrencyRange  /> */}
                </section>
            </>
        )
    }
}

