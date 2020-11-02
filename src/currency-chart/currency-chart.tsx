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
    Data: CurrencyData;
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

export default class CurrencyChart extends React.Component {
    async componentDidMount() {
        document.querySelector('.single-chart-holder__single-chart-parent')?.classList.add('single-chart-holder__single-chart-parent--active');
        document.querySelector('.single-chart-holder__bullet')?.classList.add('single-chart-holder__bullet--active');
        await axios.get<CurrencyRequestResponse>('https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=10')
            .then((response) => {
                console.log(response.data.Data.Data);
            })
    }
    render () {
        return (
            <>
                <section className="chart-holder">
                    <div className="full-chart-holder">
                        <div className="full-chart-holder__triple-chart">
                            <div className="full-chart-holder__high-chart"></div>
                            <div className="full-chart-holder__mid-chart"></div>
                            <div className="full-chart-holder__low-chart"></div>
                        </div>
                        <div className="full-chart-holder__triple-chart">
                            <div className="full-chart-holder__high-chart"></div>
                            <div className="full-chart-holder__mid-chart"></div>
                            <div className="full-chart-holder__low-chart"></div>
                        </div>
                        <div className="full-chart-holder__triple-chart">
                            <div className="full-chart-holder__high-chart"></div>
                            <div className="full-chart-holder__mid-chart"></div>
                            <div className="full-chart-holder__low-chart"></div>
                        </div>
                        <div className="full-chart-holder__triple-chart">
                            <div className="full-chart-holder__high-chart"></div>
                            <div className="full-chart-holder__mid-chart"></div>
                            <div className="full-chart-holder__low-chart"></div>
                        </div>
                        <div className="full-chart-holder__triple-chart">
                            <div className="full-chart-holder__high-chart"></div>
                            <div className="full-chart-holder__mid-chart"></div>
                            <div className="full-chart-holder__low-chart"></div>
                        </div>
                        <div className="full-chart-holder__triple-chart">
                            <div className="full-chart-holder__high-chart"></div>
                            <div className="full-chart-holder__mid-chart"></div>
                            <div className="full-chart-holder__low-chart"></div>
                        </div>
                        <div className="full-chart-holder__triple-chart">
                            <div className="full-chart-holder__high-chart"></div>
                            <div className="full-chart-holder__mid-chart"></div>
                            <div className="full-chart-holder__low-chart"></div>
                        </div>
                        <div className="full-chart-holder__triple-chart">
                            <div className="full-chart-holder__high-chart"></div>
                            <div className="full-chart-holder__mid-chart"></div>
                            <div className="full-chart-holder__low-chart"></div>
                        </div>
                        <div className="full-chart-holder__triple-chart">
                            <div className="full-chart-holder__high-chart"></div>
                            <div className="full-chart-holder__mid-chart"></div>
                            <div className="full-chart-holder__low-chart"></div>
                        </div>
                        <div className="full-chart-holder__triple-chart">
                            <div className="full-chart-holder__high-chart"></div>
                            <div className="full-chart-holder__mid-chart"></div>
                            <div className="full-chart-holder__low-chart"></div>
                        </div>
                        <div className="chart-row__top-level"></div>
                        <div className="chart-row__mid-level"></div>
                        <div className="chart-row__low-level"></div>
                    </div>
                    <div className="single-chart-holder">
                        <div className="single-chart-holder__title-holder">
                            <p>Market volume of</p>
                            <strong>Time</strong>
                        </div>
                        <div className="single-chart-holder__single-chart-parent">
                            <div className="single-chart-holder__single-chart"></div>
                            <div className="chart-row__top-level"></div>
                            <div className="chart-row__mid-level"></div>
                            <div className="chart-row__low-level"></div>
                        </div>
                        <div className="single-chart-holder__single-chart-parent">
                            <div className="single-chart-holder__single-chart"></div>
                        </div>
                        <div className="single-chart-holder__single-chart-parent">
                            <div className="single-chart-holder__single-chart"></div>
                        </div>
                        <div className="single-chart-holder__single-chart-parent">
                            <div className="single-chart-holder__single-chart"></div>
                        </div>
                        <div className="single-chart-holder__single-chart-parent">
                            <div className="single-chart-holder__single-chart"></div>
                        </div>
                        <div className="single-chart-holder__single-chart-parent">
                            <div className="single-chart-holder__single-chart"></div>
                        </div>
                        <div className="single-chart-holder__single-chart-parent">
                            <div className="single-chart-holder__single-chart"></div>
                        </div>
                        <div className="single-chart-holder__single-chart-parent">
                            <div className="single-chart-holder__single-chart"></div>
                        </div>
                        <div className="single-chart-holder__single-chart-parent">
                            <div className="single-chart-holder__single-chart"></div>
                        </div>
                        <div className="single-chart-holder__single-chart-parent">
                            <div className="single-chart-holder__single-chart"></div>
                        </div>
                        <div className="single-chart-holder__bullet-holder">
                            <div className="single-chart-holder__bullet"></div>
                            <div className="single-chart-holder__bullet"></div>
                            <div className="single-chart-holder__bullet"></div>
                            <div className="single-chart-holder__bullet"></div>
                            <div className="single-chart-holder__bullet"></div>
                            <div className="single-chart-holder__bullet"></div>
                            <div className="single-chart-holder__bullet"></div>
                            <div className="single-chart-holder__bullet"></div>
                            <div className="single-chart-holder__bullet"></div>
                            <div className="single-chart-holder__bullet"></div>
                        </div>
                    </div>
                </section>
                <section className="options-information-holder">
                    <div className="options-holder">
                        <div className="options-holder__title">
                            <strong>Indexes</strong>
                        </div>
                        <div className="options-holder__check-box-holder">
                            <input id="higher" className="options-holder__check-box" type="checkbox" name="" checked={true}/>
                            <label className="options-holder__check-box-label higher" htmlFor="higher">
                                Higher
                            </label>
                        </div>
                        <div className="options-holder__check-box-holder">
                            <input id="average" className="options-holder__check-box" type="checkbox" name="" checked={true}/>
                            <label className="options-holder__check-box-label average" htmlFor="average">
                                Average
                            </label>
                        </div>
                        <div className="options-holder__check-box-holder">
                            <input id="lower" className="options-holder__check-box" type="checkbox" name="" checked={true}/>
                            <label className="options-holder__check-box-label lower" htmlFor="lower">
                                Lower
                            </label>
                        </div>
                    </div>
                    <div className="information-holder">
                        <div className="information-holder__maximum">
                            <p>Maximum range:</p>
                            <strong>Time 1 to Time 2</strong>
                        </div>
                        <div className="information-holder__minimum">
                            <p>Minimum range:</p>
                            <strong>Time 1 to Time 2</strong>
                        </div>
                    </div>
                </section>
            </>
        )
    }
}

