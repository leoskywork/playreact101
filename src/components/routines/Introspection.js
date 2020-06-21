import React from 'react';
import PropTypes from 'prop-types';
import './StyleRoutines.css';

import routineService from '../../services/RoutineService';
import AppConst from '../../common/AppConst';
import FulfillmentView from './FulfillmentView';
import ToastBox from './controls/ToastBox';

export class Introspection extends React.Component {

    constructor(props) {
        super(props);

        const prodState = {
            lskLoad: '',
            showRemark: false,
            showDeletedRoutine: false,
            showDeletedHistory: false,
            showRecursiveOnly: false,
            lskHeartbeat: 'beat',
            fulfillments: [],
            isLoadingData: false,
            customAlertPopped: false,
            className: 'Introspection',
            today: new Date().toLocaleDateString().replace(/\//g, '.'),
            showToast: false,
            toastTitle: '',
            toastMessage: '',
            toastSeverity: 'default'
        };

        if (AppConst.isDev) {
            this.state = {
                ...prodState,
                showRemark: true,
                showDeletedRoutine: true,
                showDeletedHistory: true,
            };
        } else {
            this.state = prodState;
        }
    }


    componentDidMount() {
        this.props.collapseHeader(true);
        document.querySelector('#intro-lsk-load-input').select();

        this.heartBeat();
        this.checkDayRollover();
    }

    heartBeat() {
        try { routineService.getHeartBeat(this.state.lskHeartbeat, 'user-todo'); }
        catch (ex) { console.log('heart beat error', ex); }

        const timerId = setTimeout(() => {
            this.heartBeat();
        }, AppConst.heartBeatInterval);

        if (!this.heartBeatTimerId) {
            clearTimeout(this.heartBeatTimerId);
        }

        this.heartBeatTimerId = timerId;
    }

    checkDayRollover() {
        this.dayRolloverTimerId = setInterval(() => {
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
        clearTimeout(this.heartBeatTimerId);
        clearInterval(this.dayRolloverTimerId);
        this.props.collapseHeader(false);
    }

    render() {
        return (
            <React.Fragment>
                <h3 className="intro-title" title={AppConst.appName + ' - ' + AppConst.versionDetails}>
                    <span>{AppConst.isDev ? AppConst.appName + ' ' : ''}INTROSPECTION</span>
                    <span>&nbsp;</span>
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
                    <button type="submit" className="btn-intro-load" disabled={this.disableLoadButton()}>ENTER</button>
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
                            afterDeleteRoutineReturned={this.afterDeleteRoutineReturned}
                            afterDeleteHistoryReturned={this.afterDeleteHistoryReturned}
                            afterUpdateRecursiveReturned={this.afterUpdateRecursiveReturned}
                            showRemark={this.state.showRemark}
                            showDeletedRoutine={this.state.showDeletedRoutine}
                            showRecursiveOnly={this.state.showRecursiveOnly}
                            showDeletedHistory={this.state.showDeletedHistory}>
                        </FulfillmentView>)}
                    <div hidden={!this.state.fulfillments || this.state.fulfillments.length === 0}>
                        <button className="btn-intro-common btn-switch"
                            onClick={() => this.setState({ showRemark: !this.state.showRemark })}>{this.state.showRemark ? 'SHOW' : 'HIDE'} REMARKS
                        </button>
                        <button className="btn-intro-common btn-switch"
                            onClick={() => this.setState({ showDeletedRoutine: !this.state.showDeletedRoutine })}>{this.state.showDeletedRoutine ? 'SHOW' : 'HIDE'} DELETED ROUTINE
                        </button>
                        <button className="btn-intro-common btn-switch"
                            onClick={() => this.setState({ showDeletedHistory: !this.state.showDeletedHistory })}>{this.state.showDeletedHistory ? 'SHOW' : 'HIDE'} DELETED HISTORY
                        </button>
                        <button className="btn-intro-common btn-switch"
                            onClick={() => this.setState({ showRecursiveOnly: !this.state.showRecursiveOnly })}>{this.state.showRecursiveOnly ? 'SHOW RECURSIVE ONLY' : 'SHOW ALL ROUTINE'}
                        </button>
                    </div>
                </div>

                <ToastBox show={this.state.showToast}
                    title={this.state.toastTitle}
                    message={this.state.toastMessage}
                    severity={this.state.toastSeverity}
                    onClose={this.onCloseToastBox}>
                </ToastBox>

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

    afterSubmitFulfillment = (result, routine) => {
        this.setState({
            showToast: true,
            toastTitle: 'Submit Fulfillment',
            toastMessage: result && result.success ? `Routine ${routine.name} updated` : `Failed to fulfill routine ${routine.name}`,
            toastSeverity: result && result.success ? 'success' : 'fail'
        });

        if (result && result.success) {
            let data = [...this.state.fulfillments];

            for (let i = 0; i < data.length; i++) {
                if (data[i].id === routine.id) {
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
                document.querySelector('#intro-lsk-fulfill-' + routine.id).select();
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

    afterDeleteRoutineReturned = (result, routine) => {
        this.setState({
            showToast: true,
            toastTitle: 'Delete Routine',
            toastMessage: result && result.success ? `Routine ${routine.name} deleted` : `Failed to delete routine ${routine.name}`,
            toastSeverity: result && result.success ? 'success' : 'fail'
        });

        this.replaceWithNewRoutine(result, routine);
    }

    replaceWithNewRoutine(newRoutineResult, oldRoutine) {
        if (newRoutineResult && newRoutineResult.success) {
            let data = [...this.state.fulfillments];

            for (let i = 0; i < data.length; i++) {
                if (data[i].id === oldRoutine.id) {
                    data.splice(i, 1, newRoutineResult.data);
                    data.sort(this.sortByFulfillmentDateDesc);
                    this.setState({ fulfillments: data });
                    break;
                }
            }

        } else {
            if (!this.state.customAlertPopped) {
                this.setState({ customAlertPopped: true });
                alert('please try to refresh page if fail to do the action again');
            }
        }
    }

    afterDeleteHistoryReturned = (result, history) => {
        const formattedTime = history.time.toLocaleDateString().split('/').join('.');
        const routine = this.state.fulfillments.find(f => f.id === history.parentId);

        if (result && result.success) {
            //should do this via setState(), but so many cascading changes, so just reset the entire data array
            history.isDeleted = true;

            this.setState({
                showToast: true,
                toastTitle: 'Delete History',
                toastMessage: `History record ${formattedTime} of ${routine.name} deleted`,
                toastSeverity: 'success',
                fulfillments: [...this.state.fulfillments]
            });

        } else {
            this.setState({
                showToast: true,
                toastTitle: 'Delete History',
                toastMessage: `Failed to delete history record of ${routine.name}`,
                toastSeverity: 'fail'
            });
        }
    }

    afterUpdateRecursiveReturned = (result, routine) => {
        this.setState({
            showToast: true,
            toastTitle: 'Update Recursive',
            toastMessage: result && result.success ? `Routine ${routine.name} updated` : `Failed to update routine ${routine.name}`,
            toastSeverity: result && result.success ? 'success' : 'fail'
        });

        this.replaceWithNewRoutine(result, routine);
    }

    onCloseToastBox = () => {
        this.setState({
            showToast: false,
            toastTitle: '',
            toastMessage: '',
            toastSeverity: 'default'
        })
    }



}

Introspection.propTypes = {
    collapseHeader: PropTypes.func.isRequired
};

export default Introspection;
