import React from 'react';
import './StyleRoutines.css';
import AppConst from '../../common/AppConst';
import Utility from '../../common/Utility';
import routineService from '../../services/RoutineService';
import PropTypes from 'prop-types'
import FulfillmentArchive from '../../models/FulfillmentArchive';


export class FulfillmentHistory extends React.Component {
    state = {
        lskLoad: '',
        isLoadingMoreHistory: false,
        archivedFulfillments: null,
        className: 'FulfillmentHistory'
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
                        <li key={i} title={`loaded fulfillments ${arr.length}${r.remark ? ', ' + r.remark : ''}`}>
                            <span className="intro-fulfill-history-item">
                                {this.getHistoryFulfillDescription(i, arr)}{r.remark ? (this.props.showRemark ? ', ' + r.remark : ' ...') : ''}
                            </span>
                        </li>
                    ))}
                    {this.props.fulfillment.hasArchived && this.props.showLoadMore ?
                        (<li key='load-more'>
                            <button className="btn-intro-common" disabled={this.state.isLoadingMoreHistory} onClick={e => this.onLoadMoreHistory(e)}>MORE</button>
                        </li>) : null}
                </ul>
            </div>
        ) : null
    }


    hasRecords() {
        const fulfillment = this.props.fulfillment;
        if (fulfillment.historyFulfillments && fulfillment.historyFulfillments.length > 0) return true;
        if (fulfillment.lastFulfill) return true;
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

        if (fulfillment.lastFulfill) {
            allRecords.push(FulfillmentArchive.fromLastFulfill(fulfillment, 'mock-last-fulfill'));
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

        routineService.getHistoryRecords(this.state.lskLoad, this.props.fulfillment.id, AppConst.ArchivedHistory).then(result => {
            this.setState({ isLoadingMoreHistory: false });

            if (result && result.success && result.data) {
                // const newFulfillment = { ...this.state.fulfillment };
                // newFulfillment.archivedFulfillments = result.data;
                // this.setState({ fulfillment: newFulfillment });

                this.setState({ archivedFulfillments: result.data });
            }

            this.props.afterMoreHistoryLoaded(result);
        });
    }
}

FulfillmentHistory.propTypes = {
    showRemark: PropTypes.bool.isRequired,
    showLoadMore: PropTypes.bool.isRequired,
    fulfillment: PropTypes.object.isRequired,
    afterHistoryLoaded: PropTypes.func.isRequired,
    afterMoreHistoryLoaded: PropTypes.func.isRequired
}

export default FulfillmentHistory;