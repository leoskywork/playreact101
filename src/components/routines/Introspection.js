import React from 'react';
import PropTypes from 'prop-types';
import './StyleRoutines.css';
import routineService from '../../services/RoutineService';
import AppConst from '../../common/AppConst';
import FulfillmentView from './FulfillmentView';

export class Introspection extends React.Component {
    state = {
        lskLoad: '',
        showRemark: false,
        showDeletedRoutine: false,
        showDeletedHistory: false,
        lskHeartbeat: 'beat',
        fulfillments: [],
        isLoadingData: false,
        customAlertPopped: false,
        className: 'Introspection',
        today: new Date().toLocaleDateString().replace(/\//g, '.')
    };

    componentDidMount() {
        this.props.collapseHeader(true);
        document.querySelector('#intro-lsk-load-input').select();

        this.heartBeat();
        this.checkDayRollover();
    }

    heartBeat() {
        try { routineService.getHeartBeat(this.state.lskHeartbeat, 'user-todo'); }
        catch (ex) { console.log('heart beat error', ex); }

        setTimeout(() => {
            this.heartBeat();
        }, AppConst.heartBeatInterval);
    }

    checkDayRollover() {
        setInterval(() => {
            const today = new Date().toLocaleDateString().replace(/\//g, '.');

            if (today !== this.state.today) {
                this.setState({
                    today: today,
                    fulfillments: this.state.fulfillments
                });
            }

        }, AppConst.dayRolloverCheckingRate);
    }

    componentWillUnmount() {
        console.log('intro - component will unmount');
        this.props.collapseHeader(false);
    }

    render() {
        return (
            <React.Fragment>
                <h3 className="intro-title" title={AppConst.appName + ' - ' + AppConst.versionDetails}>
                    <span>{AppConst.isDev ? AppConst.appName + ' ' : ''}INTROSPECTION</span>
                    <span>&nbsp;&nbsp;</span>
                    <span>{this.state.today}</span>
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
                    <div className='intro-loading-message message-main-loading' hidden={!this.state.isLoadingData}>Loading...</div>
                    {this.state.fulfillments.map(f =>
                        <FulfillmentView key={f.id}
                            fulfillment={f}
                            afterHistoryLoaded={this.afterHistoryLoaded}
                            afterSubmitFulfillment={this.afterSubmitFulfillment}
                            afterMoreHistoryLoaded={this.afterMoreHistoryLoaded}
                            showRemark={this.state.showRemark}
                            showDeletedHistory={this.state.showDeletedHistory}
                            hidden={f.isDeleted && !this.showDeletedRoutine}>
                        </FulfillmentView>)}
                    <div hidden={!this.state.fulfillments || this.state.fulfillments.length === 0}>
                        <button className="btn-intro-common btn-switch"
                            onClick={() => this.setState({ showRemark: !this.state.showRemark })}>REMARK {this.state.showRemark ? 'SHOW' : 'HIDE'}
                        </button>
                        <button className="btn-intro-common btn-switch"
                            onClick={() => this.setState({ showDeletedRoutine: !this.state.showDeletedRoutine })}>DEL ROUTINE {this.state.showDeletedRoutine ? 'SHOW' : 'HIDE'}
                        </button>
                        <button className="btn-intro-common btn-switch"
                            onClick={() => this.setState({ showDeletedHistory: !this.state.showDeletedHistory })}>DEL HISTORY {this.state.showDeletedHistory ? 'SHOW' : 'HIDE'}
                        </button>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    async reload(lsk, source) {
        console.log('reload data - source', source);

        this.setState({ isLoadingData: true });
        const lskWithinLimit = lsk.substring(0, Math.min(AppConst.maxFulfillmentLength, lsk.length));

        return routineService.getRoutines(lskWithinLimit).then(result => {
            this.setState({ isLoadingData: false });
            const success = result && result.success;

            if (success) {
                const data = result.data || [];
                data.sort(this.sortByFulfillmentDateDesc);
                this.setState({ fulfillments: data });
            }

            return success;
        });
    }

    sortByFulfillmentDateDesc(a, b) {
        return (b.lastFulfill || b.createAt).getTime() - (a.lastFulfill || a.createAt).getTime();
    }

    disableLoadButton() {
        return this.state.isLoadingData || !this.state.lskLoad;
    }

    onLskArgumentChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onSubmitLoading = e => {
        e.preventDefault();
        if (this.state.isLoadingData) return;

        this.reload(this.state.lskLoad, 'submit loading').then(success => {
            if (success) {
                this.setState({ lskLoad: '' });
                document.querySelector('.intro-load-form').remove();
            }
        });
    };

    afterSubmitFulfillment = (result, id) => {
        if (result && result.success) {
            let data = [...this.state.fulfillments];

            for (let i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    data.splice(i, 1, result.data);
                    data.sort(this.sortByFulfillmentDateDesc);
                    this.setState({ fulfillments: data });
                    break;
                }
            }

        } else {
            if (!this.state.customAlertPopped) {
                this.setState({ customAlertPopped: true });
                alert('please try to refresh page if fail to send fulfillment again');
            }

            setTimeout(() => {
                document.querySelector('#intro-lsk-fulfill-' + id).select();
            });
        }
    }

    afterHistoryLoaded = (result, id) => {
        const data = this.state.fulfillments;
        const oldFulfillment = data.find(f => f.id === id);

        if (oldFulfillment) {
            if (result && result.success && result.data) {
                data.splice(data.indexOf(oldFulfillment), 1, result.data);
                data.sort(this.sortByFulfillmentDateDesc);
            }

            this.setState({ fulfillments: data });
        }
    }

    afterMoreHistoryLoaded = (result, id) => {
        // const data = this.state.fulfillments;
        // const fulfillment = data.find(f => f.id === id);

        // if (fulfillment) {
        //     if (result && result.success && result.data) {
        //         fulfillment.archivedFulfillments = result.data;
        //         this.setState({ fulfillments: data });
        //     }
        // }
    }


}

Introspection.propTypes = {
    collapseHeader: PropTypes.func.isRequired
};

export default Introspection;
