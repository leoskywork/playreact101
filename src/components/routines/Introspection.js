import React from 'react';
import PropTypes from 'prop-types';
import './StyleRoutines.css';
import routineService from '../../services/RoutineService';
import AppConst from '../../common/AppConst';

export class Introspection extends React.Component {
    state = {
        lskHeartbeat: 'beat',
        lskLoad: '',
        lskFulfill: AppConst.DefaultFulfillDay,
        lskFulfillShowing: false,
        lskFulfillOwner: '',
        lskFulfillLastOwner: '',
        fulfillments: [],
        isLoadingData: false,
        isSendingLskFulfill: false,
        customAlertPopped: false,
        currentRoutine: null,
        showRemark: false
    };

    get maxLength() {
        return 128;
    }

    componentDidMount() {
        this.props.collapseHeader(true);
        document.querySelector('#intro-lsk-load-input').select();

        setInterval(() => {
            try { routineService.getHeartBeat(this.state.lskHeartbeat, 'user-todo'); }
            catch (ex) { console.log('heart beat error - ', ex); }
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

            if (success) {
                const data = result.data || [];
                data.sort(this.sortByFulfillmentDateDesc);
                this.setState({ fulfillments: data });
            }

            this.setState({ isLoadingData: false });

            return success;
        });
    }

    getHistoryRecords(lsk, fulfillment, source) {
        console.log('get history record - ', source, fulfillment.id);
        if (!fulfillment || fulfillment.isLoadingHistoryRecords) return;

        fulfillment.isLoadingHistoryRecords = true;
        this.setState({ currentRoutine: fulfillment });

        routineService.getHistoryRecords(lsk, fulfillment.id, AppConst.StagedHistory).then(result => {
            const data = this.state.fulfillments;
            const fulfillmentFromList = data.find(f => f.id === fulfillment.id);

            if (fulfillmentFromList) {
                fulfillmentFromList.isLoadingHistoryRecords = false;
                fulfillmentFromList.showLoadMore = true;

                if (result && result.success && result.data) {
                    result.data.isLoadingHistoryRecords = false;
                    result.data.showLoadMore = true;
                    data.splice(data.indexOf(fulfillmentFromList), 1, result.data);
                    data.sort(this.sortByFulfillmentDateDesc);
                }

                this.setState({ fulfillments: data });
            }
        });
    }

    sortByFulfillmentDateDesc(a, b) {
        return (b.lastFulfill || b.createAt).getTime() - (a.lastFulfill || a.createAt).getTime();
    }


    disableSendButton() {
        return this.state.isLoadingData || !this.state.lskFulfill || this.state.isSendingLskFulfill;
    }

    disableLoadButton() {
        return this.state.isLoadingData || !this.state.lskLoad || this.state.isSendingLskFulfill;
    }

    disabledMoreHistoryButton() {
        const current = this.state.currentRoutine;
        return !current || current.isLoadingHistoryRecords || current.isLoadingMoreHistory;
    }

    getLastFulfillDescription(fulfillment) {
        if (fulfillment.lastFulfill) {
            //console.log(fulfillment.lastFulfill.getTime(), fulfillment.name);
            const last = fulfillment.lastFulfill;
            const daysAgo = Math.floor(Date.now() / 1000 / 60 / 60 / 24) - Math.floor(last.getTime() / 1000 / 60 / 60 / 24);

            if (daysAgo === 0) {
                return '(today)';
            } else if (daysAgo === 1) {
                return '(yesterday)';
            } else {
                // date.toLocaleDateString().split('/').join('.');
                return `(${daysAgo > 99 ? '99+' : daysAgo} days ago)`
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

    getHistoryFulfillDescription(index, allRecordsDesc) {
        if (!allRecordsDesc || allRecordsDesc.length === 0) return;

        const currentDate = allRecordsDesc[index].time;
        const formattedDate = currentDate.toLocaleDateString().split('/').join('.');

        if (index === allRecordsDesc.length - 1) return `fulfill at ${formattedDate}, baseline`; //no offset since this is the first fulfillment ever

        const priorDate = allRecordsDesc[index + 1].time;
        //fixme, should 1 day diff when [Sun Jun 14 2020 00:55:14 GMT+0800 (China Standard Time)] 
        //and prior to [Sat Jun 13 2020 22: 57: 54 GMT + 0800(China Standard Time)]
        //but get 0 here, following is a temp hack
        const daysSincePrior = Math.floor(currentDate.getTime() / 1000 / 60 / 60 / 24) - Math.floor(priorDate.getTime() / 1000 / 60 / 60 / 24);
        if (daysSincePrior < 28 && currentDate.getMonth() === priorDate.getMonth()) {
            const localDaysDiff = currentDate.getDate() - priorDate.getDate();
            if (localDaysDiff !== daysSincePrior) {
                return `fulfill at ${formattedDate}, offset ${localDaysDiff}`;
            }
        }

        return `fulfill at ${formattedDate}, offset ${daysSincePrior}`;
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
                this.setState({ lskLoad: '' });
                document.querySelector('.intro-load-form').remove();
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
            lskFulfillLastOwner: lastOwner,
            currentRoutine: fulfillment
        });

        if (showing) {
            setTimeout(() => {
                document.querySelector('#intro-lsk-fulfill-' + fulfillment.id).select();
            });

            this.getHistoryRecords(this.state.lskLoad, fulfillment, 'toggle-fulfill-button');
        }
    };

    onSubmitFulfillment = (e, fulfillment) => {
        e.preventDefault();
        if (this.state.isLoadingData || this.state.isSendingLskFulfill) return;

        this.setState({ isSendingLskFulfill: true });

        let userInput = this.state.lskFulfill.substring(0, Math.min(this.maxLength, this.state.lskFulfill.length));
        let inputLsk = userInput, remark;
        let inputUnits = userInput.split(';');

        if (inputUnits.length === 1) inputUnits = userInput.split('；'); //Chinese char

        if (inputUnits.length > 1) {
            inputLsk = inputUnits[0].trim();
            remark = inputUnits[1].trim();
        }

        routineService.fulfillRoutine(fulfillment, inputLsk, remark).then(result => {
            //console.log('submit returned', result);
            this.setState({ isSendingLskFulfill: false });

            if (result && result.success) {
                let data = [...this.state.fulfillments];
                const index = data.indexOf(fulfillment);

                if (index > -1) {
                    data.splice(index, 1, result.data);
                    data.sort(this.sortByFulfillmentDateDesc);
                }

                this.setState({
                    lskFulfill: '',
                    fulfillments: data,
                    lskFulfillShowing: false
                });
            } else {
                this.setState({ lskFulfillShowing: true });

                // this.reload('submit fulfillment error', this.state.lskLoad || this.state.lastFulfill);
                if (!this.state.customAlertPopped) {
                    this.setState({ customAlertPopped: true });
                    alert('please try to refresh page if fail to send fulfillment again');
                }

                setTimeout(() => {
                    document.querySelector('#intro-lsk-fulfill-' + fulfillment.id).select();
                });
            }
        });
    };


    onLoadMoreHistory(e, fulfillment) {
        e.preventDefault();
        if (!fulfillment) return;
        if (fulfillment.isLoadingHistoryRecords || fulfillment.isLoadingMoreHistory) return;

        fulfillment.isLoadingMoreHistory = true;
        this.setState({ currentRoutine: fulfillment });

        routineService.getHistoryRecords(this.state.lskLoad, fulfillment.id, AppConst.ArchivedHistory).then(result => {
            const fulfillmentFromList = this.state.fulfillments.find(f => f.id === fulfillment.id);

            if (fulfillmentFromList) {
                fulfillmentFromList.isLoadingMoreHistory = false;

                if (result && result.success && result.data) {
                    fulfillmentFromList.archivedFulfillments = result.data;
                    fulfillmentFromList.showLoadMore = false;
                }

                this.setState({ currentRoutine: fulfillment });
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <h3 className="intro-title" title={AppConst.appName + ' - ' + AppConst.versionDetails}>
                    <span>{AppConst.isDev ? AppConst.appName + ' ' : ''}INTROSPECTION</span>
                    <span>&nbsp;&nbsp;{new Date().toLocaleDateString().replace(/\//g, '.')}</span>
                </h3>
                <form className="intro-load-form" onSubmit={this.onSubmitLoading}>
                    <input
                        type="password"
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
                            <span title={f.lastRemark}>{f.name}</span>&nbsp;&nbsp;<span>{this.getLastFulfillDescription(f)}</span>
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
                                    placeholder="days; remark"
                                    disabled={this.state.isLoadingData || this.state.isSendingLskFulfill}
                                    autoComplete="off"
                                ></input>
                                <button type="submit" className="btn-intro-fulfill-send" disabled={this.disableSendButton()}>
                                    SEND
								</button>
                                {f.hasRecords ?
                                    (<div>
                                        <div className="intro-loading-message" hidden={!f.isLoadingHistoryRecords}>Loading history...</div>
                                        <ul className="intro-fulfill-history">
                                            {f.getAllRecordsDesc().map((r, i, arr) => (
                                                <li key={i} title={`loaded fulfillments ${arr.length}${r.remark ? ', ' + r.remark : ''}`}>
                                                    <span className="intro-fulfill-history-item">
                                                        {this.getHistoryFulfillDescription(i, arr)}
                                                        {r.remark ? (this.state.showRemark ? ', ' + r.remark : ' ...') : ''}
                                                    </span>
                                                </li>
                                            ))}
                                            {f.hasArchived && f.showLoadMore ? (<li key='load-more'>
                                                <button className="btn-intro-common" disabled={this.disabledMoreHistoryButton()} onClick={e => this.onLoadMoreHistory(e, f)}>MORE</button>
                                            </li>) : null}
                                        </ul>
                                    </div>) : null
                                }
                            </form>
                        </div>
                    ))}
                    {this.state.fulfillments.length > 0 ? (<div>
                        <button className="btn-intro-common btn-switch" onClick={() => this.setState({ showRemark: !this.state.showRemark })}>REMARK {this.state.showRemark ? 'ON' : 'OFF'}</button>
                    </div>) : null}
                </div>
            </React.Fragment>
        );
    }
}

Introspection.propTypes = {
    collapseHeader: PropTypes.func.isRequired
};

export default Introspection;
