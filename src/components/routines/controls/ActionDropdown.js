import React from 'react';
import PropTypes from 'prop-types';
import DropdownItem from 'react-bootstrap/DropdownItem';
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import ModalTitle from 'react-bootstrap/ModalTitle';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import './StyleControls.css'
import routineService from '../../../services/RoutineService';
import AppConst from '../../../common/AppConst';


export class ActionDropdown extends React.Component {
    actionKeys = {
        recursive: "Recursive",
        delete: "Delete"
    }

    constructor(props) {
        super(props);

        this.state = {
            actions: [this.actionKeys.recursive, this.actionKeys.delete],
            isConfirmingDelete: false,
            inputLsk: '',
            inputRecursiveLsk: 'not-now',
            showRecursiveDialog: false,
            enableSchedule: this.props.fulfillment.enableSchedule || false,
            recursiveIntervalDays: this.props.fulfillment.recursiveIntervalDays || AppConst.defaultRecursiveDays
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
                <DropdownItem
                    key={'fulfill-op-' + action}
                    onClick={() => this.onClickDropdownItem(action)}
                    as="button">
                    {action === this.actionKeys.recursive && this.props.fulfillment.enableSchedule && <span className="check-mark"></span>}
                    {action}
                </DropdownItem>
            )}

            {<Modal show={this.state.isConfirmingDelete} onHide={this.dismissDeleteDialog} centered>
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
                    <Button variant="secondary" onClick={this.dismissDeleteDialog}>Cancel</Button>
                    <Button variant="danger" onClick={this.deleteAfterConfirm} disabled={!this.state.inputLsk}>Delete</Button>
                </ModalFooter>
            </Modal>}

            {<Modal show={this.state.showRecursiveDialog} onHide={this.dismissRecursiveDialog} centered>
                <ModalHeader closeButton><ModalTitle>Update Recursive</ModalTitle></ModalHeader>
                <ModalBody>
                    <div>
                        <ButtonGroup toggle>
                            {[true, false].map((flag, i) => (<ToggleButton
                                key={i} type="radio" variant="outline-secondary" name={flag.toString()} value={flag}
                                checked={this.state.enableSchedule === flag}
                                onChange={this.onEnableOrDisableSchedule}>{flag ? "Enable" : "Disable"}</ToggleButton>
                            ))}
                        </ButtonGroup>
                    </div>
                    <div id="intro-lsk-recursive-interval">
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>Interval days</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                type="number"
                                name="recursiveIntervalDays"
                                value={this.state.recursiveIntervalDays}
                                onChange={(e) => this.setState({ [e.target.name]: parseInt(e.target.value) })}
                                disabled={!this.state.enableSchedule}
                                min="1"
                                autoComplete="off"
                                maxLength={AppConst.maxNumberLength}
                                placeholder="please input a number"
                            ></FormControl>
                        </InputGroup>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={this.dismissRecursiveDialog}>Cancel</Button>
                    <Button variant="danger" onClick={this.updateRecursive} disabled={!this.shouldEnableUpdateRecursive()}>Update</Button>
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
        } else if (action === this.actionKeys.recursive) {
            this.setState({ showRecursiveDialog: true });
        }
    }

    onEnableOrDisableSchedule = (e) => {
        this.setState({ enableSchedule: e.currentTarget.value === 'true' ? true : false });
    }

    updateRecursive = () => {
        this.setState({ showRecursiveDialog: false });

        if (!this.shouldEnableUpdateRecursive()) return;

        routineService.updateRecursive(this.state.inputRecursiveLsk, this.props.fulfillment, this.state.enableSchedule, this.state.recursiveIntervalDays)
            .then(result => {
                this.props.afterUpdateRecursiveReturned(result);
            })
    }

    shouldEnableUpdateRecursive() {
        return this.state.enableSchedule !== this.props.fulfillment.enableSchedule
            || (this.state.enableSchedule && this.state.recursiveIntervalDays !== this.props.fulfillment.recursiveIntervalDays && this.state.recursiveIntervalDays > 0);
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

    dismissDeleteDialog = () => {
        this.setState({ isConfirmingDelete: false });

        if (!AppConst.isDev) {
            this.setState({ inputLsk: '' });
        }
    }

    dismissRecursiveDialog = () => {
        this.setState({ showRecursiveDialog: false });
    }



}

ActionDropdown.propTypes = {
    fulfillment: PropTypes.object.isRequired,
    beforeCallDeleteRoutine: PropTypes.func.isRequired,
    afterDeleteRoutineReturned: PropTypes.func.isRequired,
    afterUpdateRecursiveReturned: PropTypes.func.isRequired
}

export default ActionDropdown;