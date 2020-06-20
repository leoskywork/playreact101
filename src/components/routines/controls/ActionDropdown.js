import React from 'react';
import PropTypes from 'prop-types';
import DropdownItem from 'react-bootstrap/DropdownItem';
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import ModalTitle from 'react-bootstrap/ModalTitle';
import Button from 'react-bootstrap/Button';

import './StyleControls.css'
import routineService from '../../../services/RoutineService';
import AppConst from '../../../common/AppConst';


export class ActionDropdown extends React.Component {
    actionKeys = {
        delete: "Delete",
        Recursive: "Recursive"
    }

    constructor(props) {
        super(props);

        this.state = {
            actions: [this.actionKeys.Recursive, this.actionKeys.delete],
            isConfirmingDelete: false,
            inputLsk: ''

        }
    }

    componentDidMount() {
        console.log('action dropdown', this.props.fulfillment.id, 'did mount');
    }

    componentWillUnmount() {
        console.log('action dropdown', this.props.fulfillment.id, 'will unmount');
    }

    render() {
        return <React.Fragment>
            {this.state.actions.map(action =>
                <DropdownItem key={'fulfill-op-' + action} onClick={() => this.onClickDropdownItem(action)} as="button">{action}
                </DropdownItem>
            )}
            {<Modal show={this.state.isConfirmingDelete} onHide={this.dismissDeleteConfirm} centered>
                <ModalHeader closeButton><ModalTitle>Delete Routine</ModalTitle></ModalHeader>
                <ModalBody>
                    <div>Please input a reason for deleting '{this.props.fulfillment.name}'</div>
                    <div>
                        <input
                            type="text"
                            id="intro-lsk-delete-reason"
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
        </React.Fragment>
    }

    onClickDropdownItem = (action) => {
        console.log('click dropdown item', action);

        if (action === this.actionKeys.delete) {
            this.setState({ isConfirmingDelete: true });
            setTimeout(() => {
                document.querySelector("#intro-lsk-delete-reason").select();
            });
        } else if (action === this.actionKeys.Recursive) {
            //todo, setupRecursive
        }
    }

    deleteAfterConfirm = () => {
        this.setState({ isConfirmingDelete: false });

        if (!this.state.inputLsk) return;

        this.props.beforeCallDeleteRoutine();

        let inputUnits = this.state.inputLsk.split(AppConst.comma);
        if (inputUnits.length === 1) inputUnits = inputUnits.splice(AppConst.commaCN);

        let deleteReason = null;
        if (inputUnits.length > 1) deleteReason = inputUnits[1].trim();

        routineService.deleteRoutine(this.props.fulfillment, deleteReason, inputUnits[0].trim()).then(result => {

            this.props.afterDeleteRoutineReturned(result, this.props.fulfillment);
        });
    }

    dismissDeleteConfirm = () => {
        this.setState({ isConfirmingDelete: false });

        if (!AppConst.isDev) {
            this.setState({ inputLsk: '' });
        }
    }




}

ActionDropdown.propTypes = {
    fulfillment: PropTypes.object.isRequired,
    beforeCallDeleteRoutine: PropTypes.func.isRequired,
    afterDeleteRoutineReturned: PropTypes.func.isRequired
}

export default ActionDropdown;