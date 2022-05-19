import React, { Component } from 'react';
import { Animated } from 'react-native';

import PropTypes from 'prop-types';
import ButtonView from './ButtonView';

class AwesomeButton extends Component {
    static propTypes = {
        states: PropTypes.object.isRequired,
        buttonState: PropTypes.string,
        transitionDuration: PropTypes.number
    };

    constructor(props) {
        super(props);
        this.state = {
            viewState: this.props.states[this.props.buttonState] ||
            this.props.states[Object.keys(this.props.states)[0]],
            backgroundColor: new Animated.Value(0.0)
        };
    }

    static getDerivedStateFromProps(newProps, state) {
        if (newProps.buttonState) {
            return ({
                viewState: newProps.states[newProps.buttonState],
                prevBackgroundColor: state.viewState.backgroundStyle.backgroundColor
            });
        }
        return null;
    }

    componentDidUpdate() {
        this.state.backgroundColor.setValue(0);
        this.startAnimation();
    }

    startAnimation() {
        Animated.timing(
            this.state.backgroundColor,
            {
                toValue: 1.0,
                duration: this.props.transitionDuration,
                useNativeDriver: true
            }
        ).start();
    }

    render() {
        const {
            backgroundStyle,
            labelStyle,
            text,
            spinner,
            onPress,
            icon,
            iconAlignment,
            spinnerProps
        } = this.state.viewState;
        const backgroundColor = this.state.backgroundColor.interpolate({
            inputRange: [0, 1],
            outputRange: this.state.prevBackgroundColor ?
                [this.state.prevBackgroundColor, backgroundStyle.backgroundColor]
                : [backgroundStyle.backgroundColor, backgroundStyle.backgroundColor]
        });
        return (
            <ButtonView
                backgroundStyle={[backgroundStyle, { backgroundColor }]}
                labelStyle={labelStyle}
                text={text}
                spinner={spinner}
                spinnerProps={spinnerProps}
                onPress={onPress}
                disabled={!onPress}
                icon={icon}
                iconAlignment={iconAlignment}
            />
        );
    }
}

AwesomeButton.defaultProps = {
    buttonState: 'default',
    transitionDuration: 200
};

export default AwesomeButton;
