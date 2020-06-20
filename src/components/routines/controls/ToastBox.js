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

        this.severityMap = {
            success: {
                css: 'success',
                title: 'Success'
            },
            fail: {
                css: 'fail',
                title: 'Error'
            },
            default: {
                css: '',
                title: ''
            }

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
            delay={10 * 1000}
            autohide
            className={`toast-box ${this.severityMap[this.props.severity].css || ''}`}>
            <ToastHeader>
                <strong className="mr-auto">{this.props.title || 'Notification'} {this.severityMap[this.props.severity].title}</strong>
                <small>just now</small>
            </ToastHeader>
            <ToastBody>
                {this.props.message}
            </ToastBody>
        </Toast>
    }

    onClose = () => {
        // this.setState({ internalShow: false });
        console.log('toast box onClose', this.props.title, this.props.message);

        this.props.onClose();
    }
}

ToastBox.propTypes = {
    show: PropTypes.bool.isRequired,
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    severity: PropTypes.string
}

export default ToastBox;