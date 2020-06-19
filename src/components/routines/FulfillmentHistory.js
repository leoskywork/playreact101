import React from 'react';
import './StyleRoutines.css';
import AppConst from '../../common/AppConst';
import Utility from '../../common/Utility';
import routineService from '../../services/RoutineService';
import PropTypes from 'prop-types'


export class FulfillmentHistory extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lskLoad: '',
            isLoadingMoreHistory: false,
            archivedFulfillments: null,
            className: 'FulfillmentHistory'
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return this.hasRecords() ? (
            <div>
                <ul className="intro-fulfill-history">
                    {this.getAllRecordsDesc().map((r, i, arr) => (
                        <li key={i}
                            hidden={r.isDeleted && !this.props.showDeletedHistory}
                            title={`loaded fulfillments ${arr.length}${this.getTooltip(r)}`}>
                            <span className="intro-fulfill-history-item">
                                <span hidden={!r.isDeleted}>*** </span>
                                {this.getHistoryFulfillDescription(i, arr)}{r.remark ? (this.props.showRemark ? ', ' + r.remark : ' ...') : ''}
                            </span>
                        </li>
                    ))}
                    <li key='load-more' hidden={!this.props.showLoadMore}>
                        <button className="btn-intro-common" disabled={this.state.isLoadingMoreHistory} onClick={e => this.onLoadMoreHistory(e)}>MORE</button>
                    </li>
                </ul>
            </div>
        ) : null
    }

    getTooltip(history) {
        return `${history.remark ? ', ' + history.remark : ''}${history.isDeleted && history.deleteReason ? ', del: ' + history.deleteReason : ''}`;
    }

    hasRecords() {
        const fulfillment = this.props.fulfillment;
        if (fulfillment.historyFulfillments && fulfillment.historyFulfillments.length > 0) return true;
        return false;
    }

    getAllRecordsDesc() {
        const allRecords = [];
        const archived = this.state.archivedFulfillments;
        const fulfillment = this.props.fulfillment;
        const staged = fulfillment.historyFulfillments;

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

        if (index === allRecordsDesc.length - 1) return `fulfill at ${formattedDate}, base`; //no offset since this is the first fulfillment ever

        const priorDate = allRecordsDesc[index + 1].time;
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
}

FulfillmentHistory.propTypes = {
    showRemark: PropTypes.bool.isRequired,
    showLoadMore: PropTypes.bool.isRequired,
    showDeletedHistory: PropTypes.bool.isRequired,
    fulfillment: PropTypes.object.isRequired,
    afterHistoryLoaded: PropTypes.func.isRequired,
    afterMoreHistoryLoaded: PropTypes.func.isRequired
}

export default FulfillmentHistory;