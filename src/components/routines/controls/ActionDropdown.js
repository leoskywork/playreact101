import React from 'react';
import PropTypes from 'prop-types';
import DropdownItem from 'react-bootstrap/DropdownItem';

import './StyleControls.css'
// import routineService from '../../../services/RoutineService';


export class ActionDropdown extends React.Component {
    actionKeys = {
        delete: "Delete",
        Recursive: "Recursive"
    }

    constructor(props) {
        super(props);

        this.state = {
            actions: [this.actionKeys.Recursive, this.actionKeys.delete]
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return <React.Fragment>
            {this.state.actions.map(action =>
                <DropdownItem
                    key={'fulfillment-op-' + action}
                    onClick={() => this.onClickDropdownItem(action)}
                    as="button">{action}
                </DropdownItem>
            )}
        </React.Fragment>
    }

    onClickDropdownItem = (action) => {
        console.log('click dropdown item', action);

        if (action === this.actionKeys.delete) {
            this.deleteAfterConfirm();
        } else if (action === this.actionKeys.Recursive) {
            this.setupRecursive();
        }
    }

    setupRecursive() {

    }

    deleteAfterConfirm() {

    }


}

ActionDropdown.propTypes = {
    fulfillment: PropTypes.object.isRequired
}

export default ActionDropdown;