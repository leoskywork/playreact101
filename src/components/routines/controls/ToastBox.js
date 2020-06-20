import React from 'react';
import PropTypes from 'prop-types';
import Toast from 'react-bootstrap/Toast';
import ToastHeader from 'react-bootstrap/ToastHeader';
import ToastBody from 'react-bootstrap/ToastBody';


export class ToastBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            internalShow: true
        }
    }

    componentDidMount() {
        console.log('toast box componentDidMount', this.state.internalShow);
    }

    componentWillUnmount() {
        console.log('toast box componentWillUnmount', this.state.internalShow);
    }

    render() {
        return <Toast
            onClose={this.onClose}
            show={this.props.show && this.state.internalShow}
            delay={5 * 1000}
            autohide
            className="toast-box">
            <ToastHeader>
                <strong className="mr-auto">{this.props.title || 'Notification'}</strong>
                <small>just now</small>
            </ToastHeader>
            <ToastBody>
                {this.props.message}
            </ToastBody>
        </Toast>
    }

    onClose = () => {
        // this.setState({ internalShow: false });
        console.log('toast box onClose', this.props.onClose);

        this.props.onClose();
    }
}

ToastBox.propTypes = {
    show: PropTypes.bool.isRequired,
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
}

export default ToastBox;