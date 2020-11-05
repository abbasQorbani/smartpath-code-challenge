import React from 'react';

interface RangeTimes {
    time1: number;
    time2: number;
}

interface Renge {
    min: RangeTimes;
    max: RangeTimes;
}

export default class CurrencyRange extends React.Component<Renge> {
    state: Renge;
    constructor (props: Renge) {
        super(props);
        this.state = {
            max: props.max,
            min: props.min
        };
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        document.querySelectorAll('.single-chart-holder__bullet').forEach(element => {
            element.addEventListener('click', this.makeSlider);
        });
    }

    componentWillReceiveProps(props: Renge) {
        this.setState(props);
    }

    makeSlider(event: any) {
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
            <div className="information-holder">
                {/* <div className="information-holder__maximum">
                    <p>Maximum range:</p>
                    <strong>{this.state.collectHighAndLowValues.high}</strong>
                </div>
                <div className="information-holder__minimum">
                    <p>Minimum range:</p>
                    <strong>{this.state.collectHighAndLowValues.low}</strong>
                </div> */}
            </div>
        )
    }
}