import React from 'react';

interface ToleranceData {
    time1: string;
    time2: string;
}

interface ToleranceDataModel {
    max: ToleranceData;
    min: ToleranceData;
}

export default class CurrencyRange extends React.Component<ToleranceDataModel> {
    state: ToleranceDataModel;
    constructor (props: ToleranceDataModel) {
        super(props);
        this.state = {
            max: props.max,
            min: props.min
        };
    }

    componentWillReceiveProps(props: ToleranceDataModel) {
        this.setState(props);
    }

    render () {
        return (
            <div className="information-holder">
                <div className="information-holder__maximum">
                    <p>Maximum range:</p>
                    <strong>{this.state.max.time1}</strong>
                    <strong>   -   </strong>
                    <strong>{this.state.max.time2}</strong>
                </div>
                <div className="information-holder__minimum">
                    <p>Minimum range:</p>
                    <strong>{this.state.min.time1}</strong>
                    <strong>   -   </strong>
                    <strong>{this.state.min.time2}</strong>
                </div>
            </div>
        )
    }
}