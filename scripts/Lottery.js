import React from 'react';
import axios from 'axios';
import classnames from 'classnames';

const modalClassnames = isActive =>
    classnames('modal', {
        active: isActive,
    });

class Lottery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            showModal: false,
            showWinnersModal: false,
            lotteryResult: '',
        };
    }
    handleChange = event => {
        this.setState({
            address: event.target.value,
        });
    };
    closeModal = () => {
        this.setState({
            showModal: false,
        });
    };
    closeWinnersModal = () => {
        this.setState({
            showWinnersModal: false,
        });
    };
    showData = data => {
        const { delegates } = this.props;
        const neededVotes = delegates.filter(
            dg => dg.affiliation === 'Freelance',
        );
        const relevantVotes = neededVotes.filter(
            delegate =>
                data.delegates.filter(dg => dg.address === delegate.delegateAddress)
                    .length > 0,
        );
        const missingVotes = neededVotes.filter(delegate => relevantVotes.filter(dg => dg.delegateAddress === delegate.delegateAddress).length === 0).map(delegate => delegate.delegateName);
        if (relevantVotes.length === neededVotes.length) {
            this.setState({
                showModal: true,
                lotteryResult: 'You are entered in the lotery!',
            });
        } else {
            this.setState({
                showModal: true,
                lotteryResult: 'You have not voted for all delegates with the tag Freelance yet. Missing: ' + missingVotes.join(', '),
            });
        }
    };
    checkEntered = () => {
        axios
            .get(
                `https://node08.lisk.io/api/accounts/delegates/?address=${this
                    .state.address}`,
            )
            .then(res => {
                if (res.data.success) {
                    this.showData(res.data);
                } else {
                    this.setState({
                        showModal: true,
                        lotteryResult: res.data.error,
                    });
                }
            });
    };

    showPreviousWinners = () => {
        this.setState({
            showWinnersModal: true
        });
    };

    render() {
        const { showModal, showWinnersModal } = this.state;
        return (
            <div className="col-12 column">

                <div className={modalClassnames(showModal)}>
                    <div className="modal-overlay" />
                    <div className="modal-container col-xs-12 col-sm-12 col-md-12 col-5">
                        <div className="modal-header">
                            <button
                                className="btn btn-clear float-right"
                                onClick={this.closeModal}
                            />
                            <div className="modal-title">Lottery status</div>
                        </div>
                        <div className="modal-body">
                            <div className="content">
                                {this.state.lotteryResult}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-primary"
                                onClick={this.closeModal}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>

                <div className={modalClassnames(showWinnersModal)}>
                    <div className="modal-overlay" />
                    <div className="modal-container col-xs-12 col-sm-12 col-md-12 col-5">
                        <div className="modal-header">
                            <button
                                className="btn btn-clear float-right"
                                onClick={this.closeWinnersModal}
                            />
                            <div className="modal-title">Previous winners</div>
                        </div>
                        <div className="modal-body">
                            <div className="content">
                                <p>The first drawing will happen on June 30th, 2017!</p>
                                <p>If you would like to stay anonymous, send us a message and we will remove you from the winners page.</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-primary"
                                onClick={this.closeWinnersModal}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-title">Lottery</div>
                    </div>
                    <div className="panel-body">
                        <p>Vote for all members with the <label className="label label-primary">Lottery</label> badge
                        on this list to be entered in a lottery.</p>
                        <p>Each participant gets 1 ticket per LSK, capped to twice the average LSK across all participants.</p>
                        <div>The lottery draws every month and gives out:</div>
                        <ul>
                            <li>First prize: <strong>1500 LSK</strong></li>
                            <li>Second prize: <strong>900 LSK</strong></li>
                            <li>Third prize: <strong>600 LSK</strong></li>
                        </ul>
                        <button
                            className="btn btn-primary"
                            onClick={this.showPreviousWinners}>
                            Previous winners
                        </button>
                    </div>
                    <div className="panel-footer">
                        <div className="input-group">
                            <button
                                className="btn btn-primary input-group-btn"
                                disabled={!this.state.address}
                                onClick={this.checkEntered}>
                                Check if you are participating
                            </button>
                            <input
                                value={this.state.address}
                                onChange={this.handleChange}
                                type="text"
                                className="form-input"
                                placeholder="type your LSK address"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Lottery;
