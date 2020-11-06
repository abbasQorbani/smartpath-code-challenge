import React from 'react';
import './currency-chart-generator.scss';
import axios from 'axios';
import TripleChart from '../triple-chart/triple-chart';
import SingleChart from '../single-chart/single-chart';
import ChartControler from '../chart-controler/chart-controler';
import CurrencyRange from '../currency-range/currency-range';

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

interface ServerResponseData {
    aggregated: boolean;
    Data: CurrencyData[];
    timeFrom: number;
    timeTo: number;
}

interface ServerRequestResponse {
    Data: ServerResponseData;
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

interface MakeChartVisible {
    high: boolean;
    average: boolean;
    low: boolean;
}

interface ToleranceData {
    time1: string;
    time2: string;
}

interface ToleranceDataModel {
    max: ToleranceData;
    min: ToleranceData;
}

interface GeneratorDataModel {
    collectHighAndLowValues: CollectHighAndLowValues;
    charts: ChartsDataModel;
    serverData?: CurrencyData[];
    makeChartVisible: MakeChartVisible;
    userSession: boolean;
    ToleranceData: ToleranceDataModel;
}

export default class CurrencyChartGenerator extends React.Component {
    state: GeneratorDataModel;
    constructor (props: GeneratorDataModel) {
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
            ToleranceData: {
                max: {time1: '', time2: ''},
                min: {time1: '', time2: ''}
            },
            userSession: false
        };
    }

    componentDidMount() {
        let checkedSession = this.makeUserSession();
        if (checkedSession) {
            this.getChartsDataFromServer();
        } else {
            this.setState({
                ...this.state,
                charts: {
                    charts: JSON.parse(String(localStorage.getItem('chart'))),
                    level: JSON.parse(String(localStorage.getItem('level')))
                },
                collectHighAndLowValues: JSON.parse(String(localStorage.getItem('highAndLow'))),
                ToleranceData: JSON.parse(String(localStorage.getItem('tolerance')))
            })
        }
    }

    async getChartsDataFromServer() {
        await axios.get<ServerRequestResponse>('https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=9')
        .then((response) => {
            this.state.serverData = response.data.Data.Data;
        });
        if(this.state.serverData) {
            this.generateMinMaxValue(this.state.serverData);
            this.generateChartsData(this.state.serverData);
            this.setToleranceData(this.state.serverData);
        }
    }

    makeUserSession(): boolean {
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

    generateMinMaxValue(data: CurrencyData[]): void {
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
                ...this.state.charts,
                charts: generatedChartsValue
            }
        })
    }

    setToleranceData(serverDAta: CurrencyData[]): void {
        debugger;
        if (serverDAta) {
            let lastHighValueMax: number = serverDAta[0].high,
                currentDifferenceMax: number = 0,
                lastDifferenceMax: number = 0,
                counterMax: number = 0;
            for (counterMax = 0; counterMax <= serverDAta.length -1 ; counterMax ++) {
                currentDifferenceMax = serverDAta[counterMax].high - lastHighValueMax;
                if(currentDifferenceMax > lastDifferenceMax) {
                    currentDifferenceMax = lastDifferenceMax;
                    this.setState({
                        ...this.state,
                        ToleranceData: {
                            ...this.state.ToleranceData,
                            max: {time1: new Date(serverDAta[counterMax - 1].time * 1000).toLocaleTimeString('en-GB'),
                                  time2: new Date(serverDAta[counterMax].time * 1000).toLocaleTimeString('en-GB')}
                        },
                    })
                }
            }
            let lastHighValueMin: number = serverDAta[0].high,
                currentDifferenceMin: number = 0,
                lastDifferenceMin: number = 0,
                counterMin: number = 0;
            for (counterMin = 0; counterMin <= serverDAta.length -1 ; counterMin ++) {
                currentDifferenceMin = serverDAta[counterMin].high - lastHighValueMin;
                if(currentDifferenceMin < lastDifferenceMin) {
                    currentDifferenceMin = lastDifferenceMin;
                    this.setState({
                        ...this.state,
                        ToleranceData: {
                            ...this.state.ToleranceData,
                            min: {time1: new Date(serverDAta[counterMin - 1].time * 1000).toLocaleTimeString('en-GB'),
                                    time2: new Date(serverDAta[counterMin].time * 1000).toLocaleTimeString('en-GB')}
                        },
                    })
                }
            }
            if (!this.state.userSession) {
                localStorage.setItem('tolerance', JSON.stringify(this.state.ToleranceData));
            }
        }
    }

    controlChartVisibility(type: string): void {
        switch(type) { 
            case 'high': {
                this.setState({
                    ...this.state,
                    makeChartVisible: {
                        ...this.state.makeChartVisible,
                        high: !this.state.makeChartVisible.high
                    }
                });
                break; 
            } 
            case 'average': {
                this.setState({
                    ...this.state,
                    makeChartVisible: {
                        ...this.state.makeChartVisible,
                        average: !this.state.makeChartVisible.average
                    }
                });
                break; 
            } 
            case 'low': {
                this.setState({
                    ...this.state,
                    makeChartVisible: {
                        ...this.state.makeChartVisible,
                        low: !this.state.makeChartVisible.low
                    }
                });
                break; 
            } 
            default: {
                this.setState({
                    ...this.state,
                    makeChartVisible: {
                        high: true,
                        low: true,
                        average: true
                    }
                });
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
                                    click={this.controlChartVisibility.bind(this)}/>
                    <CurrencyRange max={this.state.ToleranceData.max} min={this.state.ToleranceData.min}/>
                </section>
            </>
        )
    }
}

