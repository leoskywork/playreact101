import React from 'react';
import PropTypes from 'prop-types';
import './StyleRoutines.css';
import routineService from '../../services/RoutineService';
import AppConst from '../../common/AppConst';

export class Introspection extends React.Component {
    state = {
        lskHeartbeat: 'beat',
        lskLoad: '',
        lskLoadShowing: true,
        lskFulfill: AppConst.DefaultFulfillDay,
        lskFulfillShowing: false,
        lskFulfillOwner: '',
        lskFulfillLastOwner: '',
        fulfillments: [],
        isLoadingData: false,
        isSendingLskFulfill: false,
        customAlertPopped: false,
        isLoadingHistoryRecords: {}
    };

    get maxLength() {
        return 128;
    }

    componentDidMount() {
        this.props.collapseHeader(true);
        document.querySelector('#intro-lsk-load-input').select();

        setInterval(() => {
            routineService.getHeartBeat(this.state.lskHeartbeat, 'user-todo');
        }, AppConst.HeartBeatInterval);
    }

    componentWillUnmount() {
        this.props.collapseHeader(false);
    }

    async reload(lsk, source) {
        console.log('reload data - source', source);

        this.setState({ isLoadingData: true });

        return routineService.getRoutines(lsk.substring(0, Math.min(this.maxLength, lsk.length))).then(result => {
            const success = result && result.success;
            let data = null;

            if (success) {
                data = result.data || [];
                data.sort((a, b) => (b.lastFulfill || b.createAt).getTime() - (a.lastFulfill || a.createAt).getTime());
            } else {
                data = this.state.fulfillments;
            }

            this.setState({
                fulfillments: data,
                isLoadingData: false
            });

            return success;
        });
    }

    getHistoryRecords(lsk, id, source) {
        console.log('get history record - ', source, id);
        if (!id) return;
        if (this.state.isLoadingHistoryRecords[id]) return;

        const loadingFlags = Object(this.state.isLoadingHistoryRecords);
        loadingFlags[id] = true;

        this.setState({ isLoadingHistoryRecords: loadingFlags });

        routineService.getHistoryRecords(lsk, id).then(result => {
            loadingFlags[id] = false;
            this.setState({ isLoadingHistoryRecords: loadingFlags });

            if (result && result.success && result.data) {
                const fulfillment = this.state.fulfillments.find(f => f.id === id);

                if (fulfillment) {
                    const data = this.state.fulfillments;
                    data.splice(data.indexOf(fulfillment), 1, result.data);
                    data.sort((a, b) => (b.lastFulfill || b.createAt).getTime() - (a.lastFulfill || a.createAt).getTime());

                    this.setState({
                        fulfillments: data
                    });
                }
            }
        });
    }


    disableSendButton() {
        return this.state.isLoadingData || !this.state.lskFulfill || this.state.isSendingLskFulfill;
    }

    disableLoadButton() {
        return this.state.isLoadingData || !this.state.lskLoad || this.state.isSendingLskFulfill;
    }

    getLastFulfillDescription(fulfillment) {
        if (fulfillment.lastFulfill) {
            //console.log(fulfillment.lastFulfill.getTime(), fulfillment.name);
            const date = fulfillment.lastFulfill;
            //fixme, add a few seconds for local now to avoid time diff between client and server
            const daysAgo = Math.floor((Date.now() + 5000 - date.getTime()) / 1000 / 60 / 60 / 24);

            if (daysAgo === 0) {
                return '(today)';
            } else if (daysAgo === 1) {
                return '(yesterday)';
            } else {
                return `(${daysAgo > 99 ? '99+' : daysAgo} days ago)`
                // date.toLocaleDateString().split('/').join('.');
            }
        }

        return '--';
    }

    getFulfillExpandButtonStyle(fulfillment) {
        if (this.shouldExpandFulfillForm(fulfillment)) {
            return 'btn-intro-fulfill expand';
        }

        return 'btn-intro-fulfill';
    }

    shouldExpandFulfillForm(fulfillment) {
        return this.state.lskFulfillShowing && this.state.lskFulfillOwner === fulfillment.id;
    }

    onLskArgumentChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onSubmitLoading = e => {
        e.preventDefault();
        if (this.state.isLoadingData || this.state.isSendingLskFulfill) return;

        this.reload(this.state.lskLoad, 'submit loading').then(success => {
            if (success) {
                this.setState({
                    lskLoad: '',
                    lskLoadShowing: false
                });
            }
        });
    };

    onToggleLskFulfill = fulfillment => {
        const lastOwner = this.state.lskFulfillOwner;
        const newOwner = fulfillment.id;
        const showing = lastOwner !== newOwner || !this.state.lskFulfillShowing;

        if (lastOwner !== newOwner) {
            this.setState({
                lskFulfill: AppConst.DefaultFulfillDay
            });
        }

        this.setState({
            lskFulfillShowing: showing,
            lskFulfillOwner: newOwner,
            lskFulfillLastOwner: lastOwner
        });

        if (showing) {
            setTimeout(() => {
                document.querySelector('#intro-lsk-fulfill-' + fulfillment.id).select();
            });

            this.getHistoryRecords(this.state.lskLoad, fulfillment.id, 'toggle-fulfill-button');
        }
    };

    onSubmitFulfillment = (e, fulfillment) => {
        e.preventDefault();
        if (this.state.isLoadingData || this.state.isSendingLskFulfill) return;

        this.setState({ isSendingLskFulfill: true });

        routineService.fulfillRoutine(fulfillment, this.state.lskFulfill.substring(0, Math.min(this.maxLength, this.state.lskFulfill.length))).then(result => {
            //console.log('submit returned', result);
            let data = this.state.fulfillments;
            const success = result && result.success;

            if (success) {
                const index = data.indexOf(fulfillment);
                if (index !== -1) {
                    data.splice(index, 1, result.data);
                }
            } else {
                // this.reload('submit fulfillment error', this.state.lskLoad || this.state.lastFulfill);
                if (!this.state.customAlertPopped) {
                    this.setState({ customAlertPopped: true });
                    alert('please try to refresh page if fail to send fulfillment again');
                }
                setTimeout(() => {
                    document.querySelector('#intro-lsk-fulfill-' + fulfillment.id).select();
                });
            }

            this.setState({
                isSendingLskFulfill: false,
                fulfillments: data,
                lskFulfill: success ? '' : this.state.lskFulfill,
                lskFulfillShowing: !success
            });
        });
    };

    render() {
        return (
            <React.Fragment>
                <h3 className="intro-title">
                    <span title={AppConst.appName}>INTROSPECTION</span>
                    <span>&nbsp;&nbsp;{new Date().toLocaleDateString().replace(/\//g, '.')}</span>
                </h3>
                <form className="intro-load-form" onSubmit={this.onSubmitLoading} hidden={!this.state.lskLoadShowing}>
                    <input
                        type="number"
                        id="intro-lsk-load-input"
                        name="lskLoad"
                        value={this.state.lskLoad}
                        onChange={this.onLskArgumentChange}
                        placeholder="..."
                        disabled={this.state.isLoadingData}
                        autoComplete="off"
                        maxLength="12"
                    ></input>
                    <button type="submit" className="btn-intro-load" disabled={this.disableLoadButton()}>
                        ENTER
					</button>
                </form>
                <div className="sm-align-right-wrap">
                    <br></br>
                    {this.state.fulfillments.map(f => (
                        <div className="intro-fulfill-item" key={f.id}>
                            <span>{f.name}</span>&nbsp;&nbsp;<span>{this.getLastFulfillDescription(f)}</span>
                            <span>&nbsp;&nbsp;</span>
                            <button className={this.getFulfillExpandButtonStyle(f)} onClick={this.onToggleLskFulfill.bind(this, f)}>
                                ...
							</button>
                            <form className="intro-fulfill-form" onSubmit={e => this.onSubmitFulfillment(e, f)} hidden={!this.shouldExpandFulfillForm(f)}>
                                <input
                                    type="text"
                                    id={'intro-lsk-fulfill-' + f.id}
                                    name="lskFulfill"
                                    value={this.state.lskFulfill}
                                    onChange={this.onLskArgumentChange}
                                    placeholder="..."
                                    disabled={this.state.isLoadingData || this.state.isSendingLskFulfill}
                                    autoComplete="off"
                                ></input>
                                <button type="submit" className="btn-intro-fulfill-send" disabled={this.disableSendButton()}>
                                    SEND
								</button>
                            </form>
                        </div>
                    ))}
                </div>
            </React.Fragment>
        );
    }
}

Introspection.propTypes = {
    collapseHeader: PropTypes.func.isRequired
};

export default Introspection;
