import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import ModalTitle from 'react-bootstrap/ModalTitle';

import AppConst from '../../common/AppConst';
import Utility from '../../common/Utility';
import routineService from '../../services/RoutineService';
import './StyleRoutines.css';


export class FulfillmentHistory extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lskLoad: '',
            isLoadingMoreHistory: false,
            archivedFulfillments: null,
            className: 'FulfillmentHistory',
            //for ui appearance
            currentHistory: null,
            //for api call
            internalSelectedHistory: null,
            isConfirmingDelete: false,
            isDeleting: false,
            inputLsk: ''
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {

        const selectedTime = this.state.internalSelectedHistory && this.state.internalSelectedHistory.time;

        return this.hasRecords() && (<div>
            <ul className="intro-fulfill-history" onMouseLeave={() => this.setState({ currentHistory: null })}>
                {this.getAllRecordsDesc().map((r, i, arr) => (
                    <li key={i}
                        hidden={r.isDeleted && !this.props.showDeletedHistory}
                        onMouseEnter={() => this.setState({ currentHistory: r })}
                        title={`loaded fulfillments ${arr.length}${this.getTooltip(r)}`}>
                        <span className={`intro-fulfill-history-item ${r.isDeleted && 'deleted-item'}`}>
                            {this.getHistoryFulfillDescription(i, arr)}{r.remark && (this.props.showRemark ? `,  ${r.remark}` : ' ...')}
                            {r.isDeleted && this.props.showDeletedHistory && !!r.deleteReason && `, del reason: ${r.deleteReason}`}
                        </span>
                        {!this.props.fulfillment.isDeleted && !r.isDeleted && (
                            <Button
                                className="btn-round"
                                title="delete record"
                                hidden={this.state.currentHistory !== r}
                                disabled={this.state.isDeleting}
                                onClick={() => this.onClickDeleteButton(r)}
                                variant="danger">
                                <span className="minus-sign"></span>
                            </Button>)}
                    </li>))}
                <li key='load-more' hidden={!this.props.showLoadMore}>
                    <button
                        className="btn-intro-common"
                        disabled={this.state.isLoadingMoreHistory || this.state.isDeleting}
                        onClick={e => this.onLoadMoreHistory(e)}>MORE</button>
                </li>
            </ul>

            {<Modal show={this.state.isConfirmingDelete} onHide={this.dismissDeleteConfirm} centered>
                <ModalHeader closeButton><ModalTitle>Delete History</ModalTitle></ModalHeader>
                <ModalBody>
                    <div>Please input a reason for deleting record '{selectedTime && selectedTime.toLocaleDateString().split('/').join('.')}'</div>
                    <div>
                        <input
                            type="text"
                            id="intro-lsk-delete-history-reason"
                            name="inputLsk"
                            value={this.state.inputLsk}
                            onChange={(e) => this.setState({ inputLsk: e.target.value })}
                            autoComplete="off"
                            maxLength={AppConst.maxFulfillmentLength}
                            placeholder="lsk; delete reason"></input>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={this.dismissDeleteConfirm}>Cancel</Button>
                    <Button variant="danger" onClick={this.deleteAfterConfirm} disabled={!this.state.inputLsk}>Delete</Button>
                </ModalFooter>
            </Modal>}
        </div>)
    }

    dismissDeleteConfirm = () => {
        this.setState({ isConfirmingDelete: false });

        if (!AppConst.isDev) {
            this.setState({ inputLsk: '' });
        }
    }

    deleteAfterConfirm = () => {
        this.setState({ isConfirmingDelete: false });

        const selectedHistory = this.state.internalSelectedHistory;
        if (!this.state.inputLsk || !selectedHistory) return;

        let inputUnits = this.state.inputLsk.split(AppConst.comma);
        if (inputUnits.length === 1) inputUnits = inputUnits.splice(AppConst.commaCN);

        let deleteReason = '';
        if (inputUnits.length > 1) deleteReason = inputUnits[1].trim();

        const kind = this.props.fulfillment.historyFulfillments.indexOf(selectedHistory) > -1 ? AppConst.stagedHistory : AppConst.archivedHistory;

        this.setState({ isDeleting: true });

        routineService.deleteRoutineHistory(selectedHistory, deleteReason, kind, inputUnits[0].trim()).then(result => {
            this.setState({ isDeleting: false });
            this.props.afterDeleteHistoryReturned(result, selectedHistory);
        });
    }

    getTooltip(history) {
        return `${history.remark ? ', ' + history.remark : ''}${history.isDeleted && history.deleteReason ? ', deleted due to: ' + history.deleteReason : ''}`;
    }

    hasRecords() {
        return this.props.fulfillment.historyFulfillments && this.props.fulfillment.historyFulfillments.length > 0;
    }

    getAllRecordsDesc() {
        const allRecords = [];
        const archived = this.state.archivedFulfillments;
        const staged = this.props.fulfillment.historyFulfillments;

        if (archived && archived.length > 0) {
            allRecords.push(...archived);
        }

        if (staged && staged.length > 0) {
            allRecords.push(...staged);
        }

        return allRecords.length > 0 ? allRecords.reverse() : null;
    }

    getHistoryFulfillDescription(index, allRecordsDesc) {
        if (!allRecordsDesc || allRecordsDesc.length === 0) return;

        const currentDate = allRecordsDesc[index].time;
        const formattedDate = currentDate.toLocaleDateString().split('/').join('.');

        if (this.props.showDeletedHistory) {

            if (index === allRecordsDesc.length - 1) return `fulfill at ${formattedDate}, base`; //no offset since this is the first fulfillment ever

            const priorDate = allRecordsDesc[index + 1].time;
            const daysSincePrior = Utility.getDaysBetween(currentDate, priorDate);

            return `fulfill at ${formattedDate}, offset ${daysSincePrior}`;
        }

        if (allRecordsDesc[index].isDeleted) return `fulfill at ${formattedDate}`;

        let priorDate;

        for (let offset = 1; index + offset < allRecordsDesc.length; offset++) {
            if (!allRecordsDesc[index + offset].isDeleted) {
                priorDate = allRecordsDesc[index + offset].time;
                break;
            }
        }

        if (!priorDate) return `fulfill at ${formattedDate}, base`;

        const daysSincePrior = Utility.getDaysBetween(currentDate, priorDate);

        return `fulfill at ${formattedDate}, offset ${daysSincePrior}`;

    }

    onLoadMoreHistory(e) {
        e.preventDefault();
        if (this.state.isLoadingMoreHistory) return;

        this.setState({ isLoadingMoreHistory: true });

        routineService.getHistoryRecords(this.state.lskLoad, this.props.fulfillment.id, AppConst.archivedHistory).then(result => {
            this.setState({ isLoadingMoreHistory: false });

            if (result && result.success && result.data) {
                this.setState({ archivedFulfillments: result.data });
            }

            this.props.afterMoreHistoryLoaded(result);
        });
    }

    onClickDeleteButton = (history) => {
        //  e.preventDefault();

        this.setState({
            currentHistory: history,
            internalSelectedHistory: history,
            isConfirmingDelete: true
        });

        setTimeout(() => {
            document.querySelector('#intro-lsk-delete-history-reason').select();
        })
    }
}

FulfillmentHistory.propTypes = {
    showRemark: PropTypes.bool.isRequired,
    showLoadMore: PropTypes.bool.isRequired,
    showDeletedHistory: PropTypes.bool.isRequired,
    fulfillment: PropTypes.object.isRequired,
    afterHistoryLoaded: PropTypes.func.isRequired,
    afterMoreHistoryLoaded: PropTypes.func.isRequired,
    afterDeleteHistoryReturned: PropTypes.func.isRequired
}

export default FulfillmentHistory;