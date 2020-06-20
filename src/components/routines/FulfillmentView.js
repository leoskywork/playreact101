import React from 'react';
import PropTypes from 'prop-types';
// import SplitButton from 'react-bootstrap/SplitButton';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownToggle from 'react-bootstrap/DropdownToggle';
import DropdownMenu from 'react-bootstrap/DropdownMenu';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import './StyleRoutines.css';
import FulfillmentHistory from './FulfillmentHistory';
import AppConst from '../../common/AppConst';
import Utility from '../../common/Utility';
import routineService from '../../services/RoutineService';
import ActionDropdown from './controls/ActionDropdown';

export class FulfillmentView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showLoadMore: false,
            collapseView: true,
            isSendingLskFulfill: false,
            isLoadingHistoryRecords: false,
            lskFulfill: AppConst.defaultFulfillDay,
            className: 'FulfillmentView',
            isDeletingRoutine: false
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return <div className="intro-fulfill-item" hidden={!this.props.showDeletedRoutine && this.props.fulfillment.isDeleted}>
            <span className={this.props.fulfillment.isDeleted ? 'deleted-item' : ''}
                title={this.props.fulfillment.isDeleted ? `deleted due to ${this.props.fulfillment.deleteReason}` : ''}>
                <span>{this.props.fulfillment.name}</span>
                <span>&nbsp;</span>
                <span>{this.getLastFulfillDescription()}</span>
            </span>
            {/* <button className={`btn-fulfill-op ${!this.state.collapseView ? 'expand' : ''}`} onClick={this.onToggleLskFulfill}>+</button> */}
            {/* <button className='btn-fulfill-op no-bg-color' onClick={() => { }}><span className="dropdown-caret"></span></button> */}

            {/* need more control of the visual appearance, 'id' for DropdownToggle is necessary */}
            <Dropdown as={ButtonGroup} className="btn-fulfill-op-container">
                <Button
                    className={`btn-fulfill-op-add ${this.state.collapseView ? '' : 'expand'}`}
                    onClick={this.onToggleLskFulfill}
                    variant="outline-secondary">+
                </Button>
                <DropdownToggle split variant="outline-secondary" id={`fulfill-op-${this.props.fulfillment.id}`} disabled={this.shouldDisableEdit()} />
                <DropdownMenu disabled={this.state.isDeletingRoutine} className="intro-op-dropdown-menu">
                    <ActionDropdown
                        beforeCallDeleteRoutine={this.beforeCallDeleteRoutine}
                        afterDeleteRoutineReturned={this.afterDeleteRoutineReturned}
                        fulfillment={this.props.fulfillment}>
                    </ActionDropdown>
                </DropdownMenu>
            </Dropdown>


            <form className="intro-fulfill-form"
                onSubmit={e => this.onSubmitFulfillment(e)}
                hidden={this.state.collapseView}
                disabled={this.shouldDisableEdit()}>
                <input
                    type="text"
                    id={'intro-lsk-fulfill-' + this.props.fulfillment.id}
                    name="lskFulfill"
                    value={this.state.lskFulfill}
                    onChange={this.onLskArgumentChange}
                    placeholder="days; remark"
                    disabled={this.shouldDisableEdit()}
                    autoComplete="off"></input>
                <button type="submit" className="btn-intro-fulfill-send" disabled={this.shouldDisableSendButton()}>SEND</button>
                <div className="intro-loading-message" hidden={!this.state.isLoadingHistoryRecords}>Loading history...</div>
                <FulfillmentHistory
                    showLoadMore={this.state.showLoadMore}
                    showRemark={this.props.showRemark}
                    showDeletedHistory={this.props.showDeletedHistory}
                    fulfillment={this.props.fulfillment}
                    afterHistoryLoaded={this.props.afterHistoryLoaded}
                    afterMoreHistoryLoaded={this.afterMoreHistoryLoaded}
                    afterDeleteHistoryReturned={this.afterDeleteHistoryReturned}>
                </FulfillmentHistory>
            </form>
        </div>
    }

    shouldDisableEdit() {
        return this.state.isDeletingRoutine || this.props.fulfillment.isDeleted || this.state.isSendingLskFulfill;
    }

    shouldDisableSendButton() {
        return !this.state.lskFulfill || this.shouldDisableEdit();
    }

    onLskArgumentChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    getLastFulfillDescription() {
        let lastFulfill = null;

        if (this.props.fulfillment.historyFulfillments) {
            for (let i = this.props.fulfillment.historyFulfillments.length - 1; i >= 0; i--) {
                if (!this.props.fulfillment.historyFulfillments[i].isDeleted) {
                    lastFulfill = this.props.fulfillment.historyFulfillments[i].time;
                    break;
                }
            }
        } else {
            lastFulfill = this.props.fulfillment.lastFulfill;
        }

        if (!lastFulfill) return '--';

        const daysAgo = Utility.getDaysBetween(new Date(), lastFulfill);

        if (daysAgo === 0) {
            return '(today)';
        } else if (daysAgo === 1) {
            return '(yesterday)';
        } else {
            return `(${daysAgo > 99 ? '99+' : daysAgo} days)`
        }
    }

    onToggleLskFulfill = () => {
        const willCollapsing = !this.state.collapseView;

        this.setState({ collapseView: willCollapsing }); //won't effect immediately, so leverage 'newValue' here

        if (!willCollapsing) {
            this.setState({
                lskFulfill: AppConst.defaultFulfillDay
            });

            setTimeout(() => {
                document.querySelector('#intro-lsk-fulfill-' + this.props.fulfillment.id).select();
            });

            this.getHistoryRecords(this.state.lskLoad, 'toggle-fulfill-button');
        }
    }

    onSubmitFulfillment = (e) => {
        e.preventDefault();
        if (this.state.isSendingLskFulfill) return;

        this.setState({ isSendingLskFulfill: true });

        let userInput = this.state.lskFulfill.substring(0, Math.min(AppConst.maxFulfillmentLength, this.state.lskFulfill.length));
        let inputLsk = userInput, remark;
        let inputUnits = userInput.split(';');

        if (inputUnits.length === 1) inputUnits = userInput.split('；'); //Chinese char

        if (inputUnits.length > 1) {
            inputLsk = inputUnits[0].trim();
            remark = inputUnits[1].trim();
        }

        routineService.fulfillRoutine(this.props.fulfillment, inputLsk, remark).then(result => {
            //console.log('submit returned', result);
            if (result && result.success) {
                this.setState({
                    lskFulfill: '',
                    isSendingLskFulfill: false,
                    collapseView: true
                });
            } else {
                this.setState({
                    isSendingLskFulfill: false,
                    collapseView: false
                });
            }

            this.props.afterSubmitFulfillment(result, this.props.fulfillment.id);
        });
    };

    getHistoryRecords(lsk, source) {
        console.log('get history record - ', source, this.props.fulfillment.id);
        if (this.state.isLoadingHistoryRecords) return;

        this.setState({ isLoadingHistoryRecords: true });

        routineService.getHistoryRecords(lsk, this.props.fulfillment.id, AppConst.stagedHistory).then(result => {

            this.setState({
                isLoadingHistoryRecords: false,
                showLoadMore: result && result.success && result.data && result.data.hasArchived
            })

            this.props.afterHistoryLoaded(result, this.props.fulfillment.id);
        });
    }

    afterMoreHistoryLoaded = (result) => {
        if (result && result.success && result.data) {
            this.setState({ showLoadMore: false });
        }

        this.props.afterMoreHistoryLoaded(result, this.props.fulfillment.id);
    }

    beforeCallDeleteRoutine = () => {
        this.setState({ isDeletingRoutine: true });
    }

    afterDeleteRoutineReturned = (result, routine) => {
        this.setState({
            isDeletingRoutine: false,
            collapseView: true
        });

        this.props.afterDeleteRoutineReturned(result, routine);
    }

    afterDeleteHistoryReturned = (result, history) => {
        //force to collapse view, so it will reload data next time it expands, not efficient way
        //but do it this way now, alternatively, just return the deleted history and merge it with existing data
        if (result && result.success) {
            this.setState({ collapseView: true });
        }

        this.props.afterDeleteHistoryReturned(result, history);
    }
}

FulfillmentView.propTypes = {
    // fulfillment: PropTypes.object, //optional is not chained with 'isRequired'
    fulfillment: PropTypes.object.isRequired,
    showRemark: PropTypes.bool.isRequired,
    showDeletedRoutine: PropTypes.bool.isRequired,
    showDeletedHistory: PropTypes.bool.isRequired,
    afterHistoryLoaded: PropTypes.func.isRequired,
    afterSubmitFulfillment: PropTypes.func.isRequired,
    afterMoreHistoryLoaded: PropTypes.func.isRequired,
    afterDeleteRoutineReturned: PropTypes.func.isRequired,
    afterDeleteHistoryReturned: PropTypes.func.isRequired
}

export default FulfillmentView;