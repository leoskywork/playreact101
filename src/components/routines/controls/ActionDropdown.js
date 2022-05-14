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
            syncParent: false
            // enableSchedule: this.props.fulfillment.enableSchedule || false,
            // recursiveIntervalDays: this.props.fulfillment.recursiveIntervalDays || AppConst.defaultRecursiveDays
        }

    }

    // syncEnableScheduleWithParent(){
    //     if(this.state.enableSchedule !== this.props.fulfillment.enableSchedule || this.state.recursiveIntervalDays !== this.props.fulfillment.recursiveIntervalDays){
    //         this.setState({ 
    //             enableSchedule: this.props.fulfillment.enableSchedule || false,
    //             recursiveIntervalDays: this.props.fulfillment.recursiveIntervalDays || AppConst.defaultRecursiveDays
    //         });
    //     }
    // }

    static getDerivedStateFromProps(props, state) {
        console.log('action dropdown - getDerivedStateFromProps()')
    
        if(!state.syncParent){
            return {
                syncParent: true,
                enableSchedule: props.fulfillment.enableSchedule || false,
                recursiveIntervalDays: props.fulfillment.recursiveIntervalDays || AppConst.defaultRecursiveDays
            };
        }

        return null;
    }

    componentDidMount() {
        console.log('action dropdown', this.props.fulfillment.name, 'did mount');
    }

    componentWillUnmount() {
        console.log('action dropdown', this.props.fulfillment.name, 'will unmount');
    }

    render() {
        console.log('ActionDropDown - render()');
       // this.syncEnableScheduleWithParent();

        return <React.Fragment>
            {this.state.actions.map(action =>
                <DropdownItem
                    key={'fulfill-op-' + action}
                    onClick={() => this.onClickDropdownItem(action)}
                    disabled={this.props.fulfillment.isDeleted}
                    as="button">
                    {action === this.actionKeys.recursive && this.props.fulfillment.enableSchedule && <span className="check-mark"></span>}
                    {action}
                    {action === this.actionKeys.recursive && this.props.fulfillment.enableSchedule && ` (${this.getRecursiveDaysString()})`}
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

            {<Modal show={this.state.showRecursiveDialog} onHide={this.dismissRecursiveDialog} centered className='22-test'>
                <ModalHeader closeButton><ModalTitle>Update Recursive</ModalTitle></ModalHeader>
                <ModalBody>
                    <div>
                        <ButtonGroup>
                            {[true, false].map((flag, i) => (<ToggleButton
                                key={i} id={"recursive-toggle-" + i} type="radio" variant="outline-secondary" name="radio" value={flag}
                                checked={this.state.enableSchedule === flag}
                                onChange={this.onEnableOrDisableSchedule}>{flag ? "Enable" : "Disable"}</ToggleButton>
                            ))}
                        </ButtonGroup>
                    </div>
                    <div id="intro-lsk-recursive-interval">
                        <InputGroup>
                            <InputGroup.Text>Interval days</InputGroup.Text>
                            <FormControl
                                type="number"
                                name="recursiveIntervalDays"
                                value={this.state.recursiveIntervalDays}
                                onChange={this.onChangeRecursiveInterval}
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
        //console.log(e.currentTarget.value, e);
        //need to ensure the value is a boolean value, lots of codes dependent on it
        this.setState({ enableSchedule: (e.currentTarget.value === true || e.currentTarget.value === "true") });
    }

    onChangeRecursiveInterval = (e) => {
        console.log('----- change interval', e.target.name, e.target.value);

        const newNumber = parseInt(e.target.value);

        this.setState({ [e.target.name]: isNaN(newNumber) ? '' : newNumber });
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
        if (this.state.enableSchedule !== this.props.fulfillment.enableSchedule) {
            if (!this.state.enableSchedule) return true;
            if (this.state.enableSchedule && this.state.recursiveIntervalDays > 0) return true;

            return false;
        }

        if (!this.state.enableSchedule) return false;
        if (this.state.recursiveIntervalDays !== this.props.fulfillment.recursiveIntervalDays && this.state.recursiveIntervalDays > 0) return true;

        return false;
    }

    deleteAfterConfirm = () => {
        this.setState({ isConfirmingDelete: false });

        if (!this.state.inputLsk) return;

        this.props.beforeCallDeleteRoutine();

        let inputUnits = this.state.inputLsk.split(AppConst.comma);
        if (inputUnits.length === 1) inputUnits = inputUnits.splice(AppConst.commaCN);

        let deleteReason = '';
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

    getRecursiveDaysString() {
        return `${this.props.fulfillment.recursiveIntervalDays} day${this.props.fulfillment.recursiveIntervalDays > 1 ? 's' : ''}`;
    }

}

ActionDropdown.propTypes = {
    fulfillment: PropTypes.object.isRequired,
    beforeCallDeleteRoutine: PropTypes.func.isRequired,
    afterDeleteRoutineReturned: PropTypes.func.isRequired,
    afterUpdateRecursiveReturned: PropTypes.func.isRequired
}

export default ActionDropdown;