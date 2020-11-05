import React from 'react';

interface MakeChartVisible {
    high: boolean;
    average: boolean;
    low: boolean;
    click: any;
}


export default class ChartControler extends React.Component<MakeChartVisible> {
    state: MakeChartVisible;
    constructor (props: MakeChartVisible) {
        super(props);
        this.state = {
            average: props.average,
            high: props.high,
            low: props.low,
            click: props.click
        };
    }

    render () {
        return (
            <div className="options-holder">
                <div className="options-holder__title">
                    <strong>Indexes</strong>
                </div>
                <div className="options-holder__check-box-holder">
                    <input id="higher" className="options-holder__check-box" type="checkbox" name="" defaultChecked={this.state.high}/>
                    <label className="options-holder__check-box-label higher" htmlFor="higher" onClick={e => this.state.click('high')}>
                        Higher
                    </label>
                </div>
                <div className="options-holder__check-box-holder">
                    <input id="average" className="options-holder__check-box" type="checkbox" name="" defaultChecked={this.state.average}/>
                    <label className="options-holder__check-box-label average" htmlFor="average" onClick={e => this.state.click('average')}>
                        Average
                    </label>
                </div>
                <div className="options-holder__check-box-holder">
                    <input id="lower" className="options-holder__check-box" type="checkbox" name="" defaultChecked={this.state.low}/>
                    <label className="options-holder__check-box-label lower" htmlFor="lower" onClick={e => this.state.click('low')}>
                        Lower
                    </label>
                </div>
            </div>
        )
    }
}